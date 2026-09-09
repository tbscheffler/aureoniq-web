"use client";

import Link from "next/link";
import { safeRedirect } from "@/lib/safeRedirect";
import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSignup() {
    try {
      setLoading(true);

      if (!email || !password) {
        alert("Please enter your email and password.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: new URL(redirect, window.location.origin).toString(),
          data: {
            display_name: displayName,
            signup_type: "client_invite",
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        window.location.href = redirect;
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <Link href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </Link>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          CLIENT INVITATION
        </p>

        <h1 className="text-4xl font-black">
          Create your AureonIQ account.
        </h1>

        <p className="mt-4 leading-7 text-slate-400">
          Use the same email address your coach invited. After creating your
          account, check your email and verify your AureonIQ account before
          returning to accept the coach invitation.
        </p>

        <div className="mt-10 space-y-4">
          {submitted ? (
            <div role="status" className="rounded-2xl border border-slate-700 p-5 text-slate-300">
              <p>Check your email to confirm your account. The confirmation link will return you to your invitation.</p>
              <p className="mt-3">If you already have an account, sign in below using the email your coach invited.</p>
              <Link href={redirect} className="mt-4 block font-bold text-[#FBBF24]">Return to invitation after verification</Link>
            </div>
          ) : null}
          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Display name optional"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
            disabled={loading || submitted}
            className="w-full rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
          >
            {loading ? "Creating account..." : submitted ? "Check your email" : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-bold text-[#FBBF24]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function SignupFallback() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <p className="font-black text-[#FBBF24]">Loading signup...</p>
      </section>
    </main>
  );
}