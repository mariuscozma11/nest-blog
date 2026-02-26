import { useState } from "react";
import { ZoomIn } from "lucide-react";
import ImageWithLoader from "./image-with-loader";

interface FullscreenImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FullscreenImage = ({ src, alt, className }: FullscreenImageProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div
        className="relative cursor-zoom-in group"
        onClick={() => setIsFullscreen(true)}
      >
        <div className={className}>
          <ImageWithLoader
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-10 w-10" />
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default FullscreenImage;
