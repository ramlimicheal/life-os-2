"use client";

import { SearchResult } from "@/lib/types";
import { X, ExternalLink } from "lucide-react";

interface SearchResultsProps {
  result: SearchResult;
  onClose: () => void;
}

export function SearchResults({ result, onClose }: SearchResultsProps) {
  return (
    <div className="bg-[#1a1a1a] border border-purple-900/30 p-6 rounded-lg animate-slide-in shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-purple-400 flex items-center gap-2 uppercase tracking-widest">
          <span className="material-symbols-outlined text-[16px] animate-pulse">
            auto_awesome
          </span>
          Knowledge Result
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm leading-relaxed text-gray-200 mb-6 prose prose-invert prose-sm max-w-none">
        {result.text}
      </div>
      {result.sources.length > 0 && (
        <div className="border-t border-[#333] pt-4">
          <h4 className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest font-bold">
            Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.sources.map((src, i) => (
              <a
                key={i}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a1a1a] text-[10px] px-2 py-1 rounded border border-[#333] hover:border-purple-500/50 hover:text-purple-300 transition-all flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                {src.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
