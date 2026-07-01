"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getUserWorkspaceAccess,
  type WorkspaceAccess,
} from "@/services/workspaceAccessService";

export default function PortalPage() {
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceAccess[]>([]);

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const access = await getUserWorkspaceAccess();

        if (access.length === 1) {
          window.location.href = access[0].href;
          return;
        }

        setWorkspaces(access);
      } catch (error: any) {
        alert(error.message || "Unable to load workspaces.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">
            Loading your AureonIQ workspaces...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <Link href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </Link>

        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          AUREONIQ PORTAL
        </p>

        <h1 className="mt-4 text-5xl font-black leading-tight">
          Choose your workspace.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          You have access to multiple AureonIQ workspaces. Choose where you want
          to work today.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.key}
              href={workspace.href}
              className="rounded-3xl border border-slate-800 bg-[#111827] p-7 transition hover:border-[#FBBF24]/70 hover:bg-[#172033]"
            >
              <p className="text-sm font-black tracking-[0.2em] text-[#FBBF24]">
                {workspace.key.toUpperCase()}
              </p>

              <h2 className="mt-4 text-3xl font-black text-white">
                {workspace.label}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {workspace.description}
              </p>

              <p className="mt-6 font-black text-[#FBBF24]">
                Open Workspace →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}