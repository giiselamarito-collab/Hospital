import { PatientMaster, AppointmentSchedule, MedicalHistoryRME, BillingInvoice, DbState } from './types';

export const INITIAL_PATIENTS: PatientMaster[] = [
  {
    patient_id: 1,
    nomor_rekam_medis: 'RM-2024-001',
    nama_lengkap: 'Budi Santoso',
    tanggal_lahir: '1980-05-15',
    jenis_kelamin: 'L',
    alamat_lengkap: 'Jl. Merdeka No. 10, Jakarta Selatan',
    nomor_telepon: '081234567890',
    status_aktif: true,
    nik: '3174000000000001',
    penanggung_jawab: 'Siti Aminah (Istri)'
  },
  {
    patient_id: 2,
    nomor_rekam_medis: 'RM-2024-002',
    nama_lengkap: 'Citra Lestari',
    tanggal_lahir: '1992-11-20',
    jenis_kelamin: 'P',
    alamat_lengkap: 'Jl. Sudirman No. 45, Jakarta Pusat',
    nomor_telepon: '081987654321',
    status_aktif: true,
    nik: '3171000000000002',
    penanggung_jawab: 'Agus Wijaya (Suami)'
  }
];

export const INITIAL_APPOINTMENTS: AppointmentSchedule[] = [
  {
    appointment_id: 101,
    nomor_rekam_medis: 'RM-2024-001',
    tanggal_janji_temu: '2024-05-25 10:00:00',
    dokter_id: 501,
    dokter_nama: 'Dr. Hartono, Sp.PD',
    jenis_layanan: 'Konsultasi Penyakit Dalam',
    status_jadwal: 'Booked'
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalHistoryRME[] = [
  {
    rme_id: 5001,
    nomor_rekam_medis: 'RM-2024-001',
    tanggal_kunjungan: '2024-01-10',
    diagnosis_icd10: 'J00 (Acute nasopharyngitis)',
    ringkasan_klinis: 'Pasien mengeluh demam dan pilek selama 3 hari. Tidak ada sesak napas.',
    treatment_snomedct: '710001 (Prescription of paracetamol)',
    riwayat_alergi: 'Tidak ada',
    kode_dokter_pencatat: 501
  }
];

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    invoice_id: 90001,
    nomor_rekam_medis: 'RM-2024-001',
    tanggal_invoice: '2024-01-10 11:30:00',
    total_biaya: 450000,
    status_pembayaran: 'Lunas',
    metode_pembayaran: 'Cash',
    tanggal_jatuh_tempo: '2024-01-10',
    details: [
      {
        detail_id: 1,
        invoice_id: 90001,
        deskripsi_item: 'Jasa Konsultasi Dokter Spesialis',
        jumlah_unit: 1,
        harga_unit: 300000,
        total_item_biaya: 300000
      },
      {
        detail_id: 2,
        invoice_id: 90001,
        deskripsi_item: 'Obat Paracetamol 500mg',
        jumlah_unit: 10,
        harga_unit: 5000,
        total_item_biaya: 50000
      },
      {
        detail_id: 3,
        invoice_id: 90001,
        deskripsi_item: 'Biaya Administrasi RS',
        jumlah_unit: 1,
        harga_unit: 100000,
        total_item_biaya: 100000
      }
    ]
  }
];

export const INITIAL_DB_STATE: DbState = {
  patients: INITIAL_PATIENTS,
  appointments: INITIAL_APPOINTMENTS,
  medicalRecords: INITIAL_MEDICAL_RECORDS,
  invoices: INITIAL_INVOICES
};
