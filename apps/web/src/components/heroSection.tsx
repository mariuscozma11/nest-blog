import { Github, Linkedin } from "lucide-react";
import { BackgroundRippleEffect } from "./ui/background-ripple-effect";
import { Button } from "./ui/button";
import ImageWithLoader from "./ui/image-with-loader";

const HeroSection = () => {
  return (
    <div className="w-full">
      <div className="border-x border-dashed max-w-7xl mx-auto">
        <div className="relative min-h-[448px]">
          <BackgroundRippleEffect>
            <div className="flex flex-row gap-6 items-center">
              <div className="h-30 w-30 rounded-full border-2 border-accent-foreground overflow-hidden">
                <ImageWithLoader
                  src="https://rhg08ejxm8a9ebf4.public.blob.vercel-storage.com/file.jpeg"
                  alt="Marius Cozma"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <h1 className="text-4xl lg:text-5xl font-mono">
                  Hi, I'm <span className="text-primary font-mono">Marius</span>!
                </h1>
                <p className="text-secondary-foreground text-lg lg:text-xl font-mono">
                  backend / full-stack developer
                </p>
                <ul className="flex flex-row items-center gap-2">
                  <a
                    href="https://www.linkedin.com/in/marius-cozma-5262a5207"
                    target="_blank"
                  >
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="rounded-full"
                    >
                      <Linkedin className="text-black dark:text-white" />
                    </Button>
                  </a>
                  <a href="https://github.com/mariuscozma11" target="_blank">
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="rounded-full"
                    >
                      <Github className="text-black dark:text-white" />
                    </Button>
                  </a>
                </ul>
              </div>
            </div>
          </BackgroundRippleEffect>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
