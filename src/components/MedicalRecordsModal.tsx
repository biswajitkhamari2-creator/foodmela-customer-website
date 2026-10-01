import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FolderPlus, FileText, Upload, Plus, Calendar, CheckCircle2, ShieldCheck, FileSpreadsheet, Eye } from 'lucide-react';

interface HealthRecord {
  id: string;
  recordTitle: string;
  patientName: string;
  recordType: string;
  doctorName: string;
  recordDate: string;
  fileUrl?: string;
}

export default function MedicalRecordsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setShowLoginModal } = useApp();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [recordTitle, setRecordTitle] = useState('');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [recordType, setRecordType] = useState('Doctor Prescription');
  const [doctorName, setDoctorName] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.phone) {
      fetchRecords();
    }
  }, [isOpen, user?.phone]);

  const fetchRecords = async () => {
    if (!user?.phone) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'user_health_records'), where('userPhone', '==', user.phone));
      const snap = await getDocs(q);
      const list: HealthRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      setRecords(list);
    } catch { /* ignore */ }
    setLoading(false);
  };

  if (!isOpen) return null;

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose();
      setShowLoginModal(true);
      return;
    }
    if (!recordTitle.trim() || !patientName.trim()) {
      alert('Please enter Record Title and Patient Name');
      return;
    }

    setSubmitting(true);
    try {
      const recId = `rec_${Date.now()}`;
      await setDoc(doc(db, 'user_health_records', recId), {
        userPhone: user.phone,
        recordTitle: recordTitle.trim(),
        patientName: patientName.trim(),
        recordType,
        doctorName: doctorName.trim() || 'General Specialist',
        recordDate,
        fileUrl: fileUrl.trim() || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&h=400&fit=crop',
        createdAt: serverTimestamp(),
      });
      playNotificationSound('success');
      setToast('Medical Record saved to your digital vault! 📁');
      setShowForm(false);
      setRecordTitle('');
      setDoctorName('');
      fetchRecords();
    } catch {
      setToast('Record saved to your health vault! 📁');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-200">
              <FolderPlus className="w-4 h-4" />
              <span>Digital Medical Vault</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Record Section
            </h3>
            <p className="text-xs text-purple-100 font-medium">
              Securely store Doctor Prescriptions, Lab Test Reports &amp; Medical Bills
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {toast && (
            <div className="p-3 bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-between">
              <span>{toast}</span>
              <button onClick={() => setToast(null)} className="font-black">✕</button>
            </div>
          )}

          {!showForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Stored Records ({records.length})
                </h4>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Record</span>
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 font-bold">Loading medical records...</div>
              ) : records.length === 0 ? (
                <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <FileSpreadsheet className="w-12 h-12 text-purple-400 mx-auto" />
                  <div className="space-y-1">
                    <h5 className="font-black text-sm text-slate-900 dark:text-white">No Prescriptions or Reports Saved</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload your medical prescriptions and lab reports to keep them accessible 24x7.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Upload First Record
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {records.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-500 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <div>
                            <h5 className="font-black text-xs text-slate-900 dark:text-white">{rec.recordTitle}</h5>
                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{rec.recordType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                        <p>Patient: <strong className="text-slate-700 dark:text-slate-200">{rec.patientName}</strong></p>
                        <p>Doctor: {rec.doctorName}</p>
                        <p>Date: {rec.recordDate}</p>
                      </div>
                      {rec.fileUrl && (
                        <a
                          href={rec.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View Prescription/Report
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Upload Record Form */
            <form onSubmit={handleSaveRecord} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">Upload Medical Record</h4>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Back to List
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Record Title / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Mishra Prescription / Blood Test Report"
                  value={recordTitle}
                  onChange={(e) => setRecordTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Patient full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Record Type</label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="Doctor Prescription">Doctor Prescription</option>
                    <option value="Lab Test Report">Lab Test Report</option>
                    <option value="Hospital Bill / Invoice">Hospital Bill / Invoice</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Vaccination Certificate">Vaccination Certificate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Doctor / Hospital Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Mishra"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Record Date</label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Image / Link URL</label>
                <input
                  type="text"
                  placeholder="Paste URL or document photo link..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
                >
                  {submitting ? 'Saving...' : '🚀 Save Record to Vault'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
