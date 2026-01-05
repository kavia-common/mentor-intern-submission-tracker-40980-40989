import React from "react";

// PUBLIC_INTERFACE
function Card({ as: Component = "div", className = "", children, ...props }) {
  /** Generic card container with hover affordances. */
  return (
    <Component
      className={[
        "rounded-2xl bg-white shadow-sm ring-1 ring-slate-100",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-soft",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
