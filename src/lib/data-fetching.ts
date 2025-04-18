import fs from "fs";
import path from "path";
import {
  ProfileData,
  EducationItem,
  ExperienceItem,
  ResearchData,
  PortfolioItem,
  AchievementItem,
  AcknowledgmentItem,
  RawProfileData,
  RawEducationData,
  RawExperienceData,
  RawAchievementData,
  RawResearchData,
  RawAcknowledgmentData,
} from "./types";

// Helper function to read and parse JSON files - only used on server
function readJsonFile<T>(filePath: string): T {
  // This function should only be called in a server context
  if (typeof window !== "undefined") {
    throw new Error("readJsonFile should only be called on the server");
  }

  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContents) as T;
}

// Profile data
export async function getProfile(): Promise<ProfileData> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/profile");
    if (!response.ok) throw new Error("Failed to fetch profile data");
    return response.json();
  }

  // Server-side call
  const profileData = readJsonFile<RawProfileData>(
    "public/content/profile.json"
  );
  return {
    name: profileData.name || "Portfolio Owner",
    credentials: profileData.credentials,
    title: profileData.title || "Professional",
    email: profileData.email || "contact@example.com",
    bio: profileData.bio || "Welcome to my portfolio.",
    shortBio: profileData.shortBio || "Portfolio owner.",
    image: profileData.image || "/placeholder-profile.jpg",
    social: {
      twitter: profileData.social?.twitter || "",
      github: profileData.social?.github || "",
      linkedin: profileData.social?.linkedin || "",
      googleScholar: profileData.social?.googleScholar || "",
    },
    skills: Array.isArray(profileData.skills) ? profileData.skills : [],
  };
}

// Education data
export async function getEducation(): Promise<EducationItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/education");
    if (!response.ok) throw new Error("Failed to fetch education data");
    return response.json();
  }

  // Server-side call
  const educationData = readJsonFile<RawEducationData>(
    "public/content/education.json"
  );

  // Extract the degrees array and map to EducationItem format
  if (
    educationData &&
    educationData.degrees &&
    Array.isArray(educationData.degrees)
  ) {
    return educationData.degrees.map(
      (item: {
        degree: string;
        institution: string;
        years: string;
        description: string;
        logo?: string;
      }) => ({
        degree: item.degree,
        institution: item.institution,
        years: item.years,
        description: item.description,
        logoUrl: item.logo || undefined,
      })
    );
  }

  console.error(
    "Education data doesn't have the expected structure:",
    educationData
  );
  return [];
}

// Experience data
export async function getExperience(): Promise<ExperienceItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/experience");
    if (!response.ok) throw new Error("Failed to fetch experience data");
    return response.json();
  }

  // Server-side call
  const experienceData = readJsonFile<RawExperienceData>(
    "public/content/experience.json"
  );

  // Extract the positions array and map to ExperienceItem format
  if (
    experienceData &&
    experienceData.positions &&
    Array.isArray(experienceData.positions)
  ) {
    return experienceData.positions.map(
      (position: {
        title: string;
        organization: string;
        years: string;
        description: string;
        logo?: string;
      }) => {
        return {
          role: position.title,
          organization: position.organization,
          years: position.years,
          description: position.description,
          logoUrl: position.logo,
        };
      }
    );
  }

  console.error(
    "Experience data doesn't have the expected structure:",
    experienceData
  );
  return [];
}

