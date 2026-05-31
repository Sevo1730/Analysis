"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ImageCreateTab() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setPrompt("");
    setImage(null);
    setDone(false);
    setError("");
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImage(null);
    setError("");
    try {
      const res = await fetch("/api/image-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImage(data.image);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error generating image.");
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gray-800" />
          <h2 className="text-xl font-bold text-gray-900">Food image creator</h2>
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
        What food image do you want? Describe it briefly.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Хоолны тайлбар"
        rows={5}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 resize-none outline-none focus:border-gray-400 transition-colors"
      />

      <div className="flex justify-end">
        <button
          onClick={generate}
          disabled={!prompt.trim() || loading}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            prompt.trim() && !loading
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Generate
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gray-800" />
          <h3 className="text-lg font-bold text-gray-900">Result</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Working on your image, just wait a moment...</p>
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            </div>
          </div>
        ) : image ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image src={image} alt="Generated food image" width={512} height={512} className="w-full h-auto" />
          </div>
        ) : error ? (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">First, enter your text to generate an image.</p>
        )}
      </div>
    </div>
  );
}
