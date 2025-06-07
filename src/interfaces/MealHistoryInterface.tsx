export interface Meal {
  id: number;
  food_name: string;
  meal_type: string;
  meal_type_id: number;
}

export interface MealHistoryPerDate {
  date: string;
  meals: Meal[];
}

export interface MealHistoryResponse {
  message: string;
  data: MealHistoryPerDate[];
}
