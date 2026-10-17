import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import AlgoReelsTray from "../components/reels/AlgoReelsTray";
import CourseCard from "../components/curriculum/CourseCard";
import { COURSES_DATA } from "../data/coursesData";
import { Search, Sparkles, BookOpen, Filter } from "lucide-react";

export default function CurriculumDSAPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      // Tab filter
      if (activeTab !== "all" && course.track !== activeTab) {
        return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty !== "all" &&
        course.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.description.toLowerCase().includes(query);
        const matchesTopic = course.topics.some((t) =>
          t.toLowerCase().includes(query),
        );
        return matchesTitle || matchesDesc || matchesTopic;
      }

      return true;
    });
  }, [activeTab, selectedDifficulty, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: COURSES_DATA.length,
      dsa: COURSES_DATA.filter((c) => c.track === "dsa").length,
      cs: COURSES_DATA.filter((c) => c.track === "cs").length,
      ai: COURSES_DATA.filter((c) => c.track === "ai").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Interactive Curriculum & Visualizers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 max-w-3xl mx-auto leading-tight">
            Master Data Structures, Algorithms & Systems
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Hands-on problem walkthroughs, step-by-step state animations, and
            structured patterns in Java and Python designed for maximum interview
            retention.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                19
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                Core Tracks & Guides
              </span>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
                120+
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                Solved Code Examples
              </span>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
                Interactive
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                State Visualizers
              </span>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-500">
                Java / Py
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-0.5">
                Dual Implementations
              </span>
            </div>
          </div>
        </section>

        {/* AlgoReels Micro-Learning Tray */}
        <div className="mb-12">
          <AlgoReelsTray />
        </div>

        {/* Courses Catalog Section */}
        <section id="modules" className="pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Explore Learning Tracks
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Browse our structured guides with real-time algorithm visualizers and deep dives.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics (e.g. sliding window, tree, sql)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar: Track Tabs & Level Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-border/70">
            {/* Track Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                All Courses ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dsa")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  activeTab === "dsa"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                Algorithms & DSA ({counts.dsa})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cs")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  activeTab === "cs"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                CS & Systems ({counts.cs})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  activeTab === "ai"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                AI & Modern Tech ({counts.ai})
              </button>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="text-xs font-medium py-1.5 px-3 rounded-lg bg-card border border-border text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy / Beginner</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard / Advanced</option>
              </select>
            </div>
          </div>

          {/* Courses Grid - 3 Column Layout Matching the Design */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/50">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No courses found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't find any guides matching "{searchQuery}". Try a different keyword or reset filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                  setSelectedDifficulty("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
