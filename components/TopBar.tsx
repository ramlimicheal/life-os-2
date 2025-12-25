
import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="w-full flex justify-between items-center px-6 py-3 text-[10px] text-gray-500 font-medium tracking-wide border-b border-[#252525]">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined !text-[14px]">grid_view</span>
        <span>Life 2.0</span>
        <span className="text-gray-600 material-symbols-outlined !text-[10px]">lock</span>
        <span>Locked</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="cursor-pointer hover:text-white transition-colors">Share</span>
        <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white transition-colors">chat_bubble</span>
        <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white transition-colors">settings</span>
        <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white transition-colors">star</span>
        <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white transition-colors">more_horiz</span>
      </div>
    </div>
  );
};
