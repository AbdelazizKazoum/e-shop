// src/components/ui/form/ColorPickerInput.tsx
"use client";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useState, useRef } from "react";
import { SketchPicker, ColorResult } from "react-color";

type ColorPickerInputProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
};

export default function ColorPickerInput({
  label,
  value,
  onChange,
}: ColorPickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  useOnClickOutside(pickerRef, () => setShowPicker(false));

  const handleColorChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="flex items-center">
        <button
          type="button"
          className="h-10 w-10 flex-shrink-0 rounded-l-md border border-r-0 border-neutral-300 dark:border-neutral-700"
          style={{ backgroundColor: value || "#ffffff" }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-full rounded-r-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        />
      </div>

      {showPicker && (
        <div ref={pickerRef} className="absolute z-10 mt-2">
          <SketchPicker color={value} onChangeComplete={handleColorChange} />
        </div>
      )}
    </div>
  );
}
