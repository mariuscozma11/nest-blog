import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="w-full">
      <div className="border-x border-dashed max-w-7xl mx-auto">
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
          <h1 className="text-6xl lg:text-8xl font-mono text-primary mb-4">
            404
          </h1>
          <h2 className="text-2xl lg:text-3xl font-mono text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground font-mono text-center mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="outline" className="font-mono">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
