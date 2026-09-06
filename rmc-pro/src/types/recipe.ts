export interface Recipe {
  id: number;

  customer_id: number;
  customer_name?: string;

  recipe_name: string;
  recipe_no: number;
  grade: string;

  cement: number;
  flyash: number;
  sand: number;
  mm10: number;
  mm20: number;
  water: number;
  admix: number;

  slump: number;
  strength: number;
}