"use client";

import { cn } from "@/lib/utils";
import { Note } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 px-2 hover:bg-[#252525] rounded transition-all group relative">
      <div className="flex items-center gap-3 overflow-hidden">
        <span
          className={cn(
            "material-symbols-outlined text-[16px] flex-shrink-0 transition-transform group-hover:scale-110",
            note.iconColor || "text-gray-500"
          )}
        >
          {note.icon}
        </span>
        <span className="text-gray-300 truncate font-mono text-xs group-hover:text-white">
          {note.title}
        </span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3 text-[10px] tracking-wide transition-opacity group-hover:opacity-0">
          <span className="text-gray-600 font-medium">
            {formatDate(note.createdAt)}
          </span>
          <span className="bg-[#2a2a2a] text-gray-400 px-1.5 py-0.5 rounded text-[10px] border border-transparent">
            {note.type.toLowerCase()}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-900/20 text-red-500 hover:bg-red-900/40 p-1 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
