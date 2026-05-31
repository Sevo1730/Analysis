"use client";

import { useState, useRef } from "react";
import { Sparkles, RotateCcw, FileText, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function IngredientRecognitionTab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setSummary("");
    setDone(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setSummary("");
    setDone(false);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const generate = async () => {
    if (!file) return;
    setLoading(true);
    setSummary("");
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/ingredient-recognition", { method: "POST", body: form });
      const data = await res.json();
      setSummary(data.summary || data.error || "Could not identify ingredients.");
      setDone(true);
    } catch {
      setSummary("Error occurred.");
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
          <h2 className="text-xl font-bold text-gray-900">Ingredient recognition</h2>
        </div>
        <button
          onClick={reset}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
            done ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-400 hover:border-gray-500"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-sm text-gray-400">Upload a food photo, and AI will detect the ingredients.</p>

      {!preview ? (
        <label className="flex items-center gap-3 w-full border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-400 transition-colors">
          <ImageIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Choose File</span>
          <span className="text-sm text-gray-400">JPG, PNG</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={onFileChange}
          />
        </label>
      ) : (
        <div className="inline-block relative border border-gray-200 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Selected food"
            width={170}
            height={130}
            className="object-cover"
            style={{ width: 170, height: 130 }}
          />
          <button
            onClick={reset}
            className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow border border-gray-200 hover:bg-gray-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={generate}
          disabled={!file || loading}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            file && !loading ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Generate
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-800" />
          <h3 className="text-lg font-bold text-gray-900">Identified Ingredients</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Analyzing...</p>
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
            </div>
          </div>
        ) : summary ? (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{summary}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">First, upload an image to recognize ingredients.</p>
        )}
      </div>
    </div>
  );
}
