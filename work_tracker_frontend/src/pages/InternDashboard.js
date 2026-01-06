import React, { useMemo, useState } from "react";
import Badge, { badgeVariantFromStatus } from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import FileItem from "../components/FileItem";

/**
 * Convert a Date into YYYY-MM-DD in local time (not UTC).
 * We avoid toISOString() here to prevent timezone off-by-one issues.
 */
function toLocalIsoDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Convert a Date into HH:mm in local time.
 */
function toLocalTimeHHmm(dateObj) {
  const hh = String(dateObj.getHours()).padStart(2, "0");
  const mm = String(dateObj.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function isoToDayLabel(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDay(); // 0..6
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names[day];
}

function makeId() {
  return `sub_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

const INITIAL_SUBMISSIONS = [
  {
    id: "seed-1",
    date: "2026-01-02",
    time: "09:15",
    day: "Friday",
    description: "Set up project structure and created initial components.",
    files: [{ name: "setup-notes.pdf", type: "application/pdf", previewUrl: null }],
    status: "Review Successful",
  },
  {
    id: "seed-2",
    date: "2026-01-03",
    time: "17:40",
    day: "Saturday",
    description: "Built submission history UI and basic edit/delete interactions.",
    files: [{ name: "history-screenshot.png", type: "image/png", previewUrl: null }],
    status: "Connect Immediately",
  },
];

// PUBLIC_INTERFACE
function InternDashboard() {
  /** Intern dashboard: submission form + in-memory history (no storage). */
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [editingId, setEditingId] = useState(null);

  const editingSubmission = useMemo(
    () => submissions.find((s) => s.id === editingId) || null,
    [submissions, editingId]
  );

  // Note: date/time are system-generated at submit time; no manual inputs.
  const [day, setDay] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const resetForm = () => {
    setEditingId(null);
    setDay("");
    setDescription("");
    // Clean up preview URLs.
    files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
  };

  const loadForEdit = (submission) => {
    // Clean current previews
    files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));

    setEditingId(submission.id);
    setDay(submission.day);
    setDescription(submission.description);

    // For UI-only: do not persist blob previews; recreate only for image types.
    const reconstructed = submission.files.map((f) => ({
      name: f.name,
      type: f.type,
      previewUrl: null,
    }));
    setFiles(reconstructed);
  };

  const onFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const mapped = selected.map((f) => ({
      name: f.name,
      type: f.type,
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setFiles(mapped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Requirements: capture system date/time automatically at submit time.
    const now = new Date();
    const systemDate = toLocalIsoDate(now);
    const systemTime = toLocalTimeHHmm(now);

    const entry = {
      id: editingId || makeId(),
      date: systemDate,
      time: systemTime,
      day: day || isoToDayLabel(systemDate) || "Day",
      description: description || "(No description provided)",
      files: files.length
        ? files.map((f) => ({ name: f.name, type: f.type, previewUrl: f.previewUrl || null }))
        : [{ name: "no-file.txt", type: "text/plain", previewUrl: null }],
      // UI-only: keep existing status when editing; else set a default.
      status: editingSubmission?.status || "Connect Immediately",
    };

    setSubmissions((prev) => {
      const exists = prev.some((s) => s.id === entry.id);
      if (!exists) return [entry, ...prev];
      return prev.map((s) => (s.id === entry.id ? entry : s));
    });

    // Keep form mounted interaction: reset after submit.
    resetForm();
  };

  const handleDelete = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  // Read-only timestamp preview (matches requirement example; derived from new Date()).
  // This is for UI display only; the saved timestamp is captured at submit time.
  const nowPreview = useMemo(() => new Date(), [editingId]);
  const nowPreviewLabel = `Today, ${toLocalIsoDate(nowPreview)} ${toLocalTimeHHmm(nowPreview)}`;

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Intern Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Submit your daily work and review your submission history (in-memory only).
          </p>
        </div>

        <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100">
          Status badges:{" "}
          <span className="text-emerald-700">Review Successful</span> /{" "}
          <span className="text-orange-700">Connect Immediately</span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold text-slate-900">Daily Submission</div>
              <div className="mt-1 text-sm text-slate-600">
                {editingId ? "Editing an existing entry" : "Create a new entry"}
              </div>
            </div>

            {editingId ? (
              <Button variant="secondary" size="sm" onClick={resetForm} aria-label="Cancel edit">
                Cancel edit
              </Button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1">
                <div className="text-sm font-semibold text-slate-700">Timestamp</div>
                <div
                  className={[
                    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5",
                    "text-sm font-semibold text-slate-800",
                  ].join(" ")}
                  aria-label="Auto timestamp"
                >
                  {nowPreviewLabel}
                </div>
                <div className="text-xs font-medium text-slate-500">
                  Date/time are captured automatically when you submit.
                </div>
              </div>

              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Day (optional)
                <input
                  type="text"
                  className="focus-ring w-full rounded-xl border-slate-200"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="Leave blank to auto-fill (e.g., Monday)"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
              Description / Work Details
              <textarea
                className="focus-ring min-h-28 w-full resize-y rounded-xl border-slate-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on today?"
                required
              />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
              File Upload (images, PDFs, docs)
              <input
                type="file"
                className="focus-ring w-full rounded-xl border-slate-200"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={onFileChange}
              />
            </label>

            {files.length ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Selected files
                </div>
                <div className="mt-3 grid gap-3">
                  {files.map((f) => (
                    <div key={f.name} className="flex items-center gap-3">
                      {f.previewUrl ? (
                        <img
                          src={f.previewUrl}
                          alt={`Preview for ${f.name}`}
                          className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                          <span className="text-xs font-bold text-slate-500">FILE</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-900">{f.name}</div>
                        <div className="text-xs font-semibold text-slate-500">{f.type || "file"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button type="submit" aria-label="Submit daily work">
                {editingId ? "Save Changes" : "Submit"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold text-slate-900">Submission History</div>
              <div className="mt-1 text-sm text-slate-600">
                Edit and delete actions apply only while the page is mounted.
              </div>
            </div>
            <div className="text-sm font-bold text-slate-700">{submissions.length} entries</div>
          </div>

          <div className="grid gap-4">
            {submissions.map((s) => (
              <Card key={s.id} className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-500">
                      {s.date} {s.time ? `• ${s.time}` : ""} •{" "}
                      <span className="text-slate-900">{s.day}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{s.description}</p>
                  </div>

                  <Badge variant={badgeVariantFromStatus(s.status)}>{s.status}</Badge>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Uploaded file(s)
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {s.files.map((f) => (
                      <FileItem key={`${s.id}-${f.name}`} filename={f.name} />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadForEdit(s)}
                    aria-label={`Edit submission ${s.date}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(s.id)}
                    aria-label={`Delete submission ${s.date}`}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternDashboard;
