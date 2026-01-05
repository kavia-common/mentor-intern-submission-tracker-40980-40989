import React from "react";

const VARIANT_CLASSES = {
  green: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  orange: "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200",
  slate: "bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200",
};

// PUBLIC_INTERFACE
function Badge({ variant = "slate", children, className = "", ...props }) {
  /** Small status badge with color variants. */
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        "transition-colors",
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.slate,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

// PUBLIC_INTERFACE
export function badgeVariantFromStatus(status) {
  /** Maps mentor/intern status strings to badge variants. */
  if (status === "Review Successful") return "green";
  if (status === "Connect Immediately") return "orange";
  return "slate";
}

export default Badge;
