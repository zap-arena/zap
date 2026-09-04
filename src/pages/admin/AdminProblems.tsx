import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Plus as PlusIcon,
  Trash,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';
import { Switch } from '../../components/ui/switch';
import DifficultyBadge from '../../components/DifficultyBadge';
import { api, ApiError } from '../../lib/api';
import type {
  Problem,
  Contest,
  Difficulty,
  Language,
  TestCase,
} from '../../types';
import { toast } from 'sonner';

// ── ZIP Import ────────────────────────────────────────────────────────────────
type ZipParseState =
  | 'idle'
  | 'parsing'
  | 'preview'
  | 'importing'
  | 'done'
  | 'error';

interface ParsedProblem {
  slug: string;
  title: string;
  difficulty: Difficulty;
  timeLimit: number;
  memoryLimit: number;
  languages: Language[];
  tags: string[];
  testCasesCount: number;
  boilerplatesCount: number;
  valid: boolean;
  errors: string[];
}

interface ImportResponse {
  problems: ParsedProblem[];
  imported: number;
  dryRun: boolean;
}

function BulkImportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [state, setState] = useState<ZipParseState>('idle');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedProblem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const parseZip = async (f: File) => {
    setFileName(f.name);
    setFile(f);
    setState('parsing');
    const form = new FormData();
    form.append('file', f);
    form.append('dry_run', 'true');
    try {
      const res = await api.upload<ImportResponse>(
        '/admin/problems/import-zip',
        form,
      );
      setParsed(res.problems);
      setSelected(
        new Set(
          res.problems.map((p, i) => (p.valid ? i : -1)).filter((i) => i >= 0),
        ),
      );
      setState('preview');
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : 'Could not read the ZIP file',
      );
      setState('error');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith('.zip')) parseZip(f);
    else toast.error('Please upload a .zip file');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) parseZip(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setState('importing');
    const form = new FormData();
    form.append('file', file);
    form.append('dry_run', 'false');
    form.append('slugs', [...selected].map((i) => parsed[i].slug).join(','));
    try {
      const res = await api.upload<ImportResponse>(
        '/admin/problems/import-zip',
        form,
      );
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      setState('done');
      toast.success(`${res.imported} problem(s) imported successfully!`);
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Import failed');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setFileName('');
    setFile(null);
    setParsed([]);
    setSelected(new Set());
    setErrorMessage('');
    onClose();
  };

  const toggleSelect = (i: number) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive size={16} className="text-primary" /> Bulk Import Problems
            (ZIP)
          </DialogTitle>
        </DialogHeader>

        {/* IDLE — drop zone */}
        {state === 'idle' && (
          <div className="space-y-4 py-2">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Archive
                size={36}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-sm font-medium mb-1">
                Drop your ZIP file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Must contain folders, each with problem.json + statement.md +
                boilerplate/ + testcases/
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-4 pointer-events-none"
              >
                Browse ZIP
              </Button>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Expected ZIP Structure
              </p>
              <pre className="text-xs font-mono text-foreground whitespace-pre leading-relaxed">{`problems.zip/
├── two-sum/
│   ├── problem.json
│   ├── statement.md
│   ├── boilerplate/
│   │   ├── cpp.cpp
│   │   └── python.py
│   └── testcases/
│       ├── tc1.json   ← { "input": "...", "expected_output": "...", "hidden": false }
│       └── tc2.json
└── another-problem/
    └── ...`}</pre>
            </div>
          </div>
        )}

        {/* PARSING */}
        {state === 'parsing' && (
          <div className="py-16 text-center space-y-4">
            <Loader2 size={36} className="text-primary animate-spin mx-auto" />
            <p className="font-medium">
              Parsing <span className="text-primary font-mono">{fileName}</span>
              …
            </p>
            <p className="text-sm text-muted-foreground">
              Validating structure, test cases, and boilerplates
            </p>
          </div>
        )}

        {/* PREVIEW */}
        {state === 'preview' && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Found{' '}
                <span className="text-primary font-bold">{parsed.length}</span>{' '}
                problems —{' '}
                <span className="text-success">
                  {parsed.filter((p) => p.valid).length} valid
                </span>
                ,{' '}
                <span className="text-destructive">
                  {parsed.filter((p) => !p.valid).length} invalid
                </span>
              </p>
              <button
                onClick={() =>
                  setSelected(
                    new Set(
                      parsed
                        .map((p, i) => (p.valid ? i : -1))
                        .filter((i) => i >= 0),
                    ),
                  )
                }
                className="text-xs text-primary hover:underline"
              >
                Select all valid
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {parsed.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 transition-colors ${
                    !p.valid
                      ? 'border-destructive/30 bg-destructive/5 opacity-70'
                      : selected.has(i)
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {p.valid ? (
                      <Checkbox
                        checked={selected.has(i)}
                        onCheckedChange={() => toggleSelect(i)}
                        className="mt-0.5 border-border"
                      />
                    ) : (
                      <XCircle
                        size={16}
                        className="text-destructive shrink-0 mt-0.5"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-sm">{p.title}</span>
                        <span
                          className={`text-[10px] font-semibold font-mono ${
                            p.difficulty === 'Easy'
                              ? 'text-success'
                              : p.difficulty === 'Medium'
                                ? 'text-warning'
                                : 'text-destructive'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                      {p.valid ? (
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                          <span>⏱ {p.timeLimit}s</span>
                          <span>💾 {p.memoryLimit}MB</span>
                          <span>🧪 {p.testCasesCount} tests</span>
                          <span>📝 {p.boilerplatesCount} boilerplates</span>
                          <span className="font-mono">
                            {p.languages.join(', ')}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5 mt-1">
                          {p.errors.map((err) => (
                            <p
                              key={err}
                              className="text-[11px] text-destructive flex items-center gap-1"
                            >
                              <AlertCircle size={10} /> {err}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.valid &&
                      (selected.has(i) ? (
                        <CheckCircle
                          size={14}
                          className="text-primary shrink-0 mt-0.5"
                        />
                      ) : (
                        <div className="w-3.5 h-3.5" />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border text-sm">
              <span className="text-muted-foreground">
                {selected.size} problem(s) selected for import
              </span>
              <span className="text-primary font-medium">
                {[...selected].reduce(
                  (sum, i) => sum + parsed[i].testCasesCount,
                  0,
                )}{' '}
                test cases
              </span>
            </div>
          </div>
        )}

        {/* IMPORTING */}
        {state === 'importing' && (
          <div className="py-16 text-center space-y-4">
            <Loader2 size={36} className="text-primary animate-spin mx-auto" />
            <p className="font-medium">Importing {selected.size} problem(s)…</p>
            <p className="text-sm text-muted-foreground">
              Saving to database, linking test cases and boilerplates
            </p>
          </div>
        )}

        {/* DONE */}
        {state === 'done' && (
          <div className="py-16 text-center space-y-4">
            <CheckCircle size={44} className="text-success mx-auto" />
            <p className="text-xl font-bold">
              {selected.size} Problems Imported!
            </p>
            <p className="text-sm text-muted-foreground">
              All problems are now available in the problem bank.
            </p>
          </div>
        )}

        {/* ERROR */}
        {state === 'error' && (
          <div className="py-16 text-center space-y-4">
            <XCircle size={44} className="text-destructive mx-auto" />
            <p className="text-xl font-bold">Import failed</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={reset}>
            {state === 'done' ? 'Close' : 'Cancel'}
          </Button>
          {state === 'preview' && (
            <Button
              className="btn-primary"
              onClick={handleImport}
              disabled={selected.size === 0}
            >
              Import {selected.size} Problem{selected.size !== 1 ? 's' : ''}
            </Button>
          )}
          {state === 'done' && (
            <Button className="btn-primary" onClick={reset}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Test Case Row ─────────────────────────────────────────────────────────────
function TestCaseRow({
  tc,
  index,
  expanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}: {
  tc: TestCase & { _new?: boolean };
  index: number;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof TestCase,
    val: string | number | boolean,
  ) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-colors ${tc.hidden ? 'border-warning/25 bg-warning/5' : 'border-border bg-card'}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          onClick={() => onToggleExpand(tc.id)}
          className="text-muted-foreground hover:text-foreground"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <span className="text-xs font-mono text-muted-foreground w-6">
          {index + 1}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            tc.hidden
              ? 'bg-warning/15 text-warning'
              : 'bg-success/15 text-success'
          }`}
        >
          {tc.hidden ? '🔒 Hidden' : '👁 Sample'}
        </span>
        {/* Marks badge */}
        <div className="flex items-center gap-1 bg-muted border border-border rounded-lg px-2 py-0.5">
          <span className="text-[10px] text-muted-foreground font-mono">
            pts
          </span>
          {tc.hidden ? (
            <input
              type="number"
              min={0}
              value={tc.marks}
              onChange={(e) => onUpdate(tc.id, 'marks', Number(e.target.value))}
              className="w-10 bg-transparent text-xs font-mono font-bold text-primary outline-none text-center"
              title="Marks for this test case"
            />
          ) : (
            <span className="text-xs font-mono text-muted-foreground w-10 text-center">
              0
            </span>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">
              {tc.hidden ? 'Hidden' : 'Public'}
            </span>
            <Switch
              checked={tc.hidden}
              onCheckedChange={(v) => {
                onUpdate(tc.id, 'hidden', v);
                if (!v) onUpdate(tc.id, 'marks', 0);
              }}
              className="scale-75"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(tc.id)}
          >
            <Trash size={12} />
          </Button>
        </div>
      </div>

      {/* Expanded edit area */}
      {expanded && (
        <div className="px-3 pb-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Input</Label>
            <Textarea
              value={tc.input}
              onChange={(e) => onUpdate(tc.id, 'input', e.target.value)}
              className="bg-muted border-border resize-none font-mono text-xs"
              rows={4}
              placeholder="Test case input…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Expected Output
            </Label>
            <Textarea
              value={tc.expectedOutput}
              onChange={(e) =>
                onUpdate(tc.id, 'expectedOutput', e.target.value)
              }
              className="bg-muted border-border resize-none font-mono text-xs"
              rows={4}
              placeholder="Expected output…"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Edit Problem Dialog ───────────────────────────────────────────────────────
function EditProblemDialog({
  problem,
  open,
  onClose,
  onSaved,
}: {
  problem: Problem;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [details, setDetails] = useState({
    title: problem.title,
    difficulty: problem.difficulty,
    description: problem.description,
    inputFormat: problem.inputFormat,
    outputFormat: problem.outputFormat,
    constraints: problem.constraints,
    tags: problem.tags.join(', '),
    timeLimit: String(problem.timeLimit),
    memoryLimit: String(problem.memoryLimit),
    maxScore: String(problem.maxScore),
    languages: [...problem.languages],
  });

  const [testCases, setTestCases] = useState<(TestCase & { _new?: boolean })[]>(
    problem.testCases.map((tc) => ({ ...tc })),
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [boilerplates, setBoilerplates] = useState<Record<string, string>>({
    ...problem.boilerplates,
  });

  const [activeBoilerLang, setActiveBoilerLang] = useState<Language>(
    problem.languages[0] || 'cpp',
  );
  const [saving, setSaving] = useState(false);

  const updateDetail =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDetails((d) => ({ ...d, [k]: e.target.value }));

  const toggleLang = (lang: Language) => {
    setDetails((d) => ({
      ...d,
      languages: d.languages.includes(lang)
        ? d.languages.filter((l) => l !== lang)
        : [...d.languages, lang],
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const expandAll = () => setExpandedIds(new Set(testCases.map((tc) => tc.id)));
  const collapseAll = () => setExpandedIds(new Set());

  const addTestCase = () => {
    const newTc: TestCase & { _new?: boolean } = {
      id: `tc_new_${Date.now()}`,
      input: '',
      expectedOutput: '',
      hidden: false,
      marks: 0,
      _new: true,
    };
    setTestCases((tcs) => [...tcs, newTc]);
    setExpandedIds((s) => new Set([...s, newTc.id]));
  };

  const updateTestCase = (
    id: string,
    field: keyof TestCase,
    val: string | number | boolean,
  ) => {
    setTestCases((tcs) =>
      tcs.map((tc) => (tc.id === id ? { ...tc, [field]: val } : tc)),
    );
  };

  const deleteTestCase = (id: string) => {
    setTestCases((tcs) => tcs.filter((tc) => tc.id !== id));
    toast.info('Test case removed');
  };

  const handleSave = async () => {
    if (!details.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (testCases.length === 0) {
      toast.error('At least one test case required');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/admin/problems/${problem.id}`, {
        title: details.title,
        difficulty: details.difficulty,
        description: details.description,
        inputFormat: details.inputFormat,
        outputFormat: details.outputFormat,
        constraints: details.constraints,
        examples: problem.examples,
        tags: details.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        languages: details.languages,
        boilerplates,
        testCases: testCases.map((tc) => ({
          name: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          hidden: tc.hidden,
          marks: tc.marks,
        })),
        timeLimit: Number(details.timeLimit),
        memoryLimit: Number(details.memoryLimit),
        maxScore: Number(details.maxScore),
        status: problem.status,
      });
      toast.success(`"${details.title}" saved!`);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Failed to save problem',
      );
    } finally {
      setSaving(false);
    }
  };

  const publicCount = testCases.filter((t) => !t.hidden).length;
  const hiddenCount = testCases.filter((t) => t.hidden).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit size={16} className="text-primary" /> Edit Problem
            <span className="ml-auto text-xs text-muted-foreground font-normal font-mono">
              {problem.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <TabsList className="bg-muted shrink-0">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="testcases">
              Test Cases
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {testCases.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="boilerplate">Boilerplate</TabsTrigger>
          </TabsList>

          {/* ── Details tab ── */}
          <TabsContent
            value="details"
            className="flex-1 overflow-y-auto mt-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Title</Label>
                <Input
                  value={details.title}
                  onChange={updateDetail('title')}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={details.difficulty}
                  onValueChange={(v: Difficulty) =>
                    setDetails((d) => ({ ...d, difficulty: v }))
                  }
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={details.tags}
                  onChange={updateDetail('tags')}
                  placeholder="array, dp"
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Time Limit (s)</Label>
                <Input
                  type="number"
                  value={details.timeLimit}
                  onChange={updateDetail('timeLimit')}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Memory Limit (MB)</Label>
                <Input
                  type="number"
                  value={details.memoryLimit}
                  onChange={updateDetail('memoryLimit')}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Score</Label>
                <Input
                  type="number"
                  value={details.maxScore}
                  onChange={updateDetail('maxScore')}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Supported Languages</Label>
                <div className="flex gap-2 flex-wrap pt-1">
                  {(['c', 'cpp', 'java', 'python'] as Language[]).map(
                    (lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <Checkbox
                          checked={details.languages.includes(lang)}
                          onCheckedChange={() => toggleLang(lang)}
                          className="border-border"
                        />
                        <span className="text-xs font-mono uppercase">
                          {lang}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={details.description}
                  onChange={updateDetail('description')}
                  className="bg-muted border-border resize-none"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Input Format</Label>
                <Textarea
                  value={details.inputFormat}
                  onChange={updateDetail('inputFormat')}
                  className="bg-muted border-border resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Textarea
                  value={details.outputFormat}
                  onChange={updateDetail('outputFormat')}
                  className="bg-muted border-border resize-none"
                  rows={3}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Constraints</Label>
                <Textarea
                  value={details.constraints}
                  onChange={updateDetail('constraints')}
                  className="bg-muted border-border resize-none font-mono text-xs"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Test Cases tab ── */}
          <TabsContent
            value="testcases"
            className="flex-1 overflow-y-auto mt-4 space-y-3"
          >
            {/* Summary bar */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-success">
                  <Eye size={12} /> {publicCount} sample
                </span>
                <span className="flex items-center gap-1.5 text-warning">
                  <Lock size={12} /> {hiddenCount} hidden
                </span>
                <span className="text-primary font-mono font-semibold">
                  {testCases.reduce((s, tc) => s + (tc.marks || 0), 0)} pts
                  total
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs gap-1"
                onClick={addTestCase}
              >
                <PlusIcon size={12} /> Add Test Case
              </Button>
            </div>

            {/* Quick actions row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <button
                onClick={expandAll}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <ChevronDown size={11} /> Expand all
              </button>
              <span>·</span>
              <button
                onClick={collapseAll}
                className="hover:underline flex items-center gap-1"
              >
                <ChevronUp size={11} /> Collapse all
              </button>
              <span>·</span>
              <button
                onClick={() =>
                  setTestCases((tcs) =>
                    tcs.map((tc) => ({ ...tc, hidden: false, marks: 0 })),
                  )
                }
                className="text-success hover:underline"
              >
                Mark all sample
              </button>
              <span>·</span>
              <button
                onClick={() =>
                  setTestCases((tcs) =>
                    tcs.map((tc) => ({
                      ...tc,
                      hidden: true,
                      marks: tc.marks || 10,
                    })),
                  )
                }
                className="text-warning hover:underline"
              >
                Mark all hidden
              </button>
            </div>

            {/* Test case list */}
            <div className="space-y-2">
              {testCases.map((tc, i) => (
                <TestCaseRow
                  key={tc.id}
                  tc={tc}
                  index={i}
                  expanded={expandedIds.has(tc.id)}
                  onToggleExpand={toggleExpand}
                  onUpdate={updateTestCase}
                  onDelete={deleteTestCase}
                />
              ))}
            </div>

            {testCases.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No test cases. Add at least one.</p>
              </div>
            )}
          </TabsContent>

          {/* ── Boilerplate tab ── */}
          <TabsContent
            value="boilerplate"
            className="flex-1 overflow-y-auto mt-4 space-y-3"
          >
            <div className="flex gap-2 flex-wrap">
              {details.languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveBoilerLang(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase transition-colors ${
                    activeBoilerLang === lang
                      ? 'bg-primary/15 border border-primary/30 text-primary'
                      : 'bg-muted border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {details.languages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No languages selected. Go to Details tab to enable languages.
              </p>
            )}
            {details.languages.includes(activeBoilerLang) && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  {activeBoilerLang.toUpperCase()} Boilerplate
                </Label>
                <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                  <div className="h-6 bg-muted border-b border-border flex items-center px-3">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {activeBoilerLang}.
                      {activeBoilerLang === 'python'
                        ? 'py'
                        : activeBoilerLang === 'java'
                          ? 'java'
                          : activeBoilerLang === 'cpp'
                            ? 'cpp'
                            : 'c'}
                    </span>
                  </div>
                  <textarea
                    value={boilerplates[activeBoilerLang] || ''}
                    onChange={(e) =>
                      setBoilerplates((b) => ({
                        ...b,
                        [activeBoilerLang]: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent text-foreground font-mono text-xs p-4 outline-none resize-none"
                    rows={14}
                    spellCheck={false}
                  />
                </div>
                <button
                  onClick={() =>
                    setBoilerplates((b) => ({ ...b, [activeBoilerLang]: '' }))
                  }
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ↺ Clear boilerplate
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="shrink-0 border-t border-border pt-4 mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProblems() {
  const queryClient = useQueryClient();
  const { data: problems = [] } = useQuery({
    queryKey: ['admin-problems'],
    queryFn: () => api.get<Problem[]>('/admin/problems'),
  });
  const { data: contests = [] } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: () => api.get<Contest[]>('/admin/contests'),
  });

  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<string>('all');
  const [filterContest, setFilterContest] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [deletingProblem, setDeletingProblem] = useState<Problem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    difficulty: 'Easy' as Difficulty,
    description: '',
    timeLimit: '2',
    memoryLimit: '256',
    tags: '',
  });

  const invalidateProblems = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-problems'] });

  // Contest filter: which contests use each problem
  const problemInContest = (problemId: string, contestId: string) =>
    contests
      .find((c) => c.id === contestId)
      ?.problems.some((cp) => cp.problemId === problemId);

  const filtered = problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()));
    const matchDiff = filterDiff === 'all' || p.difficulty === filterDiff;
    const matchContest =
      filterContest === 'all' || problemInContest(p.id, filterContest);
    return matchSearch && matchDiff && matchContest;
  });

  const handleCreate = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setCreating(true);
    try {
      await api.post('/admin/problems', {
        title: form.title,
        difficulty: form.difficulty,
        description: form.description,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        languages: ['cpp', 'python'],
        boilerplates: {},
        testCases: [],
        timeLimit: Number(form.timeLimit),
        memoryLimit: Number(form.memoryLimit),
        maxScore: 100,
        status: 'active',
      });
      toast.success(`Problem "${form.title}" created!`);
      setShowCreate(false);
      setForm({
        title: '',
        difficulty: 'Easy',
        description: '',
        timeLimit: '2',
        memoryLimit: '256',
        tags: '',
      });
      invalidateProblems();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Failed to create problem',
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProblem) return;
    try {
      await api.delete(`/admin/problems/${deletingProblem.id}`);
      toast.success(`"${deletingProblem.title}" removed`);
      setDeletingProblem(null);
      invalidateProblems();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Failed to remove problem',
      );
    }
  };

  // Contest labels for each problem
  const problemContests = (id: string) =>
    contests
      .filter((c) => c.problems.some((cp) => cp.problemId === id))
      .map((c) => c.name);

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Problems</h1>
            <p className="text-muted-foreground text-sm">
              {problems.length} problems in the bank
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(true)}
              className="gap-1.5"
            >
              <Archive size={14} /> Bulk Import ZIP
            </Button>
            <Button
              size="sm"
              className="btn-primary gap-1.5"
              onClick={() => setShowCreate(true)}
            >
              <Plus size={14} /> New Problem
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search problems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted border-border"
            />
          </div>
          <Select value={filterDiff} onValueChange={setFilterDiff}>
            <SelectTrigger className="w-32 h-9 bg-muted border-border">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterContest} onValueChange={setFilterContest}>
            <SelectTrigger className="w-48 h-9 bg-muted border-border">
              <SelectValue placeholder="Filter by contest" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Contests</SelectItem>
              {contests.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="card-glow rounded-xl overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Problem</th>
                <th className="text-center">Difficulty</th>
                <th className="text-center hidden md:table-cell">Tests</th>
                <th className="text-center hidden lg:table-cell">Contests</th>
                <th className="text-center">Score</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const contests = problemContests(p.id);
                return (
                  <tr key={p.id} className="group">
                    <td>
                      <div className="font-medium text-sm">{p.title}</div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-center">
                      <DifficultyBadge difficulty={p.difficulty} />
                    </td>
                    <td className="text-center hidden md:table-cell">
                      <div className="text-xs text-muted-foreground">
                        <span className="text-success font-medium">
                          {p.testCases.filter((tc) => !tc.hidden).length}
                        </span>
                        <span className="text-muted-foreground"> pub · </span>
                        <span className="text-warning font-medium">
                          {p.testCases.filter((tc) => tc.hidden).length}
                        </span>
                        <span className="text-muted-foreground"> hid</span>
                      </div>
                    </td>
                    <td className="text-center hidden lg:table-cell">
                      {contests.length > 0 ? (
                        <div className="flex gap-1 flex-wrap justify-center">
                          {contests.map((cn) => (
                            <span
                              key={cn}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium truncate max-w-24"
                              title={cn}
                            >
                              {cn.split(' ').slice(0, 2).join(' ')}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center text-sm font-mono font-bold text-primary">
                      {p.maxScore}
                    </td>
                    <td className="text-center">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          p.status === 'active'
                            ? 'bg-success/15 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => setEditingProblem(p)}
                          title="Edit"
                        >
                          <Edit size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingProblem(p)}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No problems match your filters.</p>
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Problem</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Two Sum"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={form.difficulty}
                    onValueChange={(v: Difficulty) =>
                      setForm((f) => ({ ...f, difficulty: v }))
                    }
                  >
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="array, hashmap"
                    value={form.tags}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tags: e.target.value }))
                    }
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Limit (s)</Label>
                  <Input
                    type="number"
                    value={form.timeLimit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, timeLimit: e.target.value }))
                    }
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Memory Limit (MB)</Label>
                  <Input
                    type="number"
                    value={form.memoryLimit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, memoryLimit: e.target.value }))
                    }
                    className="bg-muted border-border"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Problem description…"
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="bg-muted border-border resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                className="btn-primary"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  'Create Problem'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk ZIP Import Dialog */}
        <BulkImportDialog
          open={showImport}
          onClose={() => setShowImport(false)}
        />

        {/* Edit Problem Dialog */}
        {editingProblem && (
          <EditProblemDialog
            problem={editingProblem}
            open={!!editingProblem}
            onClose={() => setEditingProblem(null)}
            onSaved={invalidateProblems}
          />
        )}

        {/* Delete confirmation */}
        <AlertDialog
          open={!!deletingProblem}
          onOpenChange={(open) => !open && setDeletingProblem(null)}
        >
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Archive this problem?</AlertDialogTitle>
              <AlertDialogDescription>
                "{deletingProblem?.title}" will be archived and hidden from new
                contests. Contests already using it keep their results.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep problem</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Archive problem
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
