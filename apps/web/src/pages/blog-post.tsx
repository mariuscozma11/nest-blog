import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ghostApi, type GhostPost } from "../services/api";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await ghostApi.getPostBySlug(slug);
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
      <article className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
        <Link to="/blog">
          <Button variant="ghost" className="font-mono mb-4 -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <header className="mb-6">
          <h1 className="text-4xl font-mono font-bold text-foreground mb-3">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.published_at)}
            </span>
            {post.authors && post.authors.length > 0 && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.authors[0].name}
              </span>
            )}
            {post.reading_time && (
              <span>{post.reading_time} min read</span>
            )}
          </div>
        </header>

        {post.feature_image && (
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full rounded-lg border border-dashed mb-6"
          />
        )}

        {post.custom_excerpt && (
          <div className="border-l-4 border-primary pl-4 mb-6">
            <p className="text-lg text-muted-foreground font-mono italic">
              {post.custom_excerpt}
            </p>
          </div>
        )}

        <div
          className="prose prose-invert prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-dashed prose-code:before:content-none prose-code:after:content-none max-w-none
            [&_h1]:text-3xl [&_h1]:font-mono [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4
            [&_h2]:text-2xl [&_h2]:font-mono [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-mono [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-foreground
            [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-foreground
            [&_li]:text-foreground
            [&_a]:text-primary [&_a:hover]:underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4
            [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-primary
            [&_pre]:bg-[#0d1117] [&_pre]:border [&_pre]:border-dashed [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:font-mono [&_pre]:text-sm
            [&_pre_code]:bg-transparent [&_pre_code]:p-0
            [&_hr]:border-dashed [&_hr]:my-8
            [&_table]:min-w-full [&_table]:border [&_table]:border-dashed
            [&_th]:border [&_th]:border-dashed [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted [&_th]:text-left [&_th]:font-mono [&_th]:font-semibold
            [&_td]:border [&_td]:border-dashed [&_td]:px-4 [&_td]:py-2
            [&_img]:rounded-lg [&_img]:border [&_img]:border-dashed [&_img]:my-4 [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

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
