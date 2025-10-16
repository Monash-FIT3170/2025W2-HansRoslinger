"use client";

import React, { FormEvent, useState } from "react";
import { SignupResponse } from "app/api/signup/route";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);
    console.log("Signing up with:", { email, password });
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data: SignupResponse = await res.json();

      if (!data.user) {
        console.log(data.error);
        if (
          data.error ==
          "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`email`)"
        ) {
          setError("User already exists with this email.");
        } else {
          setError(data.error || "Signup failed");
        }
        setIsLoading(false);
        return;
      }
      router.push("/login");
    } catch (error) {
      setError(
        "Error creating user. Please try again. If the problem persists, contact support.",
      );
      console.log("Error creating user:", error);
      setIsLoading(false);
      return;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFEFD5] to-[#FED6A6]/40"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-[#5C9BB8]/20 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-[#E5A168]/30 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FC9770]/20 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="relative z-10 glass p-10 shadow-2xl w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/yubi-logo.png"
              alt="Yubi Logo"
              width={56}
              height={56}
              style={{ height: "auto" }}
            />
            <span className="text-3xl font-bold gradient-text font-notulen">Yubi</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Create Account</h1>
        <p className="text-center text-[#4a4a4a] mb-8">Join us and start your journey</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6 text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5A168]/30 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/50 focus:border-transparent transition-all bg-white/50 text-[#2a2a2a]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5A168]/30 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/50 focus:border-transparent transition-all bg-white/50 text-[#2a2a2a]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-foreground">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5A168]/30 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/50 focus:border-transparent transition-all bg-white/50 text-[#2a2a2a]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="spinner w-5 h-5 border-2"></div>
                Creating account...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4a4a4a]">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="font-semibold text-[#5C9BB8] hover:text-[#4a89a6] cursor-pointer transition-colors"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
