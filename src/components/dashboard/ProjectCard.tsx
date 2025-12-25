"use client";

import { cn } from "@/lib/utils";
import { Project, ProjectCategory } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getCategoryStyles = (category: ProjectCategory) => {
    switch (category) {
      case ProjectCategory.BUSINESS:
        return "text-red-300 bg-red-900/30";
      case ProjectCategory.ACADEMIC:
        return "text-purple-300 bg-purple-900/30";
      case ProjectCategory.PERSONAL:
        return "text-yellow-300 bg-yellow-900/30";
      default:
        return "text-gray-300 bg-gray-900/30";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#1a1a1a] border border-[#333] p-4 rounded-md hover:bg-[#252525] transition-all cursor-pointer group hover-lift"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5 flex-shrink-0 group-hover:bg-white transition-colors" />
        <h3 className="font-mono font-medium text-xs text-gray-200 leading-relaxed group-hover:text-white">
          {project.title}
        </h3>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span
          className={cn(
            "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider",
            getCategoryStyles(project.category)
          )}
        >
          {project.category.toLowerCase()}
        </span>
      </div>
      {project.creationsCount > 0 && (
        <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1 font-mono pl-1">
          <span className="material-symbols-outlined text-[12px] text-gray-500">
            subdirectory_arrow_right
          </span>
          {project.creationsCount} creations
        </div>
      )}
    </div>
  );
}
