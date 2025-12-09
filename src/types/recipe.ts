export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  mealType: string[];
  image: string;
  instructions?: string;
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}
