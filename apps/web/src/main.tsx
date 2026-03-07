import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./contexts/theme-provider.tsx";
import Navbar from "./components/navbar.tsx";
import Footer from "./components/footer.tsx";
import HomePage from "./pages/home.tsx";
import ContactPage from "./pages/contact.tsx";
import NotFoundPage from "./pages/not-found.tsx";
import BlogPage from "./pages/blog.tsx";
import BlogPostPage from "./pages/blog-post.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </main>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
