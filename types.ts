
export enum NoteType {
  NOTE = 'note',
  ARTICLE = 'article',
  PHOTOGRAPH = 'photograph',
  VIDEO = 'video',
  LINK = 'link'
}

export interface NotebookItem {
  id: string;
  title: string;
  timestamp: string;
  type: NoteType;
  icon: string;
  iconColor?: string;
}

export enum ProjectCategory {
  BUSINESS = 'business',
  ACADEMIC = 'academic',
  PERSONAL = 'personal'
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  creationsCount?: number;
}

export interface KnowledgeArea {
  id: string;
  title: string;
  disciplinesCount: number;
  icon: string;
}
