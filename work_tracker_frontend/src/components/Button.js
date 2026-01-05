import React from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900",
  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:bg-slate-100",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
};

// PUBLIC_INTERFACE
function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  children,
  ...props
}) {
  /** Reusable button component with variants and accessibility-friendly focus ring. */
  const sizeClasses =
    size === "sm"
      ? "px-3 py-2 text-sm"
      : size === "lg"
        ? "px-5 py-3 text-base"
        : "px-4 py-2.5 text-sm";

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-all duration-200",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-sm disabled:hover:translate-y-0",
        sizeClasses,
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
