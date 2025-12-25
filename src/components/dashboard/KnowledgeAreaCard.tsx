"use client";

import { KnowledgeArea } from "@/lib/types";

interface KnowledgeAreaCardProps {
  area: KnowledgeArea;
  onClick?: () => void;
}

export function KnowledgeAreaCard({ area, onClick }: KnowledgeAreaCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#1a1a1a] text-left px-5 py-4 rounded-lg hover:bg-[#333333] transition-all cursor-pointer group hover:shadow-lg border border-transparent hover:border-gray-700 active:scale-95"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 material-symbols-outlined text-[18px] group-hover:text-purple-400 transition-colors">
            {area.icon}
          </span>
          <span className="font-medium text-xs text-gray-200 group-hover:text-white transition-colors tracking-wide uppercase">
            {area.title}
          </span>
        </div>
        <span className="text-[10px] text-gray-500 flex items-center gap-1 pl-0.5 mt-1">
          <span className="material-symbols-outlined text-[12px] group-hover:translate-x-1 transition-transform">
            subdirectory_arrow_right
          </span>
          {area.disciplinesCount} active disciplines
        </span>
      </div>
    </button>
  );
}
