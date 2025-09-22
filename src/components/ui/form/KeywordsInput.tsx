import { useState, useRef, useEffect } from "react";

interface KeywordsInputProps {
  tags?: string[];
  onChange?: (tags: string[]) => void;
  defaultTags?: string[];
}

export default function KeywordsInput({
  tags,
  onChange,
  defaultTags = [],
}: KeywordsInputProps) {
  const [localTags, setLocalTags] = useState<string[]>(defaultTags);
  const [tagInput, setTagInput] = useState<string>("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tags) setLocalTags(tags);
  }, [tags]);

  useEffect(() => {
    if (onChange) onChange(localTags);
  }, [localTags, onChange]);

  const addTag = (tag: string) => {
    if (tag.length > 0 && !localTags.includes(tag.toLowerCase())) {
      setLocalTags([...localTags, tag]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    setLocalTags(localTags.filter((t) => t !== tag));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim().length > 0) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const splitTags = pasted
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    splitTags.forEach(addTag);
    e.preventDefault();
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Keywords (press Enter or comma to add)
      </label>
      <div className="flex flex-wrap items-center gap-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 px-2 py-2 shadow-sm">
        {localTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-primary-100 text-primary-700 rounded px-2 py-0.5 text-xs font-medium mr-1 mb-1"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-primary-500 hover:text-red-500"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={tagInputRef}
          type="text"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          onPaste={handleTagPaste}
          className="flex-1 bg-transparent py-2 text-sm text-neutral-800 dark:text-neutral-200 border-none outline-none focus:ring-0"
          placeholder="Type keyword and press Enter or comma"
          style={{
            minWidth: "120px",
            boxShadow: "none",
            borderRadius: "0.375rem",
          }}
        />
      </div>
    </div>
  );
}
