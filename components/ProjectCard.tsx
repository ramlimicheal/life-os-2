
import React from 'react';
import { Project, ProjectCategory } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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
    <div className="bg-surface-dark border-none p-4 rounded-md hover:bg-[#333333] transition-all cursor-pointer group">
      <div className="flex items-start gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5 flex-shrink-0 group-hover:bg-white transition-colors"></div>
        <h3 className="font-mono font-medium text-xs text-gray-200 leading-relaxed group-hover:text-white">{project.title}</h3>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider ${getCategoryStyles(project.category)}`}>
          {project.category}
        </span>
      </div>
      {project.creationsCount && (
        <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1 font-mono pl-1">
          <span className="material-symbols-outlined !text-[12px] text-gray-500">subdirectory_arrow_right</span>
          {project.creationsCount} creations
        </div>
      )}
    </div>
  );
};
