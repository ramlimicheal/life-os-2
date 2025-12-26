"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { NoteType } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";

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

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateNoteModal({ isOpen, onClose, onCreated }: CreateNoteModalProps) {
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>(NoteType.NOTE);
  const [icon, setIcon] = useState("description");
  const [tags, setTags] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type, icon, tags }),
      });

      if (res.ok) {
        resetForm();
        onCreated();
        onClose();
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to create note", "error");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      addToast("Failed to create note. Please try again.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType(NoteType.NOTE);
    setIcon("description");
    setTags("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Note" size="lg">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <label className="block text-sm text-gray-400 mb-2">Icon</label>
            <Select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              options={ICONS}
              className="w-32"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              autoFocus
            />
          </div>
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
            placeholder="Start writing..."
            className="max-h-[300px] overflow-y-auto"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Note"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
