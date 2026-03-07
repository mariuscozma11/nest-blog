import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ghostApi, type GhostPost, type GhostPagination } from "../services/api";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

const BlogPage = () => {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [pagination, setPagination] = useState<GhostPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await ghostApi.getPosts(page, 10);
        setPosts(response.posts);
        setPagination(response.meta.pagination);
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
      <div className="min-h-screen py-8 px-4">
        <h1 className="text-4xl font-mono font-bold text-foreground mb-2">
          Blog
        </h1>
        <p className="text-muted-foreground font-mono mb-6">
          Thoughts, tutorials, and insights about software development and engineering.
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

                  {(post.custom_excerpt || post.excerpt) && (
                    <p className="text-muted-foreground font-mono mb-4">
                      {post.custom_excerpt || post.excerpt}
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
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={pagination.prev === null}
                  className="font-mono"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <span className="font-mono text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pagination.next === null}
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
