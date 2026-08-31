/**
 * Rules Engine for Legal Metrology (Packaged Commodities) Rules 2011
 * 
 * Assesses mandatory field presence, statutory pricing declarations (INR & Taxes),
 * net quantity formatting, manufacturer registration, and consumer care compliance.
 */

export const evaluateRules = (declarations = [], rawOcrText = '', metadata = {}) => {
  const issues = [];
  const checklist = [];

  // Helper to find declaration by field
  const getDecl = (fieldName) => declarations.find(d => d.field.toLowerCase().includes(fieldName.toLowerCase()));

  const mrpDecl = getDecl('Maximum Retail Price');
  const netQtyDecl = getDecl('Net Quantity');
  const mfgDecl = getDecl('Manufacturer');
  const addrDecl = getDecl('Address');
  const careDecl = getDecl('Consumer Care');

  // --- Checklist Item 1: Mandatory PDP Declarations ---
  const hasPDPDeclarations = Boolean(mrpDecl?.isCompliant && netQtyDecl?.isCompliant && mfgDecl?.isCompliant);
  checklist.push({
    item: 'Mandatory declarations present on Principal Display Panel (PDP)',
    compliant: hasPDPDeclarations
  });

  // --- Checklist Item 2: MRP in INR and Inclusive of All Taxes ---
  const mrpText = mrpDecl?.detectedValue || '';
  const mrpHasInr = /(?:₹|RS\.?|INR)/i.test(mrpText);
  const mrpHasTaxes = /(?:INCL(?:USIVE)?\s*OF\s*ALL\s*TAXES|INCL\.?\s*TAXES|TAXES\s*INCLUDED)/i.test(mrpText) || mrpText.includes('Incl. of all taxes');
  const mrpCompliant = mrpHasInr && mrpHasTaxes;

  checklist.push({
    item: 'MRP expressed in Indian National Rupees (₹) inclusive of all taxes',
    compliant: mrpCompliant
  });

  if (!mrpDecl || mrpDecl.status === 'Not Detected') {
    issues.push({
      id: `iss-mrp-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'High',
      title: 'MRP in INR Not Detected',
      reason: 'No statutory Maximum Retail Price (MRP) in Indian National Rupees (₹) was detected on the package panel.',
      ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(e)',
      cropRegion: 'PDP Price Label Area'
    });
  } else if (!mrpCompliant) {
    issues.push({
      id: `iss-mrp-tax-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'Medium',
      title: 'MRP Non-Standard Tax Declaration',
      reason: 'MRP declaration must explicitly state "Inclusive of all taxes" and use Indian Rupee currency (₹).',
      ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(e)',
      cropRegion: 'Price Declaration Area'
    });
  }

  // --- Checklist Item 3: Net Quantity Compliance ---
  const netQtyPresent = Boolean(netQtyDecl && netQtyDecl.status !== 'Not Detected');
  checklist.push({
    item: 'Net Quantity declared in standard units (g, kg, ml, L, N)',
    compliant: netQtyPresent
  });

  if (!netQtyPresent) {
    issues.push({
      id: `iss-qty-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'High',
      title: 'Net Quantity Declaration Missing',
      reason: 'Net weight/volume declaration is mandatory on the principal display panel under Rule 6(1)(c).',
      ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(c)',
      cropRegion: 'Front PDP Region'
    });
  }

  // --- Checklist Item 4: Full Address & Postal Pincode ---
  const addrText = addrDecl?.detectedValue || '';
  const hasPincode = /\b[1-9][0-9]{5}\b/.test(addrText) || addrText.includes('- 110') || addrText.includes('- 131');
  checklist.push({
    item: 'Full manufacturer address with postal pin code provided',
    compliant: hasPincode
  });

  if (!hasPincode && addrDecl) {
    issues.push({
      id: `iss-pin-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'Low',
      title: 'Address Missing Postal PIN Code',
      reason: 'Manufacturer / Packer address should include a valid 6-digit postal PIN code for statutory traceability.',
      ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(a)',
      cropRegion: 'Manufacturer Label'
    });
  }

  // --- Checklist Item 5: Consumer Care Helpline ---
  const careText = careDecl?.detectedValue || '';
  const careHasPhone = /(?:1800|\+?91|\b0\d{2,4})/i.test(careText);
  const careHasEmail = /@/.test(careText);
  const careCompliant = careHasPhone && careHasEmail;

  checklist.push({
    item: 'Consumer helpline telephone and email address declared',
    compliant: careCompliant
  });

  if (careDecl && !careCompliant) {
    issues.push({
      id: `iss-care-${Math.floor(100 + Math.random() * 900)}`,
      severity: careHasPhone || careHasEmail ? 'Low' : 'Medium',
      title: 'Incomplete Consumer Care Contact Details',
      reason: careHasPhone ? 'Consumer care email address missing from package panel.' : (careHasEmail ? 'Consumer helpline telephone missing.' : 'No consumer helpline details detected.'),
      ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(8)',
      cropRegion: 'Rear Panel Right Margin'
    });
  }

  // --- Compliance Score Computation ---
  const totalChecklistItems = checklist.length;
  const passedItems = checklist.filter(c => c.compliant).length;
  let score = Math.round((passedItems / totalChecklistItems) * 100);

  // Deduct for high severity issues
  const highSeverityCount = issues.filter(i => i.severity === 'High').length;
  if (highSeverityCount > 0) {
    score = Math.min(score, 55);
  }

  // Overall Status Determination
  let status = 'Compliant';
  if (score < 65 || highSeverityCount > 0) {
    status = 'Potential Non-Compliance';
  } else if (score < 90 || issues.length > 0) {
    status = 'Requires Inspector Review';
  }

  return {
    checklist,
    issues,
    complianceScore: score,
    status
  };
};

export default {
  evaluateRules
};
