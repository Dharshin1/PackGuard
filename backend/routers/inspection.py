import random
import datetime
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response, Request
from pydantic import BaseModel

from db.mongo import db_manager, in_memory_db
from services.storage_service import save_image_file
from services.cv_service import preprocess_image_opencv
from services.ocr_service import run_ocr_pipeline
from services.extractor_service import extract_statutory_declarations
from services.rule_engine import evaluate_legal_metrology_rules
from services.pdf_service import generate_pdf_report

router = APIRouter()

class AnalysisParams(BaseModel):
    productName: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = "Beverages & Packaged Liquids"
    location: Optional[str] = "Inspection Facility"
    referenceNumber: Optional[str] = None
    inspectorName: Optional[str] = "Enforcement Officer"

@router.post("/inspections/analyze")
async def analyze_package_inspection(
    request: Request,
    file: Optional[UploadFile] = File(None),
    productName: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    category: Optional[str] = Form("Beverages & Packaged Liquids"),
    location: Optional[str] = Form("Inspection Facility"),
    referenceNumber: Optional[str] = Form(None),
    inspectorName: Optional[str] = Form("Enforcement Officer"),
    image_url: Optional[str] = Form(None)
):
    """
    Core Pipeline:
    Product Image -> OpenCV Preprocessing -> PaddleOCR -> Declarations Extraction -> Rules Engine -> DB Save -> JSON Response
    """
    image_bytes = b""
    uploaded_url = image_url

    base_url = str(request.base_url)

    if file:
        image_bytes = await file.read()
        uploaded_url = await save_image_file(image_bytes, file.filename, base_url)
    elif image_url:
        import requests
        try:
            r = requests.get(image_url, timeout=5)
            if r.status_code == 200:
                image_bytes = r.content
        except Exception:
            pass

    if not uploaded_url:
        uploaded_url = "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80"

    # Step 1: OpenCV Preprocessing with Super-Resolution & ROI Contour Detection
    cv_img, roi_crops, cv_meta = preprocess_image_opencv(image_bytes)

    # Step 2: Multi-Pass PaddleOCR Extraction (Full Image + High-Res ROI Crops)
    ocr_result = run_ocr_pipeline(cv_img, roi_crops, productName or "Packaged Commodity")

    # Step 3: Information Extraction (Declarations Parser)
    declarations = extract_statutory_declarations(
        ocr_result["raw_text"],
        {"productName": productName, "brand": brand}
    )

    # Step 4: Compliance Rule Engine (Legal Metrology Rules 2011)
    checklist, issues, score, status = evaluate_legal_metrology_rules(
        declarations, ocr_result["raw_text"]
    )

    new_id = f"INS-2026-{random.randint(1000, 9999)}"
    ref_code = referenceNumber or f"REF-2026-{random.randint(1000, 9999)}"
    detected_pname = productName or (declarations[0]["detectedValue"] if declarations else "Uploaded Packaged Commodity")
    detected_brand = brand or (declarations[3]["detectedValue"] if len(declarations) > 3 else "Standard Packer")

    inspection_record = {
        "id": new_id,
        "productName": detected_pname,
        "brand": detected_brand,
        "category": category,
        "date": datetime.datetime.utcnow().isoformat(),
        "inspectorName": inspectorName,
        "inspectorId": "LM-OFF-409",
        "location": location,
        "referenceNumber": ref_code,
        "complianceScore": score,
        "status": status,
        "rawOcrText": ocr_result["raw_text"],
        "ocrConfidence": ocr_result["confidence"],
        "ocrSource": ocr_result["source"],
        "cvMeta": cv_meta,
        "summaryNotes": f"Processed via OpenCV & {ocr_result['source']}. Legal Metrology PCR 2011 rules evaluated.",
        "images": [
            {
                "id": f"img-{new_id}",
                "title": "Uploaded Package PDP Panel",
                "type": "Front",
                "url": uploaded_url,
                "annotations": [{"x": 35, "y": 60, "label": "PDP Label Box"}]
            }
        ],
        "declarations": declarations,
        "checklist": checklist,
        "issues": issues,
        "evidence": [
            {
                "id": f"ev-{iss['id']}",
                "title": iss["title"],
                "description": iss["reason"],
                "imageUrl": uploaded_url
            } for iss in issues
        ]
    }

    # Step 5: Save Record to Database (MongoDB / In-Memory)
    await db_manager.save_inspection(inspection_record)

    return inspection_record

@router.get("/inspections")
async def list_inspections():
    items = await db_manager.get_all_inspections()
    return {"data": items, "total": len(items)}

@router.get("/inspections/{inspection_id}")
async def get_inspection_details(inspection_id: str):
    record = await db_manager.get_inspection(inspection_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Inspection ID {inspection_id} not found.")
    return record

@router.get("/inspections/{inspection_id}/pdf")
async def download_inspection_pdf(inspection_id: str):
    record = await db_manager.get_inspection(inspection_id)
    if not record:
        # Generate on-the-fly sample if id not present
        record = {
            "id": inspection_id,
            "productName": "Packaged Commodity Sample",
            "brand": "Standard Packer Pvt Ltd",
            "category": "Consumer Packaged Goods",
            "date": datetime.datetime.utcnow().isoformat(),
            "inspectorName": "Enforcement Officer",
            "location": "Central Inspection Facility",
            "referenceNumber": f"REF-{inspection_id}",
            "status": "Requires Inspector Review",
            "complianceScore": 75,
            "declarations": [
                {"field": "Product Name", "detectedValue": "Sample Product", "ruleRef": "Rule 6(1)(a)", "status": "Detected"},
                {"field": "Maximum Retail Price (MRP)", "detectedValue": "₹150.00 (Incl. of all taxes)", "ruleRef": "Rule 6(1)(e)", "status": "Detected"},
                {"field": "Net Quantity", "detectedValue": "500 g", "ruleRef": "Rule 6(1)(c)", "status": "Detected"},
            ]
        }

    pdf_bytes = generate_pdf_report(record)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=LegalMetrology_Report_{inspection_id}.pdf"
        }
    )

@router.get("/dashboard")
async def get_dashboard_summary():
    items = await db_manager.get_all_inspections()
    total = len(items)
    review_count = sum(1 for i in items if i.get("status") in ["Requires Inspector Review", "Requires Review", "Potential Non-Compliance"])
    return {
        "totalInspections": total,
        "requiresReview": review_count,
        "reportsGenerated": total,
        "recentInspections": items[:5]
    }
