// Enum for Agents matching the architectural design
export enum AgentType {
  COORDINATOR = 'COORDINATOR',
  PATIENT_MANAGEMENT = 'PATIENT_MANAGEMENT',
  APPOINTMENT_SCHEDULING = 'APPOINTMENT_SCHEDULING',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS',
  BILLING = 'BILLING'
}

// SQL: PATIENT_MASTER
export interface PatientMaster {
  patient_id: number;
  nomor_rekam_medis: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat_lengkap: string;
  nomor_telepon: string;
  status_aktif: boolean;
  nik: string;
  penanggung_jawab: string;
}

// SQL: APPOINTMENT_SCHEDULE
export interface AppointmentSchedule {
  appointment_id: number;
  nomor_rekam_medis: string;
  tanggal_janji_temu: string;
  dokter_id: number;
  dokter_nama: string; // Added for UI convenience
  jenis_layanan: string;
  status_jadwal: 'Booked' | 'Modified' | 'Canceled' | 'Completed';
}

// SQL: MEDICAL_HISTORY_RME
export interface MedicalHistoryRME {
  rme_id: number;
  nomor_rekam_medis: string;
  tanggal_kunjungan: string;
  diagnosis_icd10: string;
  ringkasan_klinis: string;
  treatment_snomedct: string;
  riwayat_alergi: string;
  kode_dokter_pencatat: number;
}

// SQL: INVOICE_DETAIL
export interface InvoiceDetail {
  detail_id: number;
  invoice_id: number;
  deskripsi_item: string;
  jumlah_unit: number;
  harga_unit: number;
  total_item_biaya: number;
}

// SQL: BILLING_INVOICE
export interface BillingInvoice {
  invoice_id: number;
  nomor_rekam_medis: string;
  tanggal_invoice: string;
  total_biaya: number;
  status_pembayaran: 'Lunas' | 'Pending' | 'Klaim Diproses';
  metode_pembayaran?: string;
  klaim_asuransi_id?: string;
  tanggal_jatuh_tempo: string;
  details: InvoiceDetail[]; // Joined for UI display
}

// Chat types
export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  agent?: AgentType; // The agent that handled this message
}

export interface DbState {
  patients: PatientMaster[];
  appointments: AppointmentSchedule[];
  medicalRecords: MedicalHistoryRME[];
  invoices: BillingInvoice[];
}
