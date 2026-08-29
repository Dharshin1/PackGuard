# PackSure — AI-Powered Legal Metrology Compliance Inspection System

PackSure is an enforcement dashboard prototype designed for SIH hackathon demonstration. It empowers Legal Metrology inspectors to upload packaged product panel images (PDP, declaration panel, side labels), automatically extract mandatory legal declarations (MRP, Net Qty, Manufacturer, Consumer Care details), evaluate rule compliance under Legal Metrology (Packaged Commodities) Rules 2011, review evidence, track inspection logs, and print official compliance certificate reports.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **React Router DOM v7**
- **Lucide React** (Enforcement Icons)
- **Axios** (API Client layer)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── inspection/
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── DeclarationCard.jsx
│   │   │   ├── ComplianceChecklist.jsx
│   │   │   ├── PotentialIssue.jsx
│   │   │   ├── EvidenceViewer.jsx
│   │   │   └── InspectionTable.jsx
│   │   └── layout/
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       └── PageContainer.jsx
│   ├── context/
│   │   └── InspectionContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── services/
│   │   └── api.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── NewInspection.jsx
│   │   ├── AnalysisResult.jsx
│   │   ├── InspectionHistory.jsx
│   │   ├── InspectionDetails.jsx
│   │   ├── ReportPreview.jsx
│   │   ├── ReportsList.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── README.md
```

---

## 🚀 How to Run the Application

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start local Vite development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📊 Where Mock Data is Stored

All mock inspection data, rule compliance metrics, declaration fields, and sample potential issues are stored cleanly in:

```
src/data/mockData.js
```

### Pre-loaded Inspection Data Includes:
1. **Compliant Case (`INS-2026-8801`)**: Organic Almond Milk 1L (98% compliance score)
2. **Requires Review Case (`INS-2026-8802`)**: Crunchy Roasted Peanuts 250g (72% score, font height threshold review)
3. **Potential Non-Compliance Case (`INS-2026-8803`)**: Imported Belgian Dark Chocolate 150g (42% score, missing MRP in INR and Indian Importer address)

---

## 🔌 Connecting to FastAPI Backend Later

The API service layer is completely isolated from all UI components inside:

```
src/services/api.js
```

### Exposed API Methods:
- `uploadInspection(payload)`
- `analyzeInspection(params)`
- `getDashboard()`
- `getInspections(filters)`
- `getInspection(id)`
- `generateReport(id)`

### How to Connect to FastAPI:
1. Create a `.env` file in the `frontend/` directory with:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
2. Replace simulated `delay()` Promises in `src/services/api.js` with live Axios HTTP calls:
   ```javascript
   // Example in src/services/api.js
   export const uploadInspection = async (payload) => {
     const response = await apiClient.post('/inspections/upload', payload);
     return response.data;
   };
   ```

---

## 🎯 Demo Workflow

1. **Dashboard (`/`)**: View high-level KPIs, compliance distribution, common issues, and recent cases.
2. **New Inspection (`/new-inspection`)**: Drag and drop multi-angle packaged commodity images (or click a demo sample), enter reference details, and click **Analyze Product**.
3. **Processing Animation**: Watch simulated multi-step AI OCR & rule processing steps.
4. **Analysis Result (`/analysis-result/:id`)**: Review extracted declarations (MRP, Net Qty, Manufacturer, Consumer Care), confidence levels, compliance score, checklist, and potential issues with evidence callouts.
5. **Save & History (`/history`)**: Click **Save Inspection** to persist it in global state and search/filter inspection logs.
6. **Inspection Details (`/inspection/:id`)**: Deep-dive into case evidence and perform inspector decision overrides.
7. **Report Preview (`/report/:id`)**: View or print/download an official, print-ready inspection report complete with official legal disclaimer.
