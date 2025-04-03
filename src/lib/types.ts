// Profile data types
export interface ProfileData {
  name: string;
  credentials?: string;
  title: string;
  email: string;
  bio: string;
  shortBio: string;
  image: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    googleScholar: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  interests: string[];
}

export interface Affiliation {
  name: string;
  url: string;
  logoUrl?: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
}

// Acknowledgment data types
export interface AcknowledgmentItem {
  name: string;
  credentials: string;
  years: string;
  title: string;
  affiliation: string;
  contribution: string;
}

// Education data types
export interface EducationItem {
  degree: string;
  institution: string;
  years: string;
  description: string;
  logoUrl?: string;
}

// Experience data types
export interface ExperienceItem {
  role: string;
  organization: string;
  years: string;
  description: string;
  logoUrl?: string;
}

// Achievement data types
export interface AchievementItem {
  title: string;
  organization: string;
  year: string;
  description: string;
  category: string; // "Award" or "Honor"
}

// Research data types
export interface ResearchData {
  author: string;
  metrics: ResearchMetrics;
  articles: Article[];
  total_articles: number;
  total_citations: number;
}

export interface ResearchMetrics {
  citations: number;
  h_index: number;
  i10_index: number;
  cited_by_5_years?: number;
}

export interface Article {
  title: string;
  authors: string[];
  year: number;
  journal: string;
  volume?: string;
  number?: string;
  pages?: string;
  abstract?: string;
  num_citations: number;
  url?: string;
  doi: string;
  bibtex: string;
}

// Portfolio data types (renamed from Project)
export interface PortfolioItem {
  title: string;
  slug: string;
  description: string;
  abstract: string; // Detailed description for individual project pages
  year: number; // Year tag for the project
  technologies: string[];
  projectTags: string[]; // Tags for categorizing and filtering projects
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  publicationUrl?: string; // URL to related academic publication
  blogPostUrl?: string; // URL to related blog post
}

// For backward compatibility
export type ProjectItem = PortfolioItem;

// Blog post frontmatter
export interface BlogPostFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
  slug: string;
}

// Blog post metadata from Notion
export interface BlogPostMetadata {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  featuredImage: string;
  published: boolean;
}

// Full blog post with content
export interface BlogPost extends BlogPostMetadata {
  content: string;
  readingTime?: ReadingTime;
}

// Reading time estimate
export interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}
