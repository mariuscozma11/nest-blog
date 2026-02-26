// Blog API Types

// Response type from GET /posts and GET /posts/:id
export interface Post {
  post_id: string;
  title: string;
  content: string;
  created_at: string;
}

// Request body for POST /posts and PATCH /posts/:id
export interface CreatePostRequest {
  title: string;
  content: string;
}

// Alias for update (same structure as create)
export type UpdatePostRequest = CreatePostRequest;

// Response type after creating/updating/deleting a post
export interface PostResponse {
  post_id: string;
  title: string;
  content: string;
}
