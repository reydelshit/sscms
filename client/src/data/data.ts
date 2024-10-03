export type IllnessItem = {
  ill_id: string;
  illness: string;
  ill_pres: string | string[];
};

export type IllnessData = {
  illness: IllnessItem[];
};

export type PrescriptionItem = {
  med_id: string;
  med_name: string;
  description: string;
  lot_num: string;
  manufac_date: string;
  expiry_date: string;
  qty: string;
  ill_id: string;
  status: string;
};

export type PrescriptionData = {
  prescription: PrescriptionItem[];
};
