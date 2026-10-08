import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import ThemeColorPicker from "./ThemeColorPicker";
import ThemeToggle from "./ThemeToggle";
import { ThunderLogo } from "./ThunderLogo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/curriculum/dsa", label: "Courses" },
  { to: "/contests", label: "Contests" },
  { to: "/quizzes", label: "Quizzes" },
  { to: "/codewar", label: "CodeWar", badge: "NEW" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      className={`h-16 md:h-20 flex items-center px-4 sm:px-6 lg:px-10 gap-3 sm:gap-6 sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link
        to="/"
        className="flex items-center gap-1 font-black text-xl sm:text-2xl tracking-tight shrink-0"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="text-teal-600 dark:text-teal-400">Z</span>
        <ThunderLogo className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />
        <span className="text-blue-700 dark:text-blue-400">P</span>
      </Link>

      <div className="hidden md:flex flex-1 items-center justify-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            {link.label}
            {link.badge && (
              <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="hidden md:block flex-1" />

      <div className="hidden md:flex items-center gap-3">
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
      </div>

      {/* Mobile: hamburger + slide-out menu */}
      <div className="flex md:hidden items-center gap-2 ml-auto">
        {user && (
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {user.name
                .split(" ")
                .map((n) => n[0]?.toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] bg-card border-border flex flex-col gap-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-1 mt-8">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </SheetClose>
              ))}
            </div>

            <div className="flex items-center justify-between px-3">
              <ThemeColorPicker />
              <ThemeToggle />
            </div>

            <div className="flex flex-col gap-2 px-3">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="justify-start gap-2"
                        onClick={() => navigate("/admin")}
                      >
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Button>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => navigate("/profile")}
                    >
                      <User size={14} /> Profile
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="justify-start gap-2 text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} /> Logout
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="justify-start text-muted-foreground"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      className="justify-start rounded-full font-bold bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 border-0 hover:opacity-90"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
