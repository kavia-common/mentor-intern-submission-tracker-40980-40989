import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { sampleParticipants } from "../data/sampleParticipants";

// PUBLIC_INTERFACE
function MentorDashboard() {
  /** Mentor dashboard showing participant cards. Clicking navigates to participant details. */
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Mentor Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review participant submissions and schedule follow-ups.
          </p>
        </div>
        <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100">
          Cohort: <span className="text-teal-700">Spring 2026</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sampleParticipants.map((p) => (
          <Card
            key={p.id}
            as="button"
            type="button"
            onClick={() => navigate(`/mentor/participant/${p.id}`)}
            className="group w-full p-5 text-left"
            aria-label={`Open participant ${p.name}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold text-slate-900">{p.name}</div>
                <div className="mt-1 text-sm font-semibold text-slate-500">{p.cohort}</div>
              </div>

              <div className="rounded-xl bg-teal-50 px-3 py-2 text-right">
                <div className="text-xs font-semibold text-slate-500">Submissions</div>
                <div className="text-base font-extrabold text-teal-800">{p.totalSubmissions}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Badge variant="slate">{p.statusSummary}</Badge>
              <span className="text-sm font-bold text-teal-700 transition group-hover:text-teal-800">
                View details →
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MentorDashboard;
