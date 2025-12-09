import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSearchRecipesQuery } from "./features/recipes/recipesApi";
import {
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "./features/favorites/favoritesSlice";
import { selectFavoritesSorted } from "./features/favorites/favoritesSlice";
import type { AppDispatch } from "./app/store";
import type { Recipe } from "./types/recipe";
import { useDebounce } from "./hooks/useDebounce";
import RecipeDetail from "./components/RecipeDetail";

function App() {
  const [query, setQuery] = useState("pasta");
  const debouncedQuery = useDebounce(query, 300);
  const { data, isFetching, isError, refetch } = useSearchRecipesQuery({
    q: debouncedQuery,
  });
  const favorites = useSelector(selectFavoritesSorted);
  const dispatch = useDispatch<AppDispatch>();

  const isFavorite = (recipeId: number) => {
    return favorites.some((f) => f.id === recipeId);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    if (isFavorite(recipe.id)) {
      dispatch(removeFavorite(recipe.id));
    } else {
      dispatch(addFavorite(recipe));
    }
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="w-full min-h-screen flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full">
              <h1 className="text-4xl font-bold text-center mb-8">
                Recipe Explorer
              </h1>

              {/*Search form*/}
              <section className="mb-8 flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4">Search Recipes</h2>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for recipes"
                  className="w-full max-w-md border rounded-lg px-4 py-2"
                />
              </section>

              {/*Loading and error handling*/}
              {isFetching && <p className="text-center mb-4">Loading...</p>}
              {isError && (
                <div className="text-center mb-4">
                  <p className="text-red-600 mb-2">
                    Error: Failed to load recipes
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Försök igen
                  </button>
                </div>
              )}

              {/*Recipe list*/}
              <div className="flex flex-col items-center gap-6 mb-8">
                {data?.recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="w-full max-w-md border rounded-lg p-4"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <Link
                      to={`/recipe/${recipe.id}`}
                      className="text-xl font-semibold mb-2 text-blue-500 hover:text-blue-600"
                    >
                      {recipe.name}
                    </Link>
                    <p className="mb-1">
                      <span className="font-medium">Cuisine:</span>{" "}
                      {recipe.cuisine}
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Difficulty:</span>{" "}
                      {recipe.difficulty}
                    </p>
                    <p className="mb-3">
                      <span className="font-medium">Meal Type:</span>{" "}
                      {recipe.mealType.join(", ")}
                    </p>
                    <button
                      onClick={() => handleToggleFavorite(recipe)}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                        isFavorite(recipe.id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isFavorite(recipe.id)
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </button>
                  </div>
                ))}
              </div>

              {/*Favorites list*/}
              <section className="border rounded-lg p-6 flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Favorites ({favorites.length})
                </h2>
                {favorites.length === 0 ? (
                  <p>No favorites yet</p>
                ) : (
                  <>
                    <div className="w-full max-w-md space-y-3 mb-4">
                      {favorites.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="flex items-center justify-between border rounded-lg p-3"
                        >
                          <Link
                            to={`/recipe/${recipe.id}`}
                            className="text-lg font-medium text-blue-500 hover:text-blue-600"
                          >
                            {recipe.name}
                          </Link>
                          <button
                            onClick={() => dispatch(removeFavorite(recipe.id))}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => dispatch(clearFavorites())}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                    >
                      Clear All Favorites
                    </button>
                  </>
                )}
              </section>
            </div>
          </div>
        }
      />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
    </Routes>
  );
}

export default App;
