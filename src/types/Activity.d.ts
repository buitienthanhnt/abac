export type ActivityType = {
  label: string;
  price: number;
  qty: number;
  date: string;
  sellPrice?: number;
  type?: string;
  id?: string;
  unit?: string;
  [key: string]: any;
};