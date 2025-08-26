// src/components/ui/form/MultiImageUpload.tsx
"use client";
import { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

type MultiImageUploadProps = {
  label: string;
  onFilesChange: (files: File[]) => void;
};

export default function MultiImageUpload({
  label,
  onFilesChange,
}: MultiImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative h-24 w-24 rounded-md overflow-hidden"
          >
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-cover"
              fill
              style={{ objectFit: "cover" }}
              sizes="96px"
              unoptimized
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
