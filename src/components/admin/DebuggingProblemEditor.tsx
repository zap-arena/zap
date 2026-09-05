import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Problem } from "../../types";

type DebuggingData = NonNullable<Problem["debuggingData"]>;

interface Props {
  value: DebuggingData | null;
  onChange: (value: DebuggingData) => void;
}

export default function DebuggingProblemEditor({ value, onChange }: Props) {
  const defaultData: DebuggingData = {
    columns: ["Iteration", "Variable A"],
    rows: [{ Iteration: 1, "Variable A": 0 }],
    bug_row: -1,
    bug_column: "",
    expected_value: "",
  };

  const data = value || defaultData;

  const [newColumnName, setNewColumnName] = useState("");

  const handleAddColumn = () => {
    if (!newColumnName.trim() || data.columns.includes(newColumnName.trim()))
      return;
    const colName = newColumnName.trim();
    onChange({
      ...data,
      columns: [...data.columns, colName],
      rows: data.rows.map((row) => ({ ...row, [colName]: "" })),
    });
    setNewColumnName("");
  };

  const handleRemoveColumn = (colToRemove: string) => {
    if (colToRemove.toLowerCase() === "iteration") return;
    const newColumns = data.columns.filter((c) => c !== colToRemove);
    const newRows = data.rows.map((row) => {
      const newRow = { ...row };
      delete newRow[colToRemove];
      return newRow;
    });
    onChange({
      ...data,
      columns: newColumns,
      rows: newRows,
      bug_column: data.bug_column === colToRemove ? "" : data.bug_column,
    });
  };

  const handleAddRow = () => {
    const newRow: Record<string, string | number> = {};
    data.columns.forEach((col) => {
      newRow[col] =
        col.toLowerCase() === "iteration" ? data.rows.length + 1 : "";
    });
    onChange({
      ...data,
      rows: [...data.rows, newRow],
    });
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...data.rows];
    newRows.splice(index, 1);
    // update iteration counts
    newRows.forEach((r, i) => {
      if (r.Iteration !== undefined) {
        r.Iteration = i + 1;
      }
    });
    onChange({
      ...data,
      rows: newRows,
      bug_row:
        data.bug_row === index
          ? -1
          : data.bug_row > index
            ? data.bug_row - 1
            : data.bug_row,
    });
  };

  const handleCellChange = (rowIndex: number, col: string, val: string) => {
    const newRows = [...data.rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [col]: val };
    onChange({
      ...data,
      rows: newRows,
    });
  };

  const handleSelectBug = (rowIndex: number, col: string) => {
    if (col.toLowerCase() === "iteration") return;
    onChange({
      ...data,
      bug_row: rowIndex,
      bug_column: col,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <Label>Add Column</Label>
          <div className="flex gap-2">
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="e.g. sum, count, i"
              onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
            />
            <Button onClick={handleAddColumn} type="button" variant="secondary">
              <Plus size={16} className="mr-2" /> Add
            </Button>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 w-10"></th>
              {data.columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 whitespace-nowrap font-medium"
                >
                  <div className="flex items-center justify-between gap-2">
                    {col}
                    {col.toLowerCase() !== "iteration" && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(col)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="border-t border-border">
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(rowIndex)}
                    className="text-muted-foreground hover:text-destructive p-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
                {data.columns.map((col) => {
                  const isBug =
                    data.bug_row === rowIndex && data.bug_column === col;
                  const isIteration = col.toLowerCase() === "iteration";

                  return (
                    <td
                      key={col}
                      className={`px-2 py-2 ${isBug ? "bg-primary/20 ring-1 ring-primary inset-0" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {isIteration ? (
                          <span className="px-3 font-mono">{row[col]}</span>
                        ) : (
                          <Input
                            value={row[col]}
                            onChange={(e) =>
                              handleCellChange(rowIndex, col, e.target.value)
                            }
                            className="font-mono h-8"
                          />
                        )}
                        {!isIteration && (
                          <button
                            type="button"
                            onClick={() => handleSelectBug(rowIndex, col)}
                            className={`p-1.5 rounded ${isBug ? "text-primary bg-background" : "text-muted-foreground hover:text-primary hover:bg-muted"}`}
                            title="Mark as Imposter"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        onClick={handleAddRow}
        type="button"
        variant="outline"
        className="w-full"
      >
        <Plus size={16} className="mr-2" /> Add Row
      </Button>

      {data.bug_row !== -1 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-primary flex items-center gap-2">
              <CheckCircle2 size={18} /> Bug Configured
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              You marked <strong>{data.bug_column}</strong> in row{" "}
              <strong>{data.bug_row + 1}</strong> as the imposter.
            </p>
            <div className="space-y-2">
              <Label>Expected (Correct) Value</Label>
              <Input
                value={data.expected_value}
                onChange={(e) =>
                  onChange({ ...data, expected_value: e.target.value })
                }
                placeholder="What should the mathematical value be?"
                className="max-w-xs font-mono"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
