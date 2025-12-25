
import { NoteType, NotebookItem, Project, ProjectCategory, KnowledgeArea } from './types';

export const INITIAL_NOTEBOOK: NotebookItem[] = [
  { id: '1', title: 'list of categories, areas, disciplines, and research fields', timestamp: 'July 27, 2022 1:39 PM', type: NoteType.NOTE, icon: 'description' },
  { id: '2', title: 'succubus detail 10 | Bruce Riley | Flickr', timestamp: 'July 27, 2022 10:50 AM', type: NoteType.PHOTOGRAPH, icon: 'image' },
  { id: '3', title: "2022'den 12 belgesel tavsiyemiz - bant mag", timestamp: 'July 27, 2022 10:49 AM', type: NoteType.ARTICLE, icon: 'article' },
  { id: '4', title: 'Yurt Dışı Gönüllülük Projeleri | Türk Hava Yolları Blog', timestamp: 'July 27, 2022 10:49 AM', type: NoteType.NOTE, icon: 'play_circle', iconColor: 'text-red-500' },
  { id: '5', title: "Caltech's aquatic robot uses AI to navigate the oceans | Popular...", timestamp: 'July 28, 2022 10:40 PM', type: NoteType.ARTICLE, icon: 'science', iconColor: 'text-orange-600' },
  { id: '6', title: 'Big Bang-era galaxy found with JWST? | Popular Science', timestamp: 'July 28, 2022 10:40 PM', type: NoteType.ARTICLE, icon: 'rocket_launch', iconColor: 'text-orange-600' },
  { id: '7', title: 'yokluğuna şahit olmadan varlığını anlayamayacağımız şeyler', timestamp: 'July 20, 2022 2:55 PM', type: NoteType.NOTE, icon: 'description' },
  { id: '8', title: 'Apostil Yapılan Örnek Belgeler', timestamp: 'July 20, 2022 2:55 PM', type: NoteType.NOTE, icon: 'bookmark' },
  { id: '9', title: "James Webb Space Telescope's first full-colour photo drop", timestamp: 'July 27, 2022 1:47 PM', type: NoteType.ARTICLE, icon: 'link' },
  { id: '10', title: 'Summer TALKOOT team volunteering', timestamp: 'July 27, 2022 1:48 PM', type: NoteType.NOTE, icon: 'bookmark' },
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', title: 'StudioEdalyn Small Business Project', category: ProjectCategory.BUSINESS, creationsCount: 2 },
  { id: 'p2', title: 'University College Freiburg, Liberal Arts & Sciences application', category: ProjectCategory.ACADEMIC },
  { id: 'p3', title: 'NMK summer school', category: ProjectCategory.PERSONAL },
];

export const KNOWLEDGE_AREAS: KnowledgeArea[] = [
  { id: 'k1', title: 'social sciences', disciplinesCount: 8, icon: 'psychology' },
  { id: 'k2', title: 'natural sciences', disciplinesCount: 6, icon: 'eco' },
  { id: 'k3', title: 'formal sciences', disciplinesCount: 5, icon: 'calculate' },
  { id: 'k4', title: 'humanities', disciplinesCount: 6, icon: 'theater_comedy' },
  { id: 'k5', title: 'professions', disciplinesCount: 7, icon: 'work' },
];
