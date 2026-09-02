import os
import logging
from io import BytesIO
from typing import Dict
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from config import PDF_OUTPUT_DIR

logger = logging.getLogger(__name__)

def generate_pdf_report(inspection_data: Dict) -> bytes:
    """
    Generates a statutory Legal Metrology PDF Report using Python ReportLab.
    Returns PDF raw bytes.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        fontName='Helvetica-Bold'
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        fontName='Helvetica-Bold'
    )
    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#64748b'),
        fontName='Helvetica'
    )
    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#0f172a'),
        fontName='Helvetica-Bold'
    )
    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#0f172a'),
        fontName='Helvetica-Bold'
    )
    cell_text = ParagraphStyle(
        'CellText',
        parent=styles['Normal'],
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1e293b'),
        fontName='Helvetica'
    )

    elements = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>PackSure</b> - Legal Metrology AI", title_style),
            Paragraph(f"<b>REPORT ID:</b> REP-{inspection_data.get('id', 'N/A')}<br/><b>DATE:</b> {inspection_data.get('date', '')[:10]}", meta_label)
        ]
    ]
    t_header = Table(header_data, colWidths=[340, 200])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT')
    ]))
    elements.append(t_header)
    elements.append(Paragraph("DEPARTMENT OF CONSUMER AFFAIRS | LEGAL METROLOGY CELL", subtitle_style))
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0f172a'), spaceAfter=12))

    # 2. Product & Enforcement Metadata Table
    meta_grid = [
        [Paragraph("Product Name:", meta_label), Paragraph(inspection_data.get('productName', 'N/A'), meta_val),
         Paragraph("Inspector Officer:", meta_label), Paragraph(inspection_data.get('inspectorName', 'Enforcement Inspector'), meta_val)],
        [Paragraph("Brand / Packer:", meta_label), Paragraph(inspection_data.get('brand', 'N/A'), meta_val),
         Paragraph("Facility / Location:", meta_label), Paragraph(inspection_data.get('location', 'N/A'), meta_val)],
        [Paragraph("Category:", meta_label), Paragraph(inspection_data.get('category', 'N/A'), meta_val),
         Paragraph("Reference Code:", meta_label), Paragraph(inspection_data.get('referenceNumber', 'N/A'), meta_val)]
    ]
    t_meta = Table(meta_grid, colWidths=[90, 180, 90, 180])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_meta)
    elements.append(Spacer(1, 12))

    # 3. Assessment Status Box
    status = inspection_data.get('status', 'Compliant')
    score = inspection_data.get('complianceScore', 100)
    bg_color = colors.HexColor('#dcfce7') if status == 'Compliant' else colors.HexColor('#fef3c7')
    text_color = colors.HexColor('#166534') if status == 'Compliant' else colors.HexColor('#92400e')

    status_data = [
        [
            Paragraph(f"<b>ASSESSMENT STATUS:</b> <font color='{text_color.hexval()}'>{status.upper()}</font>", title_style),
            Paragraph(f"<b>COMPLIANCE SCORE:</b> <font color='{text_color.hexval()}'>{score}%</font>", title_style)
        ]
    ]
    t_status = Table(status_data, colWidths=[340, 200])
    t_status.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_color),
        ('BOX', (0,0), (-1,-1), 1, text_color),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_status)
    elements.append(Spacer(1, 15))

    # 4. Mandatory Declarations Table
    elements.append(Paragraph("<b>MANDATORY LEGAL DECLARATIONS (PCR 2011 RULE 6)</b>", meta_val))
    elements.append(Spacer(1, 4))

    decl_rows = [[Paragraph("<b>Statutory Field</b>", cell_bold), Paragraph("<b>Extracted Value</b>", cell_bold), Paragraph("<b>Rule Ref</b>", cell_bold), Paragraph("<b>Status</b>", cell_bold)]]
    for d in inspection_data.get('declarations', []):
        decl_rows.append([
            Paragraph(d.get('field', ''), cell_bold),
            Paragraph(d.get('detectedValue', ''), cell_text),
            Paragraph(d.get('ruleRef', ''), cell_text),
            Paragraph(f"<b>{d.get('status', '')}</b>", cell_text)
        ])

    t_decl = Table(decl_rows, colWidths=[140, 240, 80, 80])
    t_decl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_decl)
    elements.append(Spacer(1, 15))

    # 5. Statutory Disclaimer
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0f172a'), spaceBefore=10, spaceAfter=8))
    elements.append(Paragraph("<b>OFFICIAL DISCLAIMER:</b> This AI-assisted assessment is generated by PackGuard for support of authorized inspection officers and does not constitute a final legal determination.", meta_label))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    # Save a copy locally
    try:
        out_path = os.path.join(PDF_OUTPUT_DIR, f"{inspection_data.get('id', 'report')}.pdf")
        with open(out_path, "wb") as f:
            f.write(pdf_bytes)
    except Exception as e:
        logger.warning(f"Could not write PDF copy to disk: {e}")

    return pdf_bytes