// Achievements data
export async function getAchievements(): Promise<AchievementItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/achievements");
    if (!response.ok) throw new Error("Failed to fetch achievements data");
    return response.json();
  }

  // Server-side call
  const achievementsData = readJsonFile<RawAchievementData>(
    "public/content/achievements.json"
  );
  let results: AchievementItem[] = [];

  // Extract and process awards
  if (
    achievementsData &&
    achievementsData.awards &&
    Array.isArray(achievementsData.awards)
  ) {
    const awards = achievementsData.awards.map(
      (item: {
        title: string;
        organization: string;
        year: string;
        description: string;
      }) => ({
        title: item.title,
        organization: item.organization,
        year: item.year,
        description: item.description,
        category: "Award",
      })
    );
    results = [...results, ...awards];
  }

  // Extract and process honors
  if (
    achievementsData &&
    achievementsData.honors &&
    Array.isArray(achievementsData.honors)
  ) {
    const honors = achievementsData.honors.map(
      (item: {
        title: string;
        organization: string;
        year: string;
        description: string;
      }) => ({
        title: item.title,
        organization: item.organization,
        year: item.year,
        description: item.description,
        category: "Honor",
      })
    );
    results = [...results, ...honors];
  }

  // Sort by year (descending)
  results.sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    return yearB - yearA;
  });

  return results;
}

// Research data
export async function getResearch(): Promise<ResearchData> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/research");
    if (!response.ok) throw new Error("Failed to fetch research data");
    return response.json();
  }

  // Server-side call
  const researchData = readJsonFile<RawResearchData>(
    "public/content/research.json"
  );

  // Calculate total articles and citations if not provided
  const articles = Array.isArray(researchData.articles)
    ? researchData.articles
    : [];

  // Use processed totals from the JSON file if available, otherwise calculate from articles
  const totalArticles =
    researchData.total_articles_processed ||
    researchData.total_articles ||
    articles.length;

  const totalCitations =
    researchData.total_citations_processed ||
    researchData.total_citations ||
    articles.reduce(
      (sum: number, article: { num_citations: number }) =>
        sum + (article.num_citations || 0),
      0
    );

  return {
    author: researchData.author || "Researcher",
    metrics: {
      citations: researchData.metrics?.citations || 0,
      h_index: researchData.metrics?.h_index || 0,
      i10_index: researchData.metrics?.i10_index || 0,
    },
    articles,
    total_articles: totalArticles,
    total_citations: totalCitations,
  };
}

// Portfolio data (renamed from Projects)
export async function getPortfolio(): Promise<PortfolioItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/portfolio");
    if (!response.ok) throw new Error("Failed to fetch portfolio data");
    return response.json();
  }

  // Server-side call - read from individual files
  try {
    const portfolioDir = path.join(process.cwd(), "public/content/portfolio");
    const files = fs
      .readdirSync(portfolioDir)
      .filter((file) => file.endsWith(".json"));

    const portfolioItems: PortfolioItem[] = [];

    for (const file of files) {
      const filePath = path.join(portfolioDir, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      try {
        const projectData = JSON.parse(fileContents) as PortfolioItem;
        portfolioItems.push(projectData);
      } catch (parseError) {
        console.error(`Error parsing portfolio file ${file}:`, parseError);
      }
    }

    // Sort by year (most recent first)
    return portfolioItems.sort((a, b) => b.year - a.year);
  } catch (error) {
    console.error("Error reading portfolio files:", error);
    return [];
  }
}

// For backward compatibility
export const getProjects = getPortfolio;

// Acknowledgment data
export async function getAcknowledgments(): Promise<AcknowledgmentItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/acknowledgments");
    if (!response.ok) throw new Error("Failed to fetch acknowledgments data");
    return response.json();
  }

  // Server-side call
  const acknowledgmentData = readJsonFile<RawAcknowledgmentData>(
    "public/content/acknowledgments.json"
  );

  // Extract the mentors array and map to AcknowledgmentItem format
  if (
    acknowledgmentData &&
    acknowledgmentData.mentors &&
    Array.isArray(acknowledgmentData.mentors)
  ) {
    return acknowledgmentData.mentors.map(
      (mentor: {
        name: string;
        credentials: string;
        years: string;
        title: string;
        affiliation: string;
        imageUrl?: string;
      }) => ({
        name: mentor.name,
        credentials: mentor.credentials,
        years: mentor.years,
        title: mentor.title,
        affiliation: mentor.affiliation,
        imageUrl: mentor.imageUrl,
      })
    );
  }

  console.error(
    "Acknowledgment data doesn't have the expected structure:",
    acknowledgmentData
  );
  return [];
}
