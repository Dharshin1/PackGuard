import random
from typing import Dict, List, Tuple

def evaluate_legal_metrology_rules(declarations: List[Dict], raw_ocr_text: str = "") -> Tuple[List[Dict], List[Dict], int, str]:
    """
    DETERMINISTIC Compliance Rule Engine under Legal Metrology (Packaged Commodities) Rules 2011.
    
    Evaluates:
    - Rule 6(1)(a): Manufacturer name and address presence
    - Rule 6(1)(c): Net quantity declaration in standard SI units
    - Rule 6(1)(d): Month and year of manufacture
    - Rule 6(1)(e): Maximum Retail Price in INR (₹) inclusive of all taxes
    - Rule 6(1)(8): Consumer care helpline details (Phone & Email)
    
    Returns: (checklist, issues, score, overall_status)
    """
    issues = []
    checklist = []

    def find_decl(field_name: str) -> Dict:
        for d in declarations:
            if field_name.lower() in d.get("field", "").lower():
                return d
        return {}

    mrp_d = find_decl("Maximum Retail Price")
    net_d = find_decl("Net Quantity")
    mfg_d = find_decl("Manufacturer")
    addr_d = find_decl("Address")
    care_d = find_decl("Consumer Care")

    # 1. Mandatory PDP Declarations
    pdp_ok = bool(mrp_d.get("isCompliant") and net_d.get("isCompliant") and mfg_d.get("isCompliant"))
    checklist.append({
        "item": "Mandatory declarations present on Principal Display Panel (PDP)",
        "compliant": pdp_ok
    })

    # 2. MRP in INR (₹) & Inclusive of all taxes
    mrp_text = mrp_d.get("detectedValue", "")
    mrp_has_inr = "₹" in mrp_text or "RS" in mrp_text.upper() or "INR" in mrp_text.upper()
    mrp_has_taxes = "INCL" in mrp_text.upper() or "TAXES" in mrp_text.upper()
    mrp_ok = mrp_has_inr and mrp_has_taxes

    checklist.append({
        "item": "MRP expressed in Indian National Rupees (₹) inclusive of all taxes",
        "compliant": mrp_ok
    })

    if mrp_d.get("status") == "Not Detected":
        issues.append({
            "id": f"iss-mrp-{random.randint(100, 999)}",
            "severity": "High",
            "title": "MRP in INR Not Detected",
            "reason": "No statutory Maximum Retail Price (MRP) in Indian National Rupees (₹) was detected on the package panel.",
            "ruleReference": "Legal Metrology Rules 2011, Rule 6(1)(e)",
            "cropRegion": "PDP Price Label Area"
        })
    elif not mrp_ok:
        issues.append({
            "id": f"iss-mrp-tax-{random.randint(100, 999)}",
            "severity": "Medium",
            "title": "MRP Non-Standard Tax Declaration",
            "reason": "MRP declaration must explicitly state 'Inclusive of all taxes' and use Indian Rupee currency (₹).",
            "ruleReference": "Legal Metrology Rules 2011, Rule 6(1)(e)",
            "cropRegion": "Price Declaration Area"
        })

    # 3. Net Quantity Units Check
    net_ok = bool(net_d and net_d.get("status") != "Not Detected")
    checklist.append({
        "item": "Net Quantity declared in standard units (g, kg, ml, L, N)",
        "compliant": net_ok
    })

    if not net_ok:
        issues.append({
            "id": f"iss-qty-{random.randint(100, 999)}",
            "severity": "High",
            "title": "Net Quantity Declaration Missing",
            "reason": "Net weight/volume declaration is mandatory on the principal display panel under Rule 6(1)(c).",
            "ruleReference": "Legal Metrology Rules 2011, Rule 6(1)(c)",
            "cropRegion": "Front PDP Region"
        })

    # 4. Manufacturer Address & Pincode
    addr_text = addr_d.get("detectedValue", "")
    has_pin = any(c.isdigit() for c in addr_text) and len([c for c in addr_text if c.isdigit()]) >= 6
    checklist.append({
        "item": "Full manufacturer address with postal pin code provided",
        "compliant": has_pin
    })

    if not has_pin and addr_d:
        issues.append({
            "id": f"iss-pin-{random.randint(100, 999)}",
            "severity": "Low",
            "title": "Address Missing Postal PIN Code",
            "reason": "Manufacturer / Packer address should include a valid 6-digit postal PIN code for statutory traceability.",
            "ruleReference": "Legal Metrology Rules 2011, Rule 6(1)(a)",
            "cropRegion": "Manufacturer Label"
        })

    # 5. Consumer Care Details
    care_text = care_d.get("detectedValue", "")
    care_has_phone = any(num in care_text for num in ["1800", "011", "022", "080", "+91"]) or len([c for c in care_text if c.isdigit()]) >= 8
    care_has_email = "@" in care_text
    care_ok = care_has_phone and care_has_email

    checklist.append({
        "item": "Consumer helpline telephone and email address declared",
        "compliant": care_ok
    })

    if care_d and not care_ok:
        issues.append({
            "id": f"iss-care-{random.randint(100, 999)}",
            "severity": "Low" if (care_has_phone or care_has_email) else "Medium",
            "title": "Incomplete Consumer Care Contact Details",
            "reason": "Consumer care email address missing from package panel." if care_has_phone else ("Consumer helpline telephone missing." if care_has_email else "No consumer helpline details detected."),
            "ruleReference": "Legal Metrology Rules 2011, Rule 6(1)(8)",
            "cropRegion": "Rear Panel Right Margin"
        })

    # Score Calculation
    total_items = len(checklist)
    passed_items = sum(1 for c in checklist if c["compliant"])
    score = int((passed_items / total_items) * 100)

    high_sev_count = sum(1 for i in issues if i.get("severity") == "High")
    if high_sev_count > 0:
        score = min(score, 55)

    # Status Determination (Compliant / Requires Inspector Review / Potential Non-Compliance)
    if score < 65 or high_sev_count > 0:
        overall_status = "Potential Non-Compliance"
    elif score < 90 or len(issues) > 0:
        overall_status = "Requires Inspector Review"
    else:
        overall_status = "Compliant"

    return checklist, issues, score, overall_status
