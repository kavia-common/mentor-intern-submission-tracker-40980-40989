import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

// PUBLIC_INTERFACE
function RoleSelect() {
  /** Landing page to choose Mentor or Intern role (UI-only). */
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-600 p-6 text-white shadow-soft sm:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Welcome to Digital Bootcamp
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Choose a role to preview the UI flows for mentors and interns. This is a UI-only demo:
          no backend and no saved data.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="bg-white/95 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Mentor</h2>
            <p className="mt-1 text-sm text-slate-600">
              Review participant submissions, open details, and schedule meetings.
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/mentor")} aria-label="Go to Mentor dashboard">
                Continue as Mentor
              </Button>
            </div>
          </Card>

          <Card className="bg-white/95 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Intern</h2>
            <p className="mt-1 text-sm text-slate-600">
              Submit daily work, upload files, and manage submission history.
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/intern")} aria-label="Go to Intern dashboard">
                Continue as Intern
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs font-semibold text-slate-500">Theme</div>
          <div className="mt-1 text-sm font-bold text-slate-900">Light teal dashboards</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold text-slate-500">Interactions</div>
          <div className="mt-1 text-sm font-bold text-slate-900">In-memory state only</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold text-slate-500">UI</div>
          <div className="mt-1 text-sm font-bold text-slate-900">Responsive + accessible</div>
        </Card>
      </div>
    </div>
  );
}

export default RoleSelect;
