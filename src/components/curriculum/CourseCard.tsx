import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Bookmark, ArrowRight } from "lucide-react";
import type { CourseItem } from "../../data/coursesData";

interface CourseCardProps {
  course: CourseItem;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getDifficultyBadge = (diff: CourseItem["difficulty"]) => {
    switch (diff) {
      case "Beginner":
      case "Easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="group bg-card text-card-foreground rounded-2xl border border-border/70 hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {!imgError ? (
          <img
            src={course.image}
            alt={course.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary flex items-center justify-center text-4xl">
            {course.icon}
          </div>
        )}

        {/* Top Badges / Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Left: Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
            <span>{course.icon}</span>
            <span>{course.problemCount}</span>
          </span>
        </div>

        {/* Top Right: Bookmark Button */}
        <button
          type="button"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark course"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 border ${
            isBookmarked
              ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
              : "bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border-white/20 hover:scale-105"
          }`}
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>

        {/* Bottom Left over image: Track Label */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-white/90">
            {course.trackLabel}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating & Level Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-foreground">
              {course.rating.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({course.ratingCount > 999 ? `${(course.ratingCount / 1000).toFixed(1)}k` : course.ratingCount})
            </span>
          </div>

          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
              course.difficulty,
            )}`}
          >
            {course.difficulty}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
          <Link to={course.link} className="hover:underline">
            {course.title}
          </Link>
        </h3>

        {/* Author / Category Row */}
        <div className="flex items-center gap-2 mb-2.5 text-xs text-muted-foreground">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-5 h-5 rounded-full object-cover border border-border"
            loading="lazy"
          />
          <span className="truncate">
            By <strong className="text-foreground font-semibold">{course.instructor.name}</strong> in{" "}
            <span>{course.instructor.category}</span>
          </span>
        </div>

        {/* Course Description */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {course.description}
        </p>

        {/* Topics Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-secondary/80 text-secondary-foreground border border-border/40"
            >
              {topic}
            </span>
          ))}
          {course.topics.length > 4 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
              +{course.topics.length - 4}
            </span>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-auto pt-4 border-t border-border/60">
          <Link
            to={course.link}
            className="w-full py-2.5 px-4 rounded-xl border border-border/80 bg-secondary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-xs text-foreground"
          >
            <span>{course.linkText}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
