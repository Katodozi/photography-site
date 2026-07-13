'use client';

import { useState, KeyboardEvent } from 'react';
import { FiX } from 'react-icons/fi';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-lg border border-admin-border bg-admin-bg p-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-admin-surface px-3 py-1 text-xs text-admin-text"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              <FiX className="h-3 w-3 text-admin-muted hover:text-red-400" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="Type tag and press Enter"
          className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm text-admin-text outline-none placeholder:text-admin-muted"
        />
      </div>
    </div>
  );
}
