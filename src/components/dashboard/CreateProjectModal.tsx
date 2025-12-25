"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ProjectCategory } from "@/lib/types";

const PROJECT_CATEGORIES = [
  { value: "PERSONAL", label: "Personal" },
  { value: "BUSINESS", label: "Business" },
  { value: "ACADEMIC", label: "Academic" },
];

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>(ProjectCategory.PERSONAL);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });

      if (res.ok) {
        resetForm();
        onCreated();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(ProjectCategory.PERSONAL);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Project Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Project..."
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-2 px-4 text-sm text-white placeholder:text-gray-500 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all resize-none h-24"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Category</label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory)}
            options={PROJECT_CATEGORIES}
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
              "Create Project"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
