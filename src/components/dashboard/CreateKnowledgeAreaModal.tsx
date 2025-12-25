"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";

const ICONS = [
  { value: "psychology", label: "Psychology" },
  { value: "eco", label: "Nature" },
  { value: "calculate", label: "Math" },
  { value: "theater_comedy", label: "Arts" },
  { value: "work", label: "Work" },
  { value: "science", label: "Science" },
  { value: "school", label: "Education" },
  { value: "code", label: "Technology" },
  { value: "palette", label: "Design" },
  { value: "fitness_center", label: "Health" },
  { value: "attach_money", label: "Finance" },
  { value: "public", label: "Global" },
];

interface CreateKnowledgeAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateKnowledgeAreaModal({
  isOpen,
  onClose,
  onCreated,
}: CreateKnowledgeAreaModalProps) {
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("psychology");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/knowledge-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, icon }),
      });

      if (res.ok) {
        resetForm();
        onCreated();
        onClose();
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to create knowledge area", "error");
      }
    } catch (error) {
      console.error("Failed to create knowledge area:", error);
      addToast("Failed to create knowledge area. Please try again.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setIcon("psychology");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Knowledge Area" size="md">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <label className="block text-sm text-gray-400 mb-2">Icon</label>
            <Select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              options={ICONS}
              className="w-36"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Machine Learning, Philosophy..."
              autoFocus
            />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#333] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-purple-400">{icon}</span>
            <span className="text-white font-medium">
              {title || "Knowledge Area Preview"}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Knowledge areas help you organize notes by discipline or field of study.
          </p>
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
              "Create Area"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
