import { UploadCloud } from "lucide-react";
import { useState } from "react";

const ImageUploadPreview = ({
  label,
  onFileChange,
  previewUrl,
  size = "w-24 h-24",
}: {
  label: string;
  onFileChange: (file: File | null) => void;
  previewUrl?: string | null;
  size?: string;
}) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileChange(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 relative overflow-hidden ${size}`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <UploadCloud className="h-8 w-8 text-neutral-400" />
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUploadPreview;
