import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { useDebuggingProblem } from "../../hooks/useDebuggingProblem";
import type { Problem } from "../../types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

interface DebuggingWorkspaceProps {
  problem: Problem;
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
}

export default function DebuggingWorkspace({
  problem,
  onSubmit,
  isSubmitting,
}: DebuggingWorkspaceProps) {
  const {
    columns,
    rows,
    selectedCell,
    expectedValue,
    setExpectedValue,
    handleCellSelect,
    getPayload,
  } = useDebuggingProblem(problem);

  const handleSubmit = () => {
    const payload = getPayload();
    if (payload) {
      onSubmit(payload);
    }
  };

  if (!problem.debuggingData) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground p-6 text-center">
        <p>
          This debugging problem is missing its dry-run table configuration.
        </p>
      </div>
    );
  }

  const isIterationColumn = (col: string) =>
    col.toLowerCase() === "iteration" ||
    col.toLowerCase() === "step" ||
    col.toLowerCase() === "index";

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-background">
      {/* Left side: Problem Description */}
      <div className="w-full lg:w-1/3 flex flex-col border-r border-border overflow-hidden bg-card">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Search size={18} className="text-primary" />
            Liar's Log
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Spot the mathematical contradiction in the dry-run log.
          </p>
        </div>
        <div className="flex-1 overflow-auto p-6 scrollbar-custom space-y-4">
          <div>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {problem.description || "No description provided."}
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Input Format
            </h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {problem.inputFormat || "None"}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              Output Format
            </h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {problem.outputFormat || "None"}
            </p>
          </div>

          {problem.constraints && (
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Constraints
              </h3>
              <pre className="text-muted-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap bg-muted p-3 rounded-lg border border-border">
                {problem.constraints}
              </pre>
            </div>
          )}

          {problem.examples?.map((tc, i) => (
            <div key={i}>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Sample {i + 1}
              </h3>
              <div className="space-y-2">
                <div className="bg-muted border border-border rounded-lg p-3">
                  <div className="text-[10px] text-muted-foreground font-mono mb-1">
                    INPUT
                  </div>
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {tc.input}
                  </pre>
                </div>
                <div className="bg-muted border border-border rounded-lg p-3">
                  <div className="text-[10px] text-muted-foreground font-mono mb-1">
                    OUTPUT
                  </div>
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {tc.output}
                  </pre>
                </div>
                {tc.explanation && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="text-[10px] text-primary font-mono mb-1">
                      EXPLANATION
                    </div>
                    <p className="text-xs text-foreground whitespace-pre-wrap">
                      {tc.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Dry Run Table & Input */}
      <div className="w-full lg:w-2/3 flex flex-col overflow-hidden bg-muted/10 relative">
        <div className="flex-1 overflow-auto p-6 lg:p-10 flex flex-col items-center">
          <Card className="w-full max-w-4xl shadow-md border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle size={20} className="text-warning" />
                Dry-Run Log
              </CardTitle>
              <CardDescription>
                One of the values in this table is incorrect. Click on the
                incorrect cell to mark it as the imposter.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 font-semibold tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {columns.map((col) => {
                        const isIteration = isIterationColumn(col);
                        const isSelected =
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === col;
                        const cellValue = row[col];

                        return (
                          <td
                            key={col}
                            onClick={() => {
                              if (!isIteration) handleCellSelect(rowIndex, col);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                if (!isIteration)
                                  handleCellSelect(rowIndex, col);
                              }
                            }}
                            className={`px-6 py-4 whitespace-nowrap ${
                              isIteration
                                ? "font-medium text-muted-foreground bg-muted/10"
                                : "cursor-pointer font-mono"
                            } ${
                              isSelected
                                ? "bg-primary/20 text-primary-foreground ring-2 ring-primary ring-inset font-bold"
                                : !isIteration
                                  ? "hover:bg-primary/10 hover:text-primary transition-colors"
                                  : ""
                            }`}
                          >
                            {cellValue !== undefined ? String(cellValue) : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Answer Input Panel (pops up when a cell is selected) */}
          {selectedCell && (
            <div className="mt-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Card className="border-primary/50 shadow-lg shadow-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    What should the value be?
                  </CardTitle>
                  <CardDescription>
                    You marked{" "}
                    <strong className="text-foreground">
                      {selectedCell.col}
                    </strong>{" "}
                    in Row {selectedCell.row + 1} as the imposter.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Input
                    placeholder="Enter the mathematically correct value"
                    value={expectedValue}
                    onChange={(e) => setExpectedValue(e.target.value)}
                    className="font-mono text-lg py-6"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && expectedValue.trim() !== "") {
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    className="w-full py-6 text-base font-semibold"
                    size="lg"
                    disabled={expectedValue.trim() === "" || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      "Checking..."
                    ) : (
                      <>
                        <CheckCircle2 size={18} className="mr-2" /> Submit
                        Answer
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
