"use client";

import { useEffect, useState } from "react";
import {
  createOrganizationClientMeeting,
  getOrganizationClientMeetings,
} from "@/services/coachService";


export default function MeetingHistorySection({
    organizationClientId,
  }: {
    organizationClientId: string;
  }) {
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [title, setTitle] = useState("Coaching Session");
    const [summary, setSummary] = useState("");
    const [followUp, setFollowUp] = useState("");
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);
    const [saving, setSaving] = useState(false);
  
    async function loadMeetings() {
      try {
        setLoadingMeetings(true);
        const data = await getOrganizationClientMeetings(organizationClientId);
        setMeetings(data || []);
      } catch (error: any) {
        alert(error.message || "Failed to load meetings.");
      } finally {
        setLoadingMeetings(false);
      }
    }
  
    useEffect(() => {
      loadMeetings();
    }, [organizationClientId]);
  
    async function handleSaveMeeting() {
      if (!meetingDate) {
        alert("Choose a meeting date first.");
        return;
      }
  
      try {
        setSaving(true);
  
        await createOrganizationClientMeeting({
          organizationClientId,
          meetingDate: new Date(
            `${meetingDate}T${meetingTime || "12:00"}`
          ).toISOString(),
          title,
          summary,
          followUp,
        });
  
        setMeetingDate("");
        setMeetingTime("");
        setTitle("Coaching Session");
        setSummary("");
        setFollowUp("");
  
        await loadMeetings();
        alert("Meeting saved.");
      } catch (error: any) {
        alert(error.message || "Failed to save meeting.");
      } finally {
        setSaving(false);
      }
    }
  
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          MEETING HISTORY
        </p>
  
        <h2 className="mt-4 text-3xl font-black text-white">
          Coaching sessions
        </h2>
  
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            type="date"
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />

          <input
            type="time"
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
          />
  
          <input
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title"
          />
        </div>
  
        <textarea
          className="mt-4 min-h-32 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
          placeholder="Session summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
  
        <textarea
          className="mt-4 min-h-24 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
          placeholder="Follow-up items..."
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
        />
  
        <button
          onClick={handleSaveMeeting}
          disabled={saving}
          className="mt-4 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Meeting"}
        </button>
  
        <div className="mt-10">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            SAVED MEETINGS
          </p>
  
          {loadingMeetings ? (
            <p className="mt-4 text-slate-400">Loading meetings...</p>
          ) : meetings.length === 0 ? (
            <p className="mt-4 text-slate-400">No meetings yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <p className="font-black text-white">{meeting.title}</p>
  
                  <p className="mt-2 text-sm text-slate-500">
                    {meeting.meeting_date
                      ? new Date(meeting.meeting_date).toLocaleString()
                      : "No date"}
                  </p>
  
                  {meeting.summary ? (
                    <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
                      {meeting.summary}
                    </p>
                  ) : null}
  
                  {meeting.follow_up ? (
                    <div className="mt-4 rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-4">
                      <p className="text-sm font-black text-[#FBBF24]">
                        Follow-up
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {meeting.follow_up}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
