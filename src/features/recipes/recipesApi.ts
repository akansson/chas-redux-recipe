import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Recipe, RecipeSearchResponse } from "../../types/recipe";

export const recipesApi = createApi({
  reducerPath: "recipesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com" }),
  endpoints: (builder) => ({
    searchRecipes: builder.query<RecipeSearchResponse, { q: string }>({
      query: ({ q }) => `/recipes/search?q=${q}`,
    }),
    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/recipes/${id}`,
    }),
  }),
});

export const { useSearchRecipesQuery, useGetRecipeByIdQuery } = recipesApi;
