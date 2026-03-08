import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <p className="mb-2 text-xs font-mono tracking-widest text-muted-foreground">NAVIGATION ERROR</p>
        <h1 className="mb-3 text-5xl font-mono font-bold text-foreground">404</h1>
        <p className="mb-5 text-sm text-muted-foreground">The page you requested does not exist.</p>
        <Link
          to="/scheduling"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-mono font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Return to Simulator
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
