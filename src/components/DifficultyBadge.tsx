import type { Difficulty } from "../types";

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  const cls =
    difficulty === "Easy"
      ? "diff-easy"
      : difficulty === "Medium"
        ? "diff-medium"
        : "diff-hard";
  return (
    <span className={`text-xs font-semibold font-mono ${cls}`}>
      {difficulty}
    </span>
  );
}
