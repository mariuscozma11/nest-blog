import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postsApi, type Post, type PaginationMeta } from "../services/api";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getPublished(page, 10);
        setPosts(response.data);
        setMeta(response.meta);
        setError(null);
      } catch (err) {
        setError("Failed to load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

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
          <div className="font-mono text-muted-foreground">
            Loading posts...
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-mono text-destructive">{error}</div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="min-h-screen px-4 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl font-mono font-bold text-foreground mb-4">
          Blog
        </h1>
        <p className="text-muted-foreground font-mono mb-12">
          Thoughts, tutorials, and insights about software development.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-mono text-muted-foreground">
              No posts published yet.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-dashed rounded-lg p-6 bg-card hover:border-foreground/50 transition-colors"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-mono font-semibold text-foreground mb-3 hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author.name || post.author.email}
                    </span>
                  </div>

                  {post.excerpt && (
                    <p className="text-muted-foreground font-mono mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" className="font-mono">
                      Read more →
                    </Button>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!meta.hasPreviousPage}
                  className="font-mono"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <span className="font-mono text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="font-mono"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </SectionWrapper>
  );
};

export default BlogPage;
