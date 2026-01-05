import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

// PUBLIC_INTERFACE
function Header({ onLogout, currentPath }) {
  /** Global header-only layout. Shows branding and a Logout action. */
  const showBackToHome = currentPath !== "/";

  return (
    <header className="sticky top-0 z-30 border-b border-teal-100/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-700 text-white shadow-sm">
            <span className="text-sm font-extrabold">DB</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold text-slate-900">Digital Bootcamp</div>
            <div className="text-xs font-medium text-slate-500">
              Mentor & Intern submission tracker (UI-only)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showBackToHome ? (
            <Link
              to="/"
              className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Home
            </Link>
          ) : null}

          <Button
            variant="secondary"
            onClick={onLogout}
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
