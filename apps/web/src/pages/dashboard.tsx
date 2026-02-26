import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth-provider";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  postsApi,
  type Post,
  type CreatePostDto,
  type UpdatePostDto,
} from "../services/api";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Send,
  Archive,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  published: "bg-green-500/10 text-green-500 border-green-500/30",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

const DashboardPage = () => {
  const { logout, authState } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch posts
  const fetchPosts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await postsApi.getAllPosts(page, 10);
      setPosts(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
      setError("");
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Open dialog for new post
  const handleNewPost = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setExcerpt("");
    setIsDialogOpen(true);
  };

  // Open dialog for editing post
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setExcerpt(post.excerpt || "");
    setIsDialogOpen(true);
  };

  // Save post (create or update)
  const handleSavePost = async () => {
    if (!title || !content) {
      return;
    }

    setIsSaving(true);
    try {
      if (editingPost) {
        const updateData: UpdatePostDto = { title, content };
        if (excerpt) updateData.excerpt = excerpt;
        await postsApi.update(editingPost.id, updateData);
      } else {
        const createData: CreatePostDto = { title, content };
        if (excerpt) createData.excerpt = excerpt;
        await postsApi.create(createData);
      }

      setIsDialogOpen(false);
      fetchPosts(currentPage);
    } catch (err) {
      console.error("Failed to save post:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish post
  const handlePublish = async (postId: string) => {
    try {
      await postsApi.publish(postId);
      fetchPosts(currentPage);
    } catch (err) {
      console.error("Failed to publish post:", err);
    }
  };

  // Archive post
  const handleArchive = async (postId: string) => {
    try {
      await postsApi.archive(postId);
      fetchPosts(currentPage);
    } catch (err) {
      console.error("Failed to archive post:", err);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await postsApi.delete(postId);
      fetchPosts(currentPage);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SectionWrapper>
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-mono text-foreground">Dashboard</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              Welcome, {authState.user?.name || authState.user?.email}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="font-mono border-dashed"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Button onClick={handleNewPost} className="font-mono">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-muted-foreground font-mono text-center py-12">
            Loading posts...
          </div>
        ) : error ? (
          <div className="text-destructive font-mono text-center py-12">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground font-mono text-center py-12 border border-dashed rounded-lg">
            No posts yet. Create your first post!
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-dashed rounded-lg p-4 hover:border-foreground/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-mono text-lg text-foreground truncate">
                          {post.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-mono rounded-full border ${statusColors[post.status]}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground mt-1 line-clamp-2">
                        {post.excerpt || post.content.substring(0, 150)}
                        {post.content.length > 150 && "..."}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <p className="font-mono text-xs text-muted-foreground">
                          Created: {formatDate(post.createdAt)}
                        </p>
                        {post.publishedAt && (
                          <p className="font-mono text-xs text-muted-foreground">
                            Published: {formatDate(post.publishedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {post.status === "published" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            window.open(`/blog/${post.slug}`, "_blank")
                          }
                          className="border-dashed"
                          title="View post"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {post.status === "draft" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePublish(post.id)}
                          className="border-dashed hover:border-green-500 hover:text-green-500"
                          title="Publish"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {post.status === "published" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleArchive(post.id)}
                          className="border-dashed hover:border-yellow-500 hover:text-yellow-500"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditPost(post)}
                        className="border-dashed"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                        className="border-dashed hover:border-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchPosts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="font-mono"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <span className="font-mono text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => fetchPosts(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="font-mono"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {editingPost ? "Edit Post" : "New Post"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm text-muted-foreground mb-2">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-mono"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-muted-foreground mb-2">
                  Excerpt (optional)
                </label>
                <Input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="font-mono"
                  placeholder="Brief summary of the post"
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-muted-foreground mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[300px] px-3 py-2 rounded-md border border-input bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Write your post content..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="font-mono border-dashed"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePost}
                  disabled={isSaving || !title || !content}
                  className="font-mono"
                >
                  {isSaving
                    ? "Saving..."
                    : editingPost
                      ? "Update"
                      : "Create Draft"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SectionWrapper>
  );
};

export default DashboardPage;
