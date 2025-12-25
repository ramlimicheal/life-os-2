"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

interface AICommandInputProps {
  onSubmit: (command: string) => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
}

export function AICommandInput({
  onSubmit,
  onCancel,
  isProcessing,
}: AICommandInputProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;
    await onSubmit(command);
    setCommand("");
  };

  return (
    <div className="bg-[#252525] p-5 rounded-md border border-[#333] animate-slide-in shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span className="material-symbols-outlined text-[16px] text-purple-400">
            auto_awesome
          </span>
          <span>AI Logic: Describe the entry to add...</span>
        </div>
        <input
          autoFocus
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="e.g. Save a photo of a brutalist building from Flickr"
          className="bg-[#1a1a1a] border-[#333] border text-white text-xs p-3 rounded focus:ring-1 focus:ring-purple-500 outline-none w-full shadow-inner"
          disabled={isProcessing}
        />
        <div className="flex justify-end gap-3 mt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="uppercase tracking-widest font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isProcessing}
            className="uppercase tracking-widest font-bold bg-purple-900/40 text-purple-300 border border-purple-800/50 hover:bg-purple-800/60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              "Add Entry"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
