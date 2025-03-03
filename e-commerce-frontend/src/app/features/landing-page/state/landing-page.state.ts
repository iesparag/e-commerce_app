import { Category } from "../../../core/types/category.interface";

export interface CategoryState {
  categories: Category[];
  error: string | null;
}