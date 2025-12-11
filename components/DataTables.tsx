import React from 'react';
import { PatientMaster, AppointmentSchedule, MedicalHistoryRME, BillingInvoice, AgentType } from '../types';
import { User, Calendar, Activity, CreditCard, FileText, AlertCircle } from 'lucide-react';

interface DataViewProps {
  type: AgentType;
  data: any;
  filterId?: string;
}

export const DataView: React.FC<DataViewProps> = ({ type, data, filterId }) => {
  // Filter logic simulates a SQL WHERE clause
  const filterData = (items: any[]) => {
    if (!filterId) return items;
    return items.filter(item => 
      item.nomor_rekam_medis.toLowerCase().includes(filterId.toLowerCase()) ||
      (item.nama_lengkap && item.nama_lengkap.toLowerCase().includes(filterId.toLowerCase()))
    );
  };

  if (type === AgentType.PATIENT_MANAGEMENT) {
    const patients = filterData(data.patients as PatientMaster[]);
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Patient Master Data
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {patients.map(p => (
            <div key={p.patient_id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-900">{p.nama_lengkap}</h4>
                  <p className="text-sm text-slate-500">RM: {p.nomor_rekam_medis}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${p.status_aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.status_aktif ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mt-3">
                <p><span className="font-semibold">DOB:</span> {p.tanggal_lahir}</p>
                <p><span className="font-semibold">Gender:</span> {p.jenis_kelamin}</p>
                <p><span className="font-semibold">NIK:</span> {p.nik}</p>
                <p><span className="font-semibold">Phone:</span> {p.nomor_telepon}</p>
              </div>
              <p className="text-xs text-slate-400 mt-2 border-t pt-2">Address: {p.alamat_lengkap}</p>
            </div>
          ))}
          {patients.length === 0 && <p className="text-slate-400 italic">No patients found matching query.</p>}
        </div>
      </div>
    );
  }

  if (type === AgentType.APPOINTMENT_SCHEDULING) {
    const appointments = filterData(data.appointments as AppointmentSchedule[]);
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" /> Appointment Schedule
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">RM No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointments.map(appt => (
                <tr key={appt.appointment_id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">{appt.tanggal_janji_temu}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{appt.nomor_rekam_medis}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 font-medium">{appt.dokter_nama}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{appt.jenis_layanan}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${appt.status_jadwal === 'Booked' ? 'bg-blue-100 text-blue-800' : 
                        appt.status_jadwal === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {appt.status_jadwal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === AgentType.MEDICAL_RECORDS) {
    const records = filterData(data.medicalRecords as MedicalHistoryRME[]);
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" /> Medical Records (RME)
        </h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                CONFIDENTIAL DATA. Access logged. Viewing restricted to authorized personnel.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {records.map(rec => (
            <div key={rec.rme_id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                 <Activity size={100} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-xl font-bold text-slate-800 mb-1">Diagnosis: {rec.diagnosis_icd10}</h4>
                 <p className="text-sm text-slate-500 mb-4">Visit Date: {rec.tanggal_kunjungan} | Dr. ID: {rec.kode_dokter_pencatat}</p>
                 
                 <div className="bg-slate-50 p-3 rounded-md mb-3 border border-slate-100">
                   <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide text-xs mb-1">Clinical Summary</p>
                   <p className="text-slate-800">{rec.ringkasan_klinis}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs font-semibold text-slate-500 uppercase">Treatment (SNOMED CT)</p>
                     <p className="text-slate-700 font-mono text-sm">{rec.treatment_snomedct}</p>
                   </div>
                   <div>
                     <p className="text-xs font-semibold text-slate-500 uppercase">Allergies</p>
                     <p className="text-red-600 font-medium text-sm">{rec.riwayat_alergi}</p>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === AgentType.BILLING) {
    const invoices = filterData(data.invoices as BillingInvoice[]);
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" /> Billing & Invoices
        </h3>
        {invoices.map(inv => (
          <div key={inv.invoice_id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">Invoice #{inv.invoice_id}</h4>
                <p className="text-xs text-slate-500">{inv.tanggal_invoice}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status_pembayaran === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                  {inv.status_pembayaran}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <table className="min-w-full mb-6">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Description</th>
                    <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Qty</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.details.map(d => (
                    <tr key={d.detail_id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 text-sm text-slate-700">{d.deskripsi_item}</td>
                      <td className="py-3 text-sm text-slate-700 text-center">{d.jumlah_unit}</td>
                      <td className="py-3 text-sm text-slate-700 text-right">Rp {d.harga_unit.toLocaleString()}</td>
                      <td className="py-3 text-sm text-slate-900 font-medium text-right">Rp {d.total_item_biaya.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-end border-t border-slate-200 pt-4">
                <div className="w-1/2 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-700">Grand Total</span>
                  <span className="text-xl font-bold text-blue-600">Rp {inv.total_biaya.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <FileText className="w-12 h-12 mb-2 opacity-50" />
      <p>Select an agent or ask the coordinator to view data.</p>
    </div>
  );
};
