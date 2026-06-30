"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    try {
      setLoading(true);

      if (!email || !password || !businessName) {
        alert("Please fill out your email, password, and coaching business name.");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
            signup_type: "coach_trial",
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      window.location.href = "/login?signup=success";
    } catch (err: any) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <Link href="/coaches" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to Coaches
        </Link>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          START YOUR 14-DAY TRIAL
        </p>

        <h1 className="text-4xl font-black">
          Create your coach account.
        </h1>

        <p className="mt-4 leading-7 text-slate-400">
          Start free for 14 days with up to 4 active clients. Starter is
          $49/month after trial.
        </p>

        <div className="mt-10 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Coaching business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#FBBF24]">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}