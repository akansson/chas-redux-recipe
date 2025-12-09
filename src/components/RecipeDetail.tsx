import { useParams, Link } from "react-router-dom";
import { useGetRecipeByIdQuery } from "../features/recipes/recipesApi";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipeId = id ? parseInt(id, 10) : 0;
  const { data: recipe, isFetching, isError } = useGetRecipeByIdQuery(recipeId);

  if (isFetching) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">Error loading recipe</p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6">
      <div className="max-w-4xl w-full">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          ← Back to recipes
        </Link>
        <div className="border rounded-lg p-6">
          <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="space-y-2 mb-4">
            <p>
              <span className="font-medium">Cuisine:</span> {recipe.cuisine}
            </p>
            <p>
              <span className="font-medium">Difficulty:</span> {recipe.difficulty}
            </p>
            <p>
              <span className="font-medium">Meal Type:</span>{" "}
              {recipe.mealType.join(", ")}
            </p>
            {recipe.instructions && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
                <p>{recipe.instructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

