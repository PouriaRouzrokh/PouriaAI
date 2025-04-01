import { Metadata } from "next";
import { PortfolioDetail } from "@/components/sections/PortfolioDetail";
import { getPortfolio } from "@/lib/data-fetching";

interface PortfolioItemPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const rawSlug = params.slug;
    console.log("Generating metadata for slug param:", rawSlug);
    const decodedSlug = decodeURIComponent(params.slug);
    console.log("Decoded slug for metadata:", decodedSlug);

    // Server component can directly use the data fetching function
    const portfolioItems = await getPortfolio();

    // Try different matching strategies
    let project = portfolioItems.find((item) => item.slug === decodedSlug);

    // If not found, try case-insensitive match
    if (!project) {
      console.log("Metadata: Trying case-insensitive match");
      project = portfolioItems.find(
        (item) => item.slug.toLowerCase() === decodedSlug.toLowerCase()
      );
    }

    // If still not found, try with the raw (encoded) slug
    if (!project) {
      console.log("Metadata: Trying match with raw slug");
      project = portfolioItems.find(
        (item) =>
          item.slug === rawSlug ||
          item.slug.toLowerCase() === rawSlug.toLowerCase()
      );
    }

    if (!project) {
      console.log("Project not found for metadata");
      console.log("Attempted with raw slug:", rawSlug);
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    console.log("Found project for metadata:", project.title);

    return {
      title: project.title,
      description: project.description,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Portfolio Project",
      description: "View details of this project.",
    };
  }
}

export default function PortfolioItemPage({ params }: PortfolioItemPageProps) {
  console.log("Rendering PortfolioItemPage with slug:", params.slug);
  return <PortfolioDetail slug={params.slug} />;
}
