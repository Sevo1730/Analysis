"use client";

import { useState } from "react";
import { ChefHat, RotateCcw, FileText } from "lucide-react";

export default function FoodRecipeMakerTab() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setIngredients("");
    setRecipe("");
    setDone(false);
  };

  const generate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setRecipe("");
    try {
      const res = await fetch("/api/food-recipe-maker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setRecipe(data.recipe || data.error || "Could not generate recipe.");
      setDone(true);
    } catch {
      setRecipe("Error occurred.");
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-gray-800" />
          <h2 className="text-xl font-bold text-gray-900">Food recipe maker</h2>
        </div>
        <button
          onClick={reset}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
            done
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-300 text-gray-400 hover:border-gray-500"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Enter your ingredients, and AI will create a recipe for you.
      </p>

      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="e.g. chicken, garlic, tomato, pasta"
        rows={5}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 resize-none outline-none focus:border-gray-400 transition-colors"
      />

      <div className="flex justify-end">
        <button
          onClick={generate}
          disabled={!ingredients.trim() || loading}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            ingredients.trim() && !loading
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Generate
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-800" />
          <h3 className="text-lg font-bold text-gray-900">Your Recipe</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Creating your recipe...</p>
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            </div>
          </div>
        ) : recipe ? (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{recipe}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">First, enter your ingredients to generate a recipe.</p>
        )}
      </div>
    </div>
  );
}
