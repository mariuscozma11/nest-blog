const GHOST_API_URL = import.meta.env.VITE_GHOST_API_URL;
const GHOST_CONTENT_API_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY;

// Ghost API Types
export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
}

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string | null;
  custom_excerpt: string | null;
  feature_image: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  reading_time: number;
  authors: GhostAuthor[];
}

export interface GhostPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next: number | null;
  prev: number | null;
}

export interface GhostPostsResponse {
  posts: GhostPost[];
  meta: {
    pagination: GhostPagination;
  };
}

export interface GhostSinglePostResponse {
  posts: GhostPost[];
}

// Ghost Content API
export const ghostApi = {
  getPosts: async (page = 1, limit = 10): Promise<GhostPostsResponse> => {
    const url = `${GHOST_API_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_API_KEY}&page=${page}&limit=${limit}&include=authors`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  },

  getPostBySlug: async (slug: string): Promise<GhostPost> => {
    const url = `${GHOST_API_URL}/ghost/api/content/posts/slug/${slug}/?key=${GHOST_CONTENT_API_KEY}&include=authors`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Post not found");
    }
    const data: GhostSinglePostResponse = await response.json();
    if (!data.posts || data.posts.length === 0) {
      throw new Error("Post not found");
    }
    return data.posts[0];
  },
};
