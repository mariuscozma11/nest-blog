import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithLoader = ({ src, alt, className }: ImageWithLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageWithLoader;
