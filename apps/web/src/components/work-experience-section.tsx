import SectionWrapper from "./section-wrapper";

interface WorkExperience {
  title: string;
  period: string;
  company: string;
  project?: string;
  projectUrl?: string;
  description: string;
  responsibilities: string[];
}

const workExperiences: WorkExperience[] = [
  {
    title: "Full-Stack Developer",
    period: "Jan 2026 – present",
    company: "Exa Health (via Lagrange Engineering)",
    project: "Exa Gym 2 - Multi-Tenant Gym Platform",
    projectUrl: "https://exahealth.ro",
    description:
      "Subcontracted to develop a multi-tenant gym management platform alongside other developers, expanding the original Exa Gym app to support multiple gym franchises.",
    responsibilities: [
      "Developing multi-tenant database schema with tenant isolation in PostgreSQL",
      "Building franchise admin dashboard for managing multiple gym locations",
      "Implementing white-label mobile app configuration per tenant",
      "Developing scalable API infrastructure with NestJS to handle 50k+ MAU",
    ],
  },
  {
    title: "Full-Stack Developer",
    period: "Aug 2025 – present",
    company: "MEDIS Conference (via Lagrange Engineering)",
    project: "MEDIS - Medical Conference App",
    projectUrl: "https://medistm.ro",
    description:
      "Subcontracted to develop a medical conference application alongside other developers. Sold over 300 tickets under a minute.",
    responsibilities: [
      "Created landing page website with public details about the event",
      "Built ticket purchase flow with EuPlatesc payment integration",
      "Designed workshop selection interface with real-time availability",
      "Created user registration and dashboard with Next.js and shadcn/ui",
      "Implemented backend API for ticket validation and attendee management",
      "Built QR code scanning system for event check-in",
    ],
  },
  {
    title: "Full-Stack Developer",
    period: "Aug 2024 – present",
    company: "Lagrange Engineering SRL",
    description:
      "Lagrange Engineering is a Romanian company which I have founded. It specializes in custom Web Development and as a full-stack developer I'm responsible for:",
    responsibilities: [
      "Design and implement user interfaces using React and Next.js, integrating APIs with a strong focus on usability and client requirements.",
      "Design and develop web application servers and APIs using Node.js, NestJS, and both SQL and NoSQL databases.",
      "Develop and maintain automated tests to ensure high code quality, reliability, and long-term maintainability.",
      "Build and maintain CI/CD pipelines using GitHub Actions and Docker, deploying to AWS, Railway, and Vercel.",
    ],
  },
  {
    title: "Full-Stack Developer",
    period: "Mar 2024 – Jul 2024",
    company: "Dot Koda Dev",
    project: "Nuvio - Salon Management App",
    projectUrl: "https://nuvio.ro",
    description:
      "Subcontracted to develop features for a scheduling and client management app for barbershops, clinics, and service businesses, working alongside other developers. 1k+ MAU.",
    responsibilities: [
      "Built booking management interface with Next.js and TailwindCSS",
      "Implemented real-time calendar with drag-and-drop scheduling",
      "Created Supabase edge functions for appointment logic and notifications",
    ],
  },
  {
    title: "Full-Stack Developer",
    period: "Oct 2023 – Feb 2024",
    company: "Gym One (via Dot Koda Dev)",
    project: "Exa Gym - Gym Management App",
    projectUrl: "https://exahealth.ro",
    description:
      "Subcontracted to develop a gym membership mobile app for Gym One, a franchise in Timisoara, working alongside other developers. 10k+ MAU.",
    responsibilities: [
      "Built user dashboard and membership tracking screens in React Native",
      "Implemented QR check-in flow for gym entry",
      "Designed RESTful API endpoints for membership management using NestJS",
      "Helped design database schema for users and subscriptions in PostgreSQL",
    ],
  },
  {
    title: "Freelance Web Developer",
    period: "Feb 2023 – Sep 2023",
    company: "Self-Employed",
    description:
      "Worked as a freelance web developer, creating websites for small businesses and individuals. Built responsive landing pages, corporate websites, and portfolio sites using React, Next.js, and TailwindCSS. Focused on SEO optimization, performance, and clean design.",
    responsibilities: [],
  },
];

const WorkExperienceSection = () => {
  return (
    <SectionWrapper>
      <div className="py-12 px-4">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-mono text-foreground">
            Work Experience
          </h2>
        </div>

        <div className="space-y-8">
          {workExperiences.map((experience, index) => (
            <div key={index}>

              <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-mono text-foreground">
                      {experience.title}
                    </h3>
                    <p className="text-primary font-mono text-sm">
                      {experience.company}
                    </p>
                    {experience.project && (
                      <p className="text-muted-foreground font-mono text-sm mt-1">
                        {experience.projectUrl ? (
                          <a
                            href={experience.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {experience.project} →
                          </a>
                        ) : (
                          experience.project
                        )}
                      </p>
                    )}
                  </div>
                  <span className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                    {experience.period}
                  </span>
                </div>

                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  {experience.description}
                </p>

                {experience.responsibilities.length > 0 && (
                  <ul className="mt-4 space-y-2 list-disc list-inside">
                    {experience.responsibilities.map((responsibility, idx) => (
                      <li
                        key={idx}
                        className="text-muted-foreground font-mono text-sm leading-relaxed"
                      >
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default WorkExperienceSection;
