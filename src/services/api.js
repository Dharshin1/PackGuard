import axios from 'axios';
import { DEMO_PRODUCTS } from '../data/mockData';
import { performOcr } from './ocr/ocrEngine';
import { extractDeclarations } from './ocr/declarationExtractor';
import { evaluateRules } from './ocr/rulesEngine';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get Dashboard summary metrics dynamically
 */
export const getDashboard = async (inspectionsList = []) => {
  try {
    const res = await apiClient.get('/dashboard');
    if (res.data && res.data.totalInspections !== undefined) {
      return res.data;
    }
  } catch (err) {
    // Fallback to client-calculated metrics
  }

  await delay(200);
  const totalInspections = inspectionsList.length;
  const requiresReviewCount = inspectionsList.filter(
    i => i.status === 'Requires Inspector Review' || i.status === 'Requires Review' || i.status === 'Potential Non-Compliance'
  ).length;

  return {
    totalInspections: totalInspections || 0,
    requiresReview: requiresReviewCount || 0,
    reportsGenerated: totalInspections || 0,
    recentInspections: inspectionsList.slice(0, 5)
  };
};

/**
 * Get all inspections with search and filtering
 */
export const getInspections = async (inspectionsList = [], filters = {}) => {
  try {
    const res = await apiClient.get('/inspections');
    if (res.data && res.data.data) {
      let list = res.data.data;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          item =>
            (item.id && item.id.toLowerCase().includes(q)) ||
            (item.productName && item.productName.toLowerCase().includes(q)) ||
            (item.brand && item.brand.toLowerCase().includes(q)) ||
            (item.location && item.location.toLowerCase().includes(q))
        );
      }
      if (filters.status && filters.status !== 'All') {
        if (filters.status === 'Requires Review') {
          list = list.filter(
            i => i.status === 'Requires Inspector Review' || i.status === 'Requires Review' || i.status === 'Potential Non-Compliance'
          );
        } else {
          list = list.filter(i => i.status === filters.status);
        }
      }
      if (filters.category && filters.category !== 'All') {
        list = list.filter(i => i.category === filters.category);
      }
      return { data: list, total: list.length };
    }
  } catch (err) {
    // Fallback to client-side list
  }

  await delay(200);
  let list = [...inspectionsList];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      item =>
        item.id.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q))
    );
  }

  if (filters.status && filters.status !== 'All') {
    if (filters.status === 'Requires Review') {
      list = list.filter(
        i => i.status === 'Requires Inspector Review' || i.status === 'Requires Review' || i.status === 'Potential Non-Compliance'
      );
    } else {
      list = list.filter(i => i.status === filters.status);
    }
  }

  if (filters.category && filters.category !== 'All') {
    list = list.filter(i => i.category === filters.category);
  }

  return {
    data: list,
    total: list.length
  };
};

/**
 * Get inspection details by ID
 */
export const getInspection = async (inspectionsList = [], id) => {
  try {
    const res = await apiClient.get(`/inspections/${id}`);
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    // Fallback to context
  }

  await delay(150);
  const item = inspectionsList.find(i => i.id === id);
  if (!item) {
    throw new Error(`Inspection ID ${id} not found.`);
  }
  return item;
};

/**
 * Upload inspection helper alias
 */
export const createInspection = async (payload) => {
  await delay(200);
  const newId = `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  return { success: true, inspectionId: newId, payload };
};

export const uploadInspection = createInspection;

/**
 * Perform AI-assisted compliance analysis on uploaded product
 */
export const analyzeInspection = async (params) => {
  // If demo sample selected
  if (params.demoSampleId) {
    const demoItem = DEMO_PRODUCTS.find(d => d.id === params.demoSampleId);
    if (demoItem) {
      return {
        ...demoItem,
        id: `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        productName: params.productName || demoItem.productName,
        category: params.category || demoItem.category,
        location: params.location || demoItem.location,
        referenceNumber: params.referenceNumber || demoItem.referenceNumber,
        inspectorName: params.inspectorName || 'Enforcement Officer'
      };
    }
  }

  // Attempt FastAPI backend call first
  try {
    const formData = new FormData();
    if (params.file) {
      formData.append('file', params.file);
    } else if (params.images && params.images[0] && params.images[0].file) {
      formData.append('file', params.images[0].file);
    } else if (params.images && params.images[0] && params.images[0].url) {
      formData.append('image_url', params.images[0].url);
    }

    if (params.productName) formData.append('productName', params.productName);
    if (params.brand) formData.append('brand', params.brand);
    if (params.category) formData.append('category', params.category);
    if (params.location) formData.append('location', params.location);
    if (params.referenceNumber) formData.append('referenceNumber', params.referenceNumber);
    if (params.inspectorName) formData.append('inspectorName', params.inspectorName);

    const res = await apiClient.post('/inspections/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data && res.data.id) {
      return res.data;
    }
  } catch (err) {
    console.warn('Backend API unreachable, falling back to client engine:', err);
  }

  // Fallback Client Engine
  const primaryImage = params.images && params.images.length > 0 ? params.images[0] : null;
  const ocrResult = await performOcr(primaryImage || params.productName || 'Uploaded Package');
  const declarations = extractDeclarations(ocrResult.rawText, params);
  const assessment = evaluateRules(declarations, ocrResult.rawText, params);

  const newId = `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: newId,
    productName: params.productName || (declarations.find(d => d.field === 'Product Name')?.detectedValue) || 'Uploaded Packaged Commodity',
    brand: params.brand || (declarations.find(d => d.field === 'Manufacturer / Packer / Importer')?.detectedValue) || 'Packaged Commodity Brand',
    category: params.category || 'Beverages & Packaged Liquids',
    date: new Date().toISOString(),
    inspectorName: 'Enforcement Officer',
    inspectorId: 'LM-OFF-409',
    location: params.location || 'Inspection Facility',
    referenceNumber: params.referenceNumber || `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    complianceScore: assessment.complianceScore,
    status: assessment.status,
    rawOcrText: ocrResult.rawText,
    ocrConfidence: ocrResult.confidence,
    ocrSource: ocrResult.source,
    summaryNotes: `AI-assisted OCR assessment complete via ${ocrResult.source}. Mandatory declarations extracted and evaluated under Legal Metrology Rules 2011.`,
    images: params.images && params.images.length > 0 ? params.images : [
      {
        id: 'img-new-1',
        title: 'Uploaded Package PDP',
        type: 'Front',
        url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
        annotations: [{ x: 35, y: 60, label: 'Detected Label' }]
      }
    ],
    declarations,
    checklist: assessment.checklist,
    issues: assessment.issues,
    evidence: assessment.issues.map(iss => ({
      id: `ev-${iss.id}`,
      title: iss.title,
      description: iss.reason,
      imageUrl: params.images && params.images[0] ? params.images[0].url : 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80'
    }))
  };
};

/**
 * Generate report certificate payload
 */
export const generateReport = async (inspectionsList = [], id) => {
  await delay(200);
  const inspection = await getInspection(inspectionsList, id);
  return {
    reportId: `REP-${id}`,
    generatedAt: new Date().toISOString(),
    inspection,
    pdfDownloadUrl: `${API_BASE_URL}/inspections/${id}/pdf`,
    disclaimer: 'This AI-assisted assessment is intended to support inspector review and does not constitute a final legal determination.'
  };
};

export default apiClient;

