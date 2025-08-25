// src/components/ui/form/ImageUpload.tsx
"use client";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";

type ImageUploadProps = {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
};

export default function ImageUpload({
  label,
  register,
  error,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { ref, onChange, ...rest } = register;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onChange(e); // Propagate change to react-hook-form
  };

  const clearPreview = () => setPreview(null);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className={`flex items-center justify-center w-full`}>
        {preview ? (
          <div className="relative h-32 w-32 rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={clearPreview}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
              error ? "border-red-500" : "border-neutral-300"
            } border-dashed rounded-lg cursor-pointer bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-4 text-neutral-500 dark:text-neutral-400" />
              <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                PNG, JPG or WEBP (MAX. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={ref}
              onChange={handleFileChange}
              {...rest}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
