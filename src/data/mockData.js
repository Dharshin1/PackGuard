// PackSure Legal Metrology Inspection Data Definitions & Demo Samples

export const PRODUCT_CATEGORIES = [
  'Beverages & Packaged Liquids',
  'Snacks & Confectionery',
  'Grains, Pulses & Staples',
  'Cosmetics & Personal Care',
  'Pharmaceuticals & Medical Devices',
  'Electronics & Electrical Appliances',
  'Imported Packaged Goods',
  'Household Supplies'
];

// Pre-configured realistic demo samples for presentation testing
export const DEMO_PRODUCTS = [
  {
    id: 'DEMO-001',
    productName: 'Organic Almond Milk 1L',
    brand: 'NutriPure Foods India Pvt. Ltd.',
    category: 'Beverages & Packaged Liquids',
    location: 'Retail Hub, Connaught Place, New Delhi',
    referenceNumber: 'REF-2026-NP-091',
    status: 'Compliant',
    complianceScore: 98,
    summaryNotes: 'All mandatory declarations under Legal Metrology (Packaged Commodities) Rules 2011 are detected and compliant.',
    images: [
      {
        id: 'img-101',
        title: 'Front PDP Label',
        type: 'front',
        url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 30, y: 70, label: 'Net Qty: 1L' }]
      },
      {
        id: 'img-102',
        title: 'Back Declaration Panel',
        type: 'back',
        url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 40, y: 20, label: 'MRP ₹240.00' }]
      }
    ],
    declarations: [
      { field: 'Product Name', detectedValue: 'Organic Almond Milk 1L', status: 'Detected', isCompliant: true, confidence: 0.99, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Maximum Retail Price (MRP)', detectedValue: '₹240.00 (Incl. of all taxes)', status: 'Detected', isCompliant: true, confidence: 0.98, ruleRef: 'Rule 6(1)(e)' },
      { field: 'Net Quantity', detectedValue: '1 Litre (1000 ml)', status: 'Detected', isCompliant: true, confidence: 0.99, ruleRef: 'Rule 6(1)(c)' },
      { field: 'Manufacturer / Packer / Importer', detectedValue: 'NutriPure Foods India Pvt. Ltd.', status: 'Detected', isCompliant: true, confidence: 0.97, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Address', detectedValue: 'Plot 45, Food Park, Phase-3, Rai, Haryana - 131029', status: 'Detected', isCompliant: true, confidence: 0.96, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Date / Month-Year of Mfg', detectedValue: '07/2026', status: 'Detected', isCompliant: true, confidence: 0.95, ruleRef: 'Rule 6(1)(d)' },
      { field: 'Consumer Care Details', detectedValue: '1800-11-9988 | care@nutripure.in', status: 'Detected', isCompliant: true, confidence: 0.98, ruleRef: 'Rule 6(1)(8)' }
    ],
    checklist: [
      { item: 'Mandatory declarations present on Principal Display Panel (PDP)', compliant: true },
      { item: 'Font size complies with net volume category thresholds', compliant: true },
      { item: 'MRP expressed in Indian National Rupees (₹) inclusive of all taxes', compliant: true },
      { item: 'Full address with postal pin code provided', compliant: true },
      { item: 'Consumer helpline telephone and email address declared', compliant: true }
    ],
    issues: [],
    evidence: []
  },
  {
    id: 'DEMO-002',
    productName: 'Crunchy Roasted Peanuts 250g',
    brand: 'SnackO Foods',
    category: 'Snacks & Confectionery',
    location: 'SuperMart Depot, Sector 18, Noida',
    referenceNumber: 'REF-2026-SN-442',
    status: 'Requires Inspector Review',
    complianceScore: 72,
    summaryNotes: 'Net quantity font height is near threshold (~2.4mm). Consumer care details missing digital contact medium (email ID).',
    images: [
      {
        id: 'img-201',
        title: 'Front Pack',
        type: 'front',
        url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 45, y: 80, label: 'Small Text Height' }]
      },
      {
        id: 'img-202',
        title: 'Rear Label',
        type: 'back',
        url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 30, y: 65, label: 'Missing Email' }]
      }
    ],
    declarations: [
      { field: 'Product Name', detectedValue: 'Crunchy Roasted Peanuts 250g', status: 'Detected', isCompliant: true, confidence: 0.95, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Maximum Retail Price (MRP)', detectedValue: '₹85.00 (Incl. of all taxes)', status: 'Detected', isCompliant: true, confidence: 0.92, ruleRef: 'Rule 6(1)(e)' },
      { field: 'Net Quantity', detectedValue: '250 g', status: 'Requires Review', isCompliant: false, confidence: 0.68, ruleRef: 'Rule 7' },
      { field: 'Manufacturer / Packer / Importer', detectedValue: 'SnackO Foods Corp', status: 'Detected', isCompliant: true, confidence: 0.91, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Address', detectedValue: 'Building 12, GIDC Estate, Ahmedabad, Gujarat - 380015', status: 'Detected', isCompliant: true, confidence: 0.88, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Date / Month-Year of Mfg', detectedValue: '06/2026', status: 'Detected', isCompliant: true, confidence: 0.94, ruleRef: 'Rule 6(1)(d)' },
      { field: 'Consumer Care Details', detectedValue: 'Ph: 079-26543210 (Email missing)', status: 'Requires Review', isCompliant: false, confidence: 0.65, ruleRef: 'Rule 6(1)(8)' }
    ],
    checklist: [
      { item: 'Mandatory declarations present on Principal Display Panel (PDP)', compliant: true },
      { item: 'Font size complies with net weight category thresholds (3.0mm min)', compliant: false },
      { item: 'MRP expressed in Indian National Rupees (₹) inclusive of all taxes', compliant: true },
      { item: 'Full address with postal pin code provided', compliant: true },
      { item: 'Consumer helpline telephone and email address declared', compliant: false }
    ],
    issues: [
      {
        id: 'iss-201',
        severity: 'Medium',
        title: 'Sub-standard Font Height for Net Quantity',
        reason: 'Measured numerals height is ~2.4 mm. Rule 7 mandates a minimum height of 3.0 mm for 200g-500g packages.',
        ruleReference: 'Legal Metrology Rules 2011, Rule 7',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
        cropRegion: 'Net Weight Label Area'
      },
      {
        id: 'iss-202',
        severity: 'Low',
        title: 'Incomplete Consumer Care Contact Details',
        reason: 'No matching consumer-care email address was detected by the extraction pipeline.',
        ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(8)',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80',
        cropRegion: 'Rear Panel Right Margin'
      }
    ],
    evidence: [
      {
        id: 'ev-201',
        title: 'Font Height Measurement Region',
        description: 'Text bounding box indicates numeral height below mandated 3.0mm threshold.',
        imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'DEMO-003',
    productName: 'Imported Belgian Dark Chocolate 150g',
    brand: 'ChocoLux International',
    category: 'Imported Packaged Goods',
    location: 'Logistics Warehouse, ICD Tughlakabad, New Delhi',
    referenceNumber: 'REF-2026-IMP-778',
    status: 'Potential Non-Compliance',
    complianceScore: 42,
    summaryNotes: 'Critical declarations missing: No Indian MRP in INR, no registered importer address in India, consumer care details not detected in uploaded image.',
    images: [
      {
        id: 'img-301',
        title: 'Front Outer Box',
        type: 'front',
        url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 50, y: 50, label: 'Foreign Packaging Only' }]
      },
      {
        id: 'img-302',
        title: 'Rear Import Sticker Area',
        type: 'back',
        url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 30, y: 40, label: 'Missing MRP & Importer' }]
      }
    ],
    declarations: [
      { field: 'Product Name', detectedValue: 'Belgian Dark Chocolate 150g', status: 'Detected', isCompliant: true, confidence: 0.94, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Maximum Retail Price (MRP)', detectedValue: 'Not detected in uploaded image', status: 'Not Detected', isCompliant: false, confidence: 0.0, ruleRef: 'Rule 6(1)(e)' },
      { field: 'Net Quantity', detectedValue: '150 g', status: 'Detected', isCompliant: true, confidence: 0.89, ruleRef: 'Rule 6(1)(c)' },
      { field: 'Manufacturer / Packer / Importer', detectedValue: 'ChocoLux BV, Brussels, Belgium', status: 'Detected', isCompliant: true, confidence: 0.93, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Address', detectedValue: 'Not detected in uploaded image', status: 'Not Detected', isCompliant: false, confidence: 0.0, ruleRef: 'Rule 6(1)(a)' },
      { field: 'Date / Month-Year of Mfg', detectedValue: '05/2026 (Import Date)', status: 'Detected', isCompliant: true, confidence: 0.84, ruleRef: 'Rule 6(1)(d)' },
      { field: 'Consumer Care Details', detectedValue: 'Not detected in uploaded image', status: 'Not Detected', isCompliant: false, confidence: 0.0, ruleRef: 'Rule 6(1)(8)' }
    ],
    checklist: [
      { item: 'Mandatory declarations present on Principal Display Panel / Over-Sticker', compliant: false },
      { item: 'MRP expressed in Indian National Rupees (₹) inclusive of all taxes', compliant: false },
      { item: 'Importer Name & Indian Registered Address present', compliant: false },
      { item: 'Consumer helpline telephone and email address declared', compliant: false }
    ],
    issues: [
      {
        id: 'iss-301',
        severity: 'High',
        title: 'MRP in INR Not Detected',
        reason: 'No matching MRP in Indian Rupees (₹) text was detected by the extraction pipeline on the uploaded image.',
        ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(e)',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        cropRegion: 'Sticker Region'
      },
      {
        id: 'iss-302',
        severity: 'High',
        title: 'Indian Importer Address Not Detected',
        reason: 'No registered office address within India was detected on the package over-sticker.',
        ruleReference: 'Legal Metrology Rules 2011, Rule 6(1)(a)',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        cropRegion: 'Rear Panel'
      }
    ],
    evidence: [
      {
        id: 'ev-301',
        title: 'Package Sticker Snapshot',
        description: 'Package features foreign price (€4.50) without mandatory INR over-sticker label.',
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

// Pre-populate with DEMO_PRODUCTS so enforcement hub renders active metrics immediately
export const INITIAL_INSPECTIONS = DEMO_PRODUCTS;
