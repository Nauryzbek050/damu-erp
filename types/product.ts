export interface Product {
  id?: string;

  code: string;
  name: string;

  image?: string;

  home: number;
  china: number;

  wbTransit: number;
  wbWarehouse: number;
  kaspi: number;

  cost: number;
  profit: number;

  created_at?: string;
  updated_at?: string;
}