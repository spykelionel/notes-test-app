import { Edit, Pin, Trash2 } from "lucide-react";
import React from "react";
import { Note } from "../services/api";

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNote,
  onSelectNote,
  onEditNote,
  onDeleteNote,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (notes.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-500 mb-4">No notes yet</p>
        <p className="text-sm text-gray-400">
          Create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Notes ({notes.length})
      </h3>

      {notes.map((note) => (
        <div
          key={note._id}
          className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedNote?._id === note._id
              ? "ring-2 ring-primary-500 bg-primary-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {note.isPinned && (
                  <Pin className="h-4 w-4 text-primary-600 flex-shrink-0" />
                )}
                <h4 className="font-medium text-gray-900 truncate">
                  {note.title}
                </h4>
              </div>

              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {truncateText(note.content, 80)}
              </p>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{note.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500">
                {formatDate(note.updatedAt)}
              </p>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditNote(note);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit note"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note._id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
