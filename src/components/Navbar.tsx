import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Home, LayoutDashboard, LogIn, LogOut, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">CareerPath AI</span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>

            {user && (
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            )}

            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full glass animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs truncate max-w-[120px]">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
