import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Badge, { badgeVariantFromStatus } from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import FileItem from "../components/FileItem";
import Modal from "../components/Modal";
import { sampleParticipants } from "../data/sampleParticipants";
import { sampleMentorSubmissionsByParticipantId } from "../data/sampleMentorSubmissions";

const STATUS_CYCLE = ["Review Successful", "Connect Immediately"];

// PUBLIC_INTERFACE
function MentorParticipantDetails() {
  /** Participant details page showing day-wise submissions and a schedule meeting modal (UI-only). */
  const { id } = useParams();
  const participant = useMemo(
    () => sampleParticipants.find((p) => p.id === id),
    [id]
  );

  const [openMeeting, setOpenMeeting] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingReason, setMeetingReason] = useState("");

  // UI-only: allow cycling status on click for demo purposes.
  const [statusOverrides, setStatusOverrides] = useState({});

  const submissions = useMemo(() => {
    return sampleMentorSubmissionsByParticipantId[id] || [];
  }, [id]);

  const getStatus = (submission) => statusOverrides[submission.id] || submission.status;

  const handleCycleStatus = (submissionId, currentStatus) => {
    const idx = STATUS_CYCLE.indexOf(currentStatus);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setStatusOverrides((prev) => ({ ...prev, [submissionId]: next }));
  };

  if (!participant) {
    return (
      <Card className="p-6">
        <div className="text-lg font-extrabold text-slate-900">Participant not found</div>
        <p className="mt-1 text-sm text-slate-600">
          The participant ID in the URL does not match sample data.
        </p>
        <div className="mt-4">
          <Link
            to="/mentor"
            className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            ← Back to Mentor Dashboard
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/mentor"
            className="focus-ring inline-flex rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Back
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {participant.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {participant.cohort} • {participant.totalSubmissions} total submissions
          </p>
        </div>

        <Button onClick={() => setOpenMeeting(true)} aria-label="Schedule meeting">
          Schedule Meeting
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {submissions.map((s) => {
          const status = getStatus(s);
          return (
            <Card key={s.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-500">
                    {s.date} • <span className="text-slate-900">{s.day}</span>
                  </div>
                  <div className="mt-1 text-base font-extrabold text-slate-900">
                    Daily Submission
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{s.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCycleStatus(s.id, status)}
                  className="focus-ring inline-flex self-start"
                  aria-label="Cycle review status"
                  title="Click to cycle status (demo)"
                >
                  <Badge variant={badgeVariantFromStatus(status)}>{status}</Badge>
                </button>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded Files
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {s.files.map((f) => (
                    <FileItem key={f} filename={f} />
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={openMeeting}
        title="Schedule a Meeting"
        description="Pick a date/time and enter a reason (UI-only)."
        onClose={() => setOpenMeeting(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setOpenMeeting(false)}
              aria-label="Cancel scheduling meeting"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // UI-only: just close and reset.
                setOpenMeeting(false);
                setMeetingDate("");
                setMeetingTime("");
                setMeetingReason("");
              }}
              aria-label="Confirm scheduling meeting"
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">
              Date
              <input
                type="date"
                className="focus-ring w-full rounded-xl border-slate-200"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm font-semibold text-slate-700">
              Time
              <input
                type="time"
                className="focus-ring w-full rounded-xl border-slate-200"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Reason
            <textarea
              className="focus-ring min-h-28 w-full resize-y rounded-xl border-slate-200"
              placeholder="Add a short reason for the meeting…"
              value={meetingReason}
              onChange={(e) => setMeetingReason(e.target.value)}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}

export default MentorParticipantDetails;
