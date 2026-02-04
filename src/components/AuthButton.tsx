import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, LogIn, LayoutDashboard } from "lucide-react";

const AuthButton = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full glass animate-pulse" />
    );
  }

  if (user) {
    return (
      <Button
        variant="glass"
        size="sm"
        onClick={() => navigate("/dashboard")}
        className="gap-2"
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Button>
    );
  }

  return (
    <Button
      variant="glass"
      size="sm"
      onClick={() => navigate("/auth")}
      className="gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
};

export default AuthButton;
