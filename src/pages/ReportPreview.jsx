import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingState from '../components/common/LoadingState';
import { generateReport } from '../services/api';
import { useInspections } from '../context/InspectionContext';
import {
  Printer,
  ArrowLeft,
  Scale,
  Download
} from 'lucide-react';

const ReportPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspections, getInspectionById } = useInspections();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const fromContext = getInspectionById(id);
      if (fromContext) {
        setReportData({
          reportId: `REP-${fromContext.id}`,
          generatedAt: new Date().toISOString(),
          inspection: fromContext,
          pdfDownloadUrl: `http://localhost:8000/api/v1/inspections/${fromContext.id}/pdf`,
          disclaimer:
            'This AI-assisted assessment is intended to support inspector review and does not constitute a final legal determination.',
        });
        setLoading(false);
        return;
      }

      try {
        const res = await generateReport(inspections, id);
        setReportData(res);
      } catch (err) {
        console.error('Failed to generate report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, inspections, getInspectionById]);

  if (loading) {
    return <LoadingState message="Generating Compliance Report..." />;
  }

  if (!reportData || !reportData.inspection) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-base font-bold text-white mb-2">Report Not Found</h2>
        <button onClick={() => navigate('/history')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs">
          Back to History
        </button>
      </div>
    );
  }

  const { inspection } = reportData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPythonPdf = () => {
    const pdfUrl = reportData.pdfDownloadUrl || `http://localhost:8000/api/v1/inspections/${id}/pdf`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Print & Download Controls (Hidden on print) */}
      <div className="no-print flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPythonPdf}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF (Python)</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Certificate Card */}
      <div className="print-container bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 space-y-8 font-sans">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow shrink-0">
              <Scale className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-950">
                  Pack<span className="text-indigo-600">Sure</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                  Legal Metrology AI
                </span>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mt-0.5">
                Legal Metrology Compliance Assessment Report
              </h2>
              <p className="text-[11px] text-slate-500">
                Department of Consumer Affairs | Legal Metrology Cell
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-l-2 sm:border-l-0 border-slate-200 pl-3 sm:pl-0 font-mono text-xs text-slate-600 space-y-1">
            <div>
              <span className="font-semibold text-slate-400">REPORT ID:</span>{' '}
              <span className="font-bold text-indigo-700">{reportData.reportId}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-400">INSPECTION ID:</span>{' '}
              <span className="font-bold text-slate-900">{inspection.id}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-400">DATE:</span>{' '}
              <span className="font-bold text-slate-900">
                {new Date(inspection.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Product & Enforcement Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1.5">
              1. Product Information
            </h3>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Product Name:</span>
              <span className="col-span-2 font-bold text-slate-900">{inspection.productName}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Brand / Packer:</span>
              <span className="col-span-2 font-semibold text-slate-800">{inspection.brand || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Category:</span>
              <span className="col-span-2 text-slate-800">{inspection.category}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1.5">
              2. Enforcement Details
            </h3>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Inspector Officer:</span>
              <span className="col-span-2 font-bold text-slate-900">{inspection.inspectorName || 'Enforcement Inspector'}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Facility / Location:</span>
              <span className="col-span-2 text-slate-800">{inspection.location}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Reference Code:</span>
              <span className="col-span-2 font-mono text-slate-800">{inspection.referenceNumber}</span>
            </div>
          </div>
        </div>

        {/* Assessment Status Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-900 text-white rounded-xl shadow-md gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Assessment Status
            </span>
            <div className="mt-1 flex items-center space-x-3">
              <span className="text-2xl font-black tracking-tight">{inspection.status}</span>
            </div>
          </div>

          <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-6">
            <p className="text-[10px] uppercase font-bold text-slate-400">Compliance Score</p>
            <p className="text-2xl font-extrabold font-mono text-indigo-400">
              {inspection.complianceScore ? `${inspection.complianceScore}%` : 'Not available'}
            </p>
          </div>
        </div>

        {/* Declarations Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-300 pb-1.5">
            3. Extracted Mandatory Declarations (PCR Rule 6)
          </h3>

          <table className="w-full text-left text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-2.5 border-r border-slate-200">Mandatory Declaration</th>
                <th className="p-2.5 border-r border-slate-200">Extracted Value</th>
                <th className="p-2.5 border-r border-slate-200">Rule Reference</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inspection.declarations?.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{item.field}</td>
                  <td className="p-2.5 font-mono text-slate-800 border-r border-slate-200">
                    {item.detectedValue}
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-600 border-r border-slate-200">
                    {item.ruleRef}
                  </td>
                  <td className="p-2.5 text-center font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                        item.status === 'Detected' && item.isCompliant !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Potential Issues */}
        {inspection.issues && inspection.issues.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-300 pb-1.5">
              4. Identified Potential Non-Compliance Flags
            </h3>

            <div className="space-y-3">
              {inspection.issues.map((iss, idx) => (
                <div key={idx} className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">{iss.title}</span>
                    <span className="font-mono text-[10px] font-bold uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                      {iss.severity} Priority
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{iss.reason || iss.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Evidence Snapshot */}
        {inspection.images && inspection.images[0] && (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-300 pb-1.5">
              5. Package Panel Evidence Snapshot
            </h3>

            <div className="flex justify-center p-3 bg-slate-100 rounded-xl border border-slate-200">
              <img
                src={inspection.images[0].url}
                alt="PDP Evidence"
                className="max-h-56 rounded-lg object-contain border border-slate-300 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Official Statutory Legal Disclaimer */}
        <div className="pt-6 border-t-2 border-slate-900 space-y-4">
          <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs leading-relaxed italic">
            <strong className="text-slate-900 not-italic uppercase tracking-wider block mb-1">
              Official Disclaimer & Statutory Note:
            </strong>
            "{reportData.disclaimer}"
          </div>

          <div className="flex justify-between items-end pt-8 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Department of Consumer Affairs</p>
              <p className="text-[11px] text-slate-500">Legal Metrology Cell</p>
            </div>
            <div className="text-right border-t border-slate-400 pt-2 w-48">
              <p className="font-bold text-slate-900">Authorized Signature / Seal</p>
              <p className="text-[10px] text-slate-500">{inspection.inspectorName || 'Enforcement Officer'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
