import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth-provider";
import SectionWrapper from "../components/section-wrapper";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authState.isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <SectionWrapper>
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm border border-dashed rounded-lg p-8 bg-card">
          <h2 className="text-2xl font-mono text-foreground text-center mb-2">
            Admin Login
          </h2>
          <p className="text-muted-foreground font-mono text-sm text-center mb-8">
            Sign in to manage your blog
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-sm text-muted-foreground mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-mono text-sm text-muted-foreground mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-destructive font-mono text-sm text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full font-mono"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default LoginPage;
