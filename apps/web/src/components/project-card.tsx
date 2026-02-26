import ImageWithLoader from "./ui/image-with-loader";

const techColors: Record<string, { bg: string; text: string; border: string }> = {
  "Java": { bg: "bg-[#f89820]/10", text: "text-[#f89820]", border: "border-[#f89820]/30" },
  "Spring Boot": { bg: "bg-[#6db33f]/10", text: "text-[#6db33f]", border: "border-[#6db33f]/30" },
  "Next.js": { bg: "bg-[#808080]/10", text: "text-[#606060] dark:text-[#a0a0a0]", border: "border-[#808080]/30" },
  "React": { bg: "bg-[#61dafb]/10", text: "text-[#0ea5e9]", border: "border-[#61dafb]/30" },
  "Node.js": { bg: "bg-[#339933]/10", text: "text-[#339933]", border: "border-[#339933]/30" },
  "PostgreSQL": { bg: "bg-[#336791]/10", text: "text-[#336791]", border: "border-[#336791]/30" },
  "TailwindCSS": { bg: "bg-[#06b6d4]/10", text: "text-[#06b6d4]", border: "border-[#06b6d4]/30" },
  "TypeScript": { bg: "bg-[#3178c6]/10", text: "text-[#3178c6]", border: "border-[#3178c6]/30" },
  "Supabase": { bg: "bg-[#3ecf8e]/10", text: "text-[#3ecf8e]", border: "border-[#3ecf8e]/30" },
  "HTML": { bg: "bg-[#e34f26]/10", text: "text-[#e34f26]", border: "border-[#e34f26]/30" },
  "JavaScript": { bg: "bg-[#f7df1e]/10", text: "text-[#b8a000]", border: "border-[#f7df1e]/30" },
  "AWS": { bg: "bg-[#ff9900]/10", text: "text-[#ff9900]", border: "border-[#ff9900]/30" },
};

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  status: "finished" | "in-dev";
  tags?: string[];
  techBadges?: string[];
}

const ProjectCard = ({ image, title, description, status, tags, techBadges }: ProjectCardProps) => {
  return (
    <div className="group h-full flex flex-col rounded-lg border border-dashed bg-card overflow-hidden transition-all hover:border-solid hover:border-primary hover:shadow-md">
      <div className="aspect-video overflow-hidden relative">
        <ImageWithLoader
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <span
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-mono rounded ${
            status === "finished"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {status === "finished" ? "Finished" : "In Development"}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-mono text-lg font-medium text-foreground line-clamp-1">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-mono rounded bg-accent text-accent-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {techBadges && techBadges.length > 0 && (
          <div className="mt-auto pt-3 flex flex-wrap gap-1">
            {techBadges.map((tech) => {
              const colors = techColors[tech] || { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
              return (
                <span
                  key={tech}
                  className={`px-2 py-1 text-xs font-mono rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
