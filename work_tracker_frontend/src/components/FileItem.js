import React from "react";

/**
 * Simple UI-only "download" simulator.
 * For realism we create a small text blob so the browser downloads something.
 */
function simulateDownload(filename) {
  const content = `This is a simulated download for: ${filename}\n\n(UI-only demo)`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// PUBLIC_INTERFACE
function FileItem({ filename }) {
  /** Displays a clickable file row that triggers a simulated download. */
  return (
    <button
      type="button"
      onClick={() => simulateDownload(filename)}
      className="focus-ring flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm transition hover:bg-slate-50"
      aria-label={`Download ${filename}`}
    >
      <span className="truncate font-semibold text-slate-900">{filename}</span>
      <span className="ml-3 text-xs font-semibold text-teal-700">Download</span>
    </button>
  );
}

export default FileItem;
