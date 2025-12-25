"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { Note, NoteType } from "@/lib/types";
import Link from "next/link";

const NOTE_TYPES = [
  { value: "NOTE", label: "Note" },
  { value: "ARTICLE", label: "Article" },
  { value: "PHOTOGRAPH", label: "Photograph" },
  { value: "VIDEO", label: "Video" },
  { value: "LINK", label: "Link" },
];

const ICONS = [
  { value: "description", label: "Document" },
  { value: "article", label: "Article" },
  { value: "image", label: "Image" },
  { value: "play_circle", label: "Video" },
  { value: "link", label: "Link" },
  { value: "lightbulb", label: "Idea" },
  { value: "bookmark", label: "Bookmark" },
  { value: "star", label: "Star" },
  { value: "favorite", label: "Heart" },
  { value: "code", label: "Code" },
];

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>(NoteType.NOTE);
  const [icon, setIcon] = useState("description");
  const [tags, setTags] = useState("");

  const fetchNote = useCallback(async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data);
        setTitle(data.title);
        setContent(data.content || "");
        setType(data.type);
        setIcon(data.icon);
        setTags(data.tags || "");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch note:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [noteId, router]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  useEffect(() => {
    if (note) {
      const changed =
        title !== note.title ||
        content !== (note.content || "") ||
        type !== note.type ||
        icon !== note.icon ||
        tags !== (note.tags || "");
      setHasChanges(changed);
    }
  }, [title, content, type, icon, tags, note]);

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type, icon, tags }),
      });

      if (res.ok) {
        const updatedNote = await res.json();
        setNote(updatedNote);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    if (!confirm("Are you sure you want to delete this note?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          {note.aiGenerated && (
            <span className="flex items-center gap-1 text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              options={ICONS}
              className="w-32"
            />
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as NoteType)}
              options={NOTE_TYPES}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tags</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Content</label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your note..."
          />
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-4">
          <span>
            Created:{" "}
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <span>
            Updated:{" "}
            {new Date(note.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
