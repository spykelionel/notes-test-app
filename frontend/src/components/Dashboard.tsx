import { LogOut, Plus, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Note, notesAPI } from "../services/api";
import NoteEditor from "./NoteEditor";
import NoteList from "./NoteList";

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await notesAPI.getAll();
      setNotes(response.notes);
    } catch (err: any) {
      setError("Failed to load notes");
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await notesAPI.delete(noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
      if (selectedNote?._id === noteId) {
        setSelectedNote(null);
        setIsEditorOpen(false);
      }
    } catch (err: any) {
      setError("Failed to delete note");
      console.error("Error deleting note:", err);
    }
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    try {
      if (selectedNote) {
        // Update existing note
        const response = await notesAPI.update(
          selectedNote._id,
          noteData as any
        );
        setNotes(
          notes.map((note) =>
            note._id === selectedNote._id ? response.note : note
          )
        );
      } else {
        // Create new note
        const response = await notesAPI.create(noteData as any);
        setNotes([response.note, ...notes]);
      }
      setIsEditorOpen(false);
      setSelectedNote(null);
    } catch (err: any) {
      setError("Failed to save note");
      console.error("Error saving note:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Notes App</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
          <button
            onClick={handleCreateNote}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Notes List */}
            <div className="lg:col-span-1">
              <NoteList
                notes={notes}
                selectedNote={selectedNote}
                onSelectNote={setSelectedNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>

            {/* Note Editor */}
            <div className="lg:col-span-2">
              {isEditorOpen ? (
                <NoteEditor
                  note={selectedNote}
                  onSave={handleSaveNote}
                  onCancel={() => {
                    setIsEditorOpen(false);
                    setSelectedNote(null);
                  }}
                />
              ) : selectedNote ? (
                <div className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedNote.title}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(selectedNote)}
                        className="btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(selectedNote._id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedNote.content}
                    </p>
                  </div>
                  {selectedNote.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="card text-center">
                  <p className="text-gray-500">
                    Select a note to view or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
