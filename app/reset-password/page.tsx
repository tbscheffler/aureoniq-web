"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));

  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  async function setRecoverySession() {
    if (!accessToken || !refreshToken) {
      setErrorMessage(
        "This reset link is missing required recovery information. Please request a new password reset email."
      );
      return;
    }

    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  setRecoverySession();
}, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage(
      "Your password has been updated. You can now return to the AureonIQ app or sign in on the website."
    );

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 mb-3">
          AureonIQ
        </p>

        <h1 className="text-3xl font-semibold mb-3">Reset your password</h1>

        <p className="text-white/70 mb-6">
          Enter a new password below. After saving it, you can return to the
          AureonIQ app or web login.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">
              New password
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">
              Confirm password
            </label>
            <input
              type="password"
              className="w-full rounded-lg bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-yellow-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

          {message && (
            <div className="space-y-4">
                <p className="text-sm text-green-400">
                Your password has been updated successfully.
                </p>

                <Link
                href="/login"
                className="block w-full rounded-lg bg-yellow-400 px-4 py-3 text-center font-semibold text-black hover:bg-yellow-300"
                >
                Go to Website Login
                </Link>

                <p className="text-sm text-white/60 text-center">
                Or return to the AureonIQ mobile app and sign in with your new password.
                </p>
            </div>
            )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Updating password..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}