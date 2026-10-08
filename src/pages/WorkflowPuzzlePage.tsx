import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

interface Submission {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
}

export default function WorkflowPuzzlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to play puzzles");
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: existingSubmission } = useQuery<Submission>({
    queryKey: ["quiz-submission", "workflow-puzzle"],
    queryFn: () => api.get<Submission>(`/quizzes/workflow-puzzle/submissions/me`),
    enabled: !!user,
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: object) =>
      api.post<Submission>(`/quizzes/workflow-puzzle/submit`, payload),
    onSuccess: () => {
      toast.success("Puzzle score saved!");
      queryClient.invalidateQueries({ queryKey: ["quiz-submission", "workflow-puzzle"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-submissions-me"] });
    },
    onError: (err: any) => {
      if (err?.status === 409) {
        toast.error("You have already submitted this puzzle.");
        queryClient.invalidateQueries({ queryKey: ["quiz-submission", "workflow-puzzle"] });
      } else {
        toast.error("Failed to submit score.");
      }
    },
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "WORKFLOW_PUZZLE_SCORE") {
        const { score, total } = event.data;
        if (!existingSubmission && !submitMutation.isPending) {
          submitMutation.mutate({
            id: uuidv4(),
            answers: {},
            score: score,
            totalQuestions: total,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [existingSubmission, submitMutation]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col">
        <Button
          variant="ghost"
          className="mb-6 self-start"
          onClick={() => navigate("/quizzes")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
        </Button>

        {existingSubmission ? (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-primary">Puzzle Completed!</h2>
                <p className="text-muted-foreground text-sm">You have already submitted your score for this puzzle.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-background p-4 rounded-lg border">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Score</span>
              <span className="text-3xl font-black text-primary">
                {existingSubmission.score} <span className="text-xl text-muted-foreground">/ {existingSubmission.total_questions}</span>
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex-1 w-full rounded-xl overflow-hidden min-h-[800px] relative shadow-2xl ring-1 ring-white/5">
          <iframe
            ref={iframeRef}
            src="/course-materials/workflow_puzzle.html"
            className="absolute inset-0 w-full h-full border-none bg-transparent"
            title="Workflow Puzzle"
          />
        </div>
      </div>
    </div>
  );
}
