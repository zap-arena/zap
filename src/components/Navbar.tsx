import { ThunderLogo } from "./ThunderLogo";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import ThemeColorPicker from "./ThemeColorPicker";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`h-20 flex items-center px-6 lg:px-10 gap-6 sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link
        to="/"
        className="flex items-center gap-1 font-black text-2xl tracking-tight shrink-0"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="text-teal-600 dark:text-teal-400">Z</span>
        <ThunderLogo className="w-6 h-6 text-amber-400 animate-pulse" />
        <span className="text-blue-700 dark:text-blue-400">P</span>
      </Link>

      <div className="flex-1 flex items-center justify-center gap-8">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </Link>
        <Link
          to="/curriculum/dsa"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Courses
        </Link>
        <Link
          to="/contests"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Contests
        </Link>
        <Link
          to="/quizzes"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Quizzes
        </Link>
        <Link
          to="/codewar"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          CodeWar
          <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
            NEW
          </span>
        </Link>
      </div>

      <ThemeColorPicker />
      <ThemeToggle />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0]?.toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block font-medium text-sm">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-card border-border"
          >
            {user.role === "admin" && (
              <DropdownMenuItem
                onClick={() => navigate("/admin")}
                className="gap-2 cursor-pointer"
              >
                <LayoutDashboard size={14} /> Admin Dashboard
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="gap-2 cursor-pointer"
            >
              <User size={14} /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-destructive cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="rounded-full px-6 font-bold bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 border-0 hover:opacity-90"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
}
