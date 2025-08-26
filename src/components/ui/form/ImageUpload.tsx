// src/components/ui/form/ImageUpload.tsx
"use client";
import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  label: string;
  onFileChange: (file: File | null) => void;
};

export default function ImageUpload({ label, onFileChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    onFileChange(null);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="flex w-full items-center justify-center">
        {preview ? (
          <div className="relative h-32 w-32 rounded-md overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
              fill
              style={{ objectFit: "cover" }}
              sizes="128px"
              priority
            />
            <button
              type="button"
              onClick={clearPreview}
              className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
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
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
