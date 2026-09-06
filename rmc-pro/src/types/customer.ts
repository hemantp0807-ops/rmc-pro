export interface Customer {
  id: number;

  customer: string;
  site: string;

  party_po_no: string | null;
  party_gst_no: string | null;
  contact_no: string | null;
  contact_person: string | null;

  grade: string;

  cement: number;
  flyAsh: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;
}