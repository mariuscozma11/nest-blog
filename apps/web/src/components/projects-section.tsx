import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import ProjectCard from "./project-card";
import SectionWrapper from "./section-wrapper";
import FullscreenImage from "./ui/fullscreen-image";
import { useState } from "react";

interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  status: "finished" | "in-dev";
  tags?: string[];
  techBadges?: string[];
  github?: string;
  live?: string;
}

const mockProjects: Project[] = [
  {
    id: 1,
    image: "/exa.jpeg",
    title: "Exa Gym 2",
    description: "Multi-tenant gym management platform supporting multiple franchises. 50k+ MAU target.",
    fullDescription: "Subcontracted to develop a multi-tenant gym management platform alongside other developers, expanding the original Exa Gym app to support multiple gym franchises. Developing multi-tenant database schema with tenant isolation in PostgreSQL, building franchise admin dashboard for managing multiple gym locations, implementing white-label mobile app configuration per tenant, and developing scalable API infrastructure with NestJS to handle 50k+ MAU.",
    technologies: ["TypeScript", "React Native", "NestJS", "PostgreSQL", "Multi-tenant Architecture"],
    status: "in-dev",
    tags: ["50k+ MAU target", "Multi-tenant"],
    techBadges: ["React Native", "NestJS", "TypeScript"],
    live: "https://exahealth.ro/",
  },
  {
    id: 2,
    image: "/medis.png",
    title: "MEDIS",
    description: "Medical conference app with ticket sales, workshop allocation, and QR code presence tracking. Sold over 300 tickets under a minute.",
    fullDescription: "Subcontracted to develop a medical conference application alongside other developers. Features include landing page with event details, ticket purchase flow with EuPlatesc payment integration, workshop selection interface with real-time availability, user registration and dashboard with Next.js and shadcn/ui, backend API for ticket validation and attendee management, and QR code scanning system for event check-in. Sold over 300 tickets under a minute.",
    technologies: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "shadcn/ui", "TailwindCSS"],
    status: "finished",
    tags: ["300+ tickets in <1 min"],
    techBadges: ["Next.js", "NestJS", "TypeScript"],
    live: "https://medistm.ro",
  },
  {
    id: 3,
    image: "/nuvio.png",
    title: "Nuvio",
    description: "Scheduling app for barbershops, clinics, and service businesses. 1k+ MAU.",
    fullDescription: "Subcontracted to develop features for a scheduling and client management app for barbershops, clinics, and service businesses, working alongside other developers. Built booking management interface with Next.js and TailwindCSS, implemented real-time calendar with drag-and-drop scheduling, and created Supabase edge functions for appointment logic and notifications. 1k+ monthly active users.",
    technologies: ["TypeScript", "Next.js", "TailwindCSS", "Supabase", "Edge Functions"],
    status: "finished",
    tags: ["1k+ MAU"],
    techBadges: ["Next.js", "Supabase", "TypeScript"],
    live: "https://nuvio.ro",
  },
  {
    id: 4,
    image: "/exa.jpeg",
    title: "Exa Gym",
    description: "Gym membership mobile app for the Gym One franchise. 10k+ MAU.",
    fullDescription: "Subcontracted to develop a gym membership mobile app for Gym One, a franchise in Timisoara, working alongside other developers. Built user dashboard and membership tracking screens in React Native, implemented QR check-in flow for gym entry, designed RESTful API endpoints for membership management using NestJS, and helped design database schema for users and subscriptions in PostgreSQL. 10k+ monthly active users.",
    technologies: ["TypeScript", "React Native", "NestJS", "PostgreSQL"],
    status: "finished",
    tags: ["10k+ MAU"],
    techBadges: ["React Native", "NestJS", "TypeScript"],
  },
  {
    id: 5,
    image: "/novaworks.png",
    title: "NovaWorks",
    description: "Ecommerce platform for a 3D printing business with custom 3D file quotation.",
    fullDescription: "Contracted to build a complete ecommerce platform for a 3D printing business. Sole developer on the project. Frontend with Next.js, TailwindCSS, TanStack Query, and shadcn. Custom 3D file upload and quotation interface. Admin dashboard for products, categories, analytics, and orders. Romanian/English localization with i18n. Backend API with NestJS, TypeScript, and PostgreSQL.",
    technologies: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "TailwindCSS", "TanStack Query", "i18n"],
    status: "in-dev",
    techBadges: ["Next.js", "NestJS", "TypeScript"],
    live: "https://novaworks.ro/",
  },
  {
    id: 6,
    image: "/lagrange.png",
    title: "Lagrange Engineering",
    description: "Corporate website for my freelance web development company.",
    fullDescription: "The official website for Lagrange Engineering, my freelance web development company. Built with Next.js and TypeScript, featuring a modern design showcasing services, portfolio, and contact information. Includes SEO optimization and fast static generation.",
    technologies: ["TypeScript", "Next.js", "React", "TailwindCSS"],
    status: "finished",
    techBadges: ["Next.js", "TypeScript"],
    live: "https://www.lagrangeengineering.ro/ro",
  },
  {
    id: 7,
    image: "/corox.png",
    title: "Corox Engineering",
    description: "Corporate website for an industrial automation and machine safety company.",
    fullDescription: "Complete corporate website for Corox Engineering, a company specializing in industrial automation, Machine Safety, risk assessments, and integrated technical systems. Built with Next.js and TypeScript featuring responsive design, contact forms, service showcase, and professional branding. Uses static site generation for optimal performance.",
    technologies: ["TypeScript", "Next.js", "React", "TailwindCSS", "SSG"],
    status: "finished",
    techBadges: ["Next.js", "TypeScript"],
    live: "https://coroxengineering.ro",
  },
  {
    id: 8,
    image: "/dkat.png",
    title: "D-KAT Tour",
    description: "Showcase website for exclusive supercar and exotic vehicle experiences.",
    fullDescription: "Elegant showcase website for D-KAT Tour, a company organizing exclusive automotive experiences with supercars and exotic vehicles. Built with Next.js and TypeScript. The platform showcases the available vehicle fleet, including Porsche 911 Turbo S, Lamborghini Huracán, Ferrari SF90, and Rolls-Royce Dawn. Features include photo gallery with lazy loading, partnership system, and contact section.",
    technologies: ["TypeScript", "Next.js", "TailwindCSS", "React"],
    status: "finished",
    techBadges: ["Next.js", "TypeScript"],
    live: "http://d-kat.com/",
  },
  {
    id: 9,
    image: "/hazard.png",
    title: "Hazzard Studio",
    description: "Professional website for a modern barbershop in Timișoara.",
    fullDescription: "Professional website for Hazzard Studio, a modern barbershop in Timișoara. Built with Next.js and TypeScript. The platform includes service presentation, photo gallery with optimized images, barber profiles, operating hours, and mobile app integration for bookings. Focus on user experience and conversion optimization.",
    technologies: ["TypeScript", "Next.js", "TailwindCSS", "React"],
    status: "finished",
    techBadges: ["Next.js", "TypeScript"],
    live: "http://hazzardstudio.ro/",
  },
  {
    id: 10,
    image: "/cumcomunic.png",
    title: "Cum Comunic",
    description: "Relational counseling website for the ESPERE Method.",
    fullDescription: "Professional website for Liliana Enculescu, a relational counselor and accredited trainer in the ESPERE Method, with over 20 years of experience and 13,000+ clients. Built with Next.js and TypeScript with focus on SEO and accessibility. Features testimonials, FAQ, consultation booking, and detailed service presentation.",
    technologies: ["TypeScript", "Next.js", "TailwindCSS", "React", "SEO"],
    status: "finished",
    techBadges: ["Next.js", "TypeScript"],
    live: "http://cumcomunic.ro/",
  },
  {
    id: 11,
    image: "/cliniva.png",
    title: "Cliniva",
    description: "Medical center website for recovery and wellness services.",
    fullDescription: "Complete website for Cliniva, a modern medical recovery and wellness center in Timișoara. Built with Next.js and TypeScript featuring comprehensive SEO optimization. Showcases the full range of medical services including orthopedics, physical therapy, and psychology. Includes medical team profiles, patient testimonials, and online booking system.",
    technologies: ["TypeScript", "Next.js", "TailwindCSS", "React", "SEO"],
    status: "finished",
    techBadges: ["Next.js", "TypeScript"],
    live: "http://cliniva.ro/",
  },
  {
    id: 12,
    image: "/mechafusion.png",
    title: "Mechafusion UPT",
    description: "Official website for the robotics club of Politehnica University Timișoara.",
    fullDescription: "Modern and engaging website for Mechafusion, the official robotics club of Universitatea Politehnica Timișoara. Built with vanilla JavaScript and deployed on AWS S3 with Cloudflare CDN. Features project showcases, member profiles, event announcements, and recruitment information.",
    technologies: ["JavaScript", "TailwindCSS", "AWS S3", "Cloudflare"],
    status: "finished",
    techBadges: ["JavaScript", "AWS"],
    live: "https://www.clubrobotica.upt.ro/",
  },
];

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <SectionWrapper>
      <div className="py-12 px-4 md:px-16">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-mono text-foreground">
            Projects
          </h2>
          <p className="mt-2 text-muted-foreground font-mono">
            A selection of my recent work
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {mockProjects.map((project) => (
              <CarouselItem
                key={project.id}
                className="basis-full md:basis-1/3 lg:basis-1/4 h-auto"
              >
                <div
                  className="p-1 h-full cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <ProjectCard
                    image={project.image}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    tags={project.tags}
                    techBadges={project.techBadges}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 hidden md:flex" />
          <CarouselNext className="-right-12 hidden md:flex" />
          {/* Mobile controls */}
          <div className="flex justify-center gap-4 mt-4 md:hidden">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>

        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="max-w-2xl">
            {selectedProject && (
              <>
                <FullscreenImage
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full aspect-video rounded-lg overflow-hidden"
                />
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <DialogTitle className="font-mono text-xl">
                      {selectedProject.title}
                    </DialogTitle>
                    <span
                      className={`px-2 py-1 text-xs font-mono rounded ${
                        selectedProject.status === "finished"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {selectedProject.status === "finished" ? "Finished" : "In Development"}
                    </span>
                  </div>
                  <DialogDescription className="font-mono text-sm">
                    {selectedProject.fullDescription}
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <h4 className="font-mono text-sm text-foreground mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedProject.live && (
                  <div className="flex gap-4">
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Link →
                    </a>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SectionWrapper>
  );
};

export default ProjectsSection;
