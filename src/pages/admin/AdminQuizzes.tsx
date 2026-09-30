import React, { useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function AdminQuizzes() {
  const queryClient = useQueryClient();
  const { data: quizzes = [] } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => api.get<any[]>("/quizzes"),
  });

  const createQuiz = useMutation({
    mutationFn: (quiz: any) => api.post("/quizzes", quiz),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
    onError: () => toast.error("Failed to save quiz to database."),
  });

  const deleteQuiz = useMutation({
    mutationFn: (id: string) => api.delete(`/quizzes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz deleted.");
    },
    onError: () => toast.error("Failed to delete quiz."),
  });

  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        const processQuiz = (qData: any) => {
          if (
            !qData.title ||
            !qData.questions ||
            !Array.isArray(qData.questions)
          ) {
            throw new Error("Invalid format");
          }
          const newQuiz = {
            id: uuidv4(),
            title: qData.title,
            description: qData.description || "",
            status: "active" as const,
            createdAt: new Date().toISOString(),
            questions: qData.questions.map((q: any) => ({
              id: uuidv4(),
              text: q.text || q.q,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex ?? q.correct,
              explanation: q.explanation ?? q.explain,
            })),
          };
          createQuiz.mutate(newQuiz);
        };

        if (Array.isArray(json)) {
          let completed = 0;
          json.forEach((item: any) => {
            try {
              processQuiz(item);
              completed++;
            } catch {
              // skip invalid entries
            }
          });
          toast.success(`${completed} quiz${completed !== 1 ? "es" : ""} queued for import`);
        } else {
          processQuiz(json);
          toast.success("Quiz queued for import");
        }
      } catch (err) {
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            Manage daily quizzes and assessments
          </p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border bg-card"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Import Quiz via JSON</h3>
        <p className="text-muted-foreground mb-6">
          Drag and drop a JSON file, or click to browse
        </p>
        <label className="cursor-pointer">
          <Button asChild>
            <span>
              <Plus className="w-4 h-4 mr-2" /> Select File
            </span>
          </Button>
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <div className="grid gap-4">
        {quizzes.length === 0 ? (
          <div className="text-center p-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">
              No quizzes found. Upload a JSON file to get started.
            </p>
          </div>
        ) : (
          quizzes.map((quiz: any) => (
            <div
              key={quiz.id}
              className="bg-card p-6 rounded-xl border border-border flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
                <div className="text-xs font-medium text-primary mt-2">
                  {quiz.questions.length} questions • Created{" "}
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteQuiz.mutate(quiz.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
