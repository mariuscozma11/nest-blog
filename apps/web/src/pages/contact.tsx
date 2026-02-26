import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";

const ContactPage = () => {
  return (
    <SectionWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-evenly w-full max-w-5xl gap-12 md:gap-0">
          {/* Card */}
          <div className="w-full max-w-md border border-dashed rounded-lg p-8 bg-card order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-mono text-foreground text-center mb-2">
              Get in Touch
            </h2>
            <p className="text-muted-foreground font-mono text-sm text-center mb-8">
              Let's build something together
            </p>

            <div className="space-y-4">
              <a
                href="mailto:cozma.marius@proton.me"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <div className="p-2 border rounded-lg group-hover:border-primary transition-colors">
                  <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  cozma.marius@proton.me
                </span>
              </a>

              <a
                href="tel:+40756109881"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <div className="p-2 border rounded-lg group-hover:border-primary transition-colors">
                  <Phone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  +40 756 109 881
                </span>
              </a>

              <div className="flex items-center gap-4 p-3">
                <div className="p-2 border rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-mono text-sm text-muted-foreground">
                  Timisoara, Romania
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-dashed flex justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/marius-cozma-5262a5207"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-dashed hover:border-primary hover:border-solid"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://github.com/mariuscozma11"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-dashed hover:border-primary hover:border-solid"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 md:order-2 flex-shrink-0">
            <div className="absolute -inset-3 border rounded-full" />
            <div className="absolute -inset-6 border border-dashed rounded-full opacity-60" />
            <img
              src="https://rhg08ejxm8a9ebf4.public.blob.vercel-storage.com/file.jpeg"
              alt="Marius Cozma"
              className="h-48 w-48 md:h-56 md:w-56 rounded-full border-2 border-primary object-cover aspect-square"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactPage;
