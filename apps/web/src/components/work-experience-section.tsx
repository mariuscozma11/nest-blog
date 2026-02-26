import SectionWrapper from "./section-wrapper";

interface WorkExperience {
  title: string;
  period: string;
  company: string;
  description: string;
  responsibilities: string[];
}

const workExperiences: WorkExperience[] = [
  {
    title: "Full-Stack Developer",
    period: "Feb 2025 – present",
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
    title: "Freelance Web Developer",
    period: "Jan 2024 – Feb 2025",
    company: "Self-Employed",
    description:
      "Worked as a freelance web developer, building front-end focused websites and web applications using React, Next.js, and TypeScript. Used serverless backend solutions such as Supabase and Firebase for authentication, data storage, and real-time functionality. Projects from this period are available at lagrangeengineering.ro/portfolio",
    responsibilities: [],
  },
  {
    title: "Industrial Automation Engineer",
    period: "Sep 2022 – Feb 2024",
    company: "TPS Industry SRL, Atlantis Project SRL",
    description:
      "Before transitioning into Tech, I worked as an Industrial Automation Engineer after majoring in Industrial Engineering. I held this role at Trocprim Serv SRL and Atlantis Project SRL, designing and implementing industrial process automation equipment, creating 3D pneumatic and electrical system designs, and programming PLCs and industrial robots.",
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
              {/* Past career divider before the last item */}
              {index === 2 && (
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex-1 border-t border-dashed" />
                  <span className="text-muted-foreground font-mono text-sm">
                    My past career
                  </span>
                  <div className="flex-1 border-t border-dashed" />
                </div>
              )}

              <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-mono text-foreground">
                      {experience.title}
                    </h3>
                    <p className="text-primary font-mono text-sm">
                      {experience.company}
                    </p>
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
