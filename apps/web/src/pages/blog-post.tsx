import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { postsApi, type Post } from "../services/api";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await postsApi.getBySlug(slug);
        setPost(data);
        setError(null);
      } catch (err) {
        setError("Post not found");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SectionWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-mono text-muted-foreground">Loading post...</div>
        </div>
      </SectionWrapper>
    );
  }

  if (error || !post) {
    return (
      <SectionWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="font-mono text-destructive">
            {error || "Post not found"}
          </div>
          <Link to="/blog">
            <Button variant="outline" className="font-mono">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <article className="min-h-screen px-4 py-16 max-w-4xl mx-auto">
        <Link to="/blog">
          <Button variant="ghost" className="font-mono mb-8 -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-mono font-bold text-foreground mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author.name || post.author.email}
            </span>
          </div>
        </header>

        {post.excerpt && (
          <div className="border-l-4 border-primary pl-4 mb-8">
            <p className="text-lg text-muted-foreground font-mono italic">
              {post.excerpt}
            </p>
          </div>
        )}

        <div className="prose prose-invert prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-dashed prose-code:before:content-none prose-code:after:content-none max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-mono font-bold text-foreground mt-8 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-mono font-semibold text-foreground mt-8 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-mono font-semibold text-foreground mt-6 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-foreground leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground">{children}</li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                      {children}
                    </code>
                  );
                }
                return <code className={className}>{children}</code>;
              },
              pre: ({ children }) => (
                <pre className="bg-[#0d1117] border border-dashed rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm">
                  {children}
                </pre>
              ),
              hr: () => <hr className="border-dashed my-8" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border border-dashed">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-dashed px-4 py-2 bg-muted text-left font-mono font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-dashed px-4 py-2">{children}</td>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg border border-dashed my-4 max-w-full"
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-16 pt-8 border-t border-dashed">
          <Link to="/blog">
            <Button variant="outline" className="font-mono">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </footer>
      </article>
    </SectionWrapper>
  );
};

export default BlogPostPage;
