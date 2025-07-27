import { Pin, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Note } from "../services/api";

interface NoteEditorProps {
  note: Note | null;
  onSave: (noteData: Partial<Note>) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(", "));
      setIsPinned(note.isPinned);
    } else {
      setTitle("");
      setContent("");
      setTags("");
      setIsPinned(false);
    }
    setErrors({});
  }, [note]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length > 10000) {
      newErrors.content = "Content must be less than 10000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, 10); // Limit to 10 tags

    onSave({
      title: title.trim(),
      content: content.trim(),
      tags: tagArray,
      isPinned,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {note ? "Edit Note" : "New Note"}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
            data-testid="save-note-button"
          >
            <Save className="h-4 w-4" />
            Save Note
          </button>
          <button
            onClick={onCancel}
            className="btn-secondary flex items-center gap-2"
            data-testid="cancel-note-button"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input ${errors.title ? "border-red-500" : ""}`}
            placeholder="Note title"
            maxLength={100}
            data-testid="title-input"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Content Textarea */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`input min-h-[200px] resize-y ${
              errors.content ? "border-red-500" : ""
            }`}
            placeholder="Write your note content here..."
            maxLength={10000}
            data-testid="content-textarea"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}

          <p className="mt-1 text-xs text-gray-500">
            {content.length}/10000 characters
          </p>
        </div>

        {/* Tags Input */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input"
            placeholder="Add tags (comma separated)"
            data-testid="tags-input"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate tags with commas (max 10 tags)
          </p>
        </div>

        {/* Pin Toggle */}
        <div className="flex items-center">
          <input
            id="pin"
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            data-testid="pin-checkbox"
          />
          <label
            htmlFor="pin"
            className="ml-2 flex items-center gap-2 text-sm text-gray-700"
          >
            <Pin className="h-4 w-4" />
            Pin note
          </label>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Keyboard shortcuts:</p>
          <p>Ctrl/Cmd + S to save</p>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
