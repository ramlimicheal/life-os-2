export enum NoteType {
  NOTE = "NOTE",
  ARTICLE = "ARTICLE",
  PHOTOGRAPH = "PHOTOGRAPH",
  VIDEO = "VIDEO",
  LINK = "LINK",
}

export enum ProjectCategory {
  BUSINESS = "BUSINESS",
  ACADEMIC = "ACADEMIC",
  PERSONAL = "PERSONAL",
}

export interface Note {
  id: string;
  title: string;
  content?: string | null;
  type: NoteType;
  icon: string;
  iconColor?: string | null;
  tags?: string | null;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId?: string | null;
  knowledgeAreaId?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  category: ProjectCategory;
  creationsCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface KnowledgeArea {
  id: string;
  title: string;
  icon: string;
  disciplinesCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AICommandResult {
  title: string;
  type: NoteType;
  icon: string;
  iconColor?: string;
}

export interface SearchResult {
  text: string;
  sources: { title: string; uri: string }[];
}
