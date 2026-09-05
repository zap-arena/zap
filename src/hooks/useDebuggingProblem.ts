import { useState, useCallback } from "react";
import type { Problem } from "../types";

export interface DebuggingSubmissionPayload {
  index: number;
  expected_value: string;
}

export function useDebuggingProblem(problem: Problem | undefined) {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: string;
  } | null>(null);
  const [expectedValue, setExpectedValue] = useState("");

  const reset = useCallback(() => {
    setSelectedCell(null);
    setExpectedValue("");
  }, []);

  const handleCellSelect = useCallback((row: number, col: string) => {
    setSelectedCell({ row, col });
    setExpectedValue(""); // Reset expected value when a new cell is selected
  }, []);

  const getPayload = useCallback((): string | null => {
    if (!selectedCell || expectedValue.trim() === "") return null;
    return JSON.stringify({
      index: selectedCell.row,
      expected_value: expectedValue.trim(),
    });
  }, [selectedCell, expectedValue]);

  return {
    selectedCell,
    expectedValue,
    setExpectedValue,
    handleCellSelect,
    getPayload,
    reset,
    columns: problem?.debuggingData?.columns || [],
    rows: problem?.debuggingData?.rows || [],
  };
}
