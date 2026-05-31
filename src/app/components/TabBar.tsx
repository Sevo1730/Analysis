"use client";

import { useState } from "react";
import IngredientRecognitionTab from "./IngredientRecognitionTab";
import FoodRecipeMakerTab from "./FoodRecipeMakerTab";
import ImageCreateTab from "./ImageCreateTab";

const tabs = [
  { id: "ingredient-recognition", label: "Ingredient recognition", content: <IngredientRecognitionTab /> },
  { id: "food-recipe-maker", label: "Food recipe maker", content: <FoodRecipeMakerTab /> },
  { id: "image-create", label: "Image creator", content: <ImageCreateTab /> },
];

export default function TabBar() {
  const [active, setActive] = useState("ingredient-recognition");

  return (
    <div className="w-full">
      <div className="relative bg-gray-100 rounded-lg px-2 py-2 flex items-stretch">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              flex-1 text-xs font-medium py-2 px-3 transition-colors
              ${active === tab.id
                ? "bg-white text-gray-900 font-semibold rounded-lg"
                : "bg-transparent text-gray-400 hover:text-gray-600"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}
