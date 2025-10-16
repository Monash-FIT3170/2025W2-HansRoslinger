"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { LoginResponse } from "../api/login/route";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Load any remembered credentials on mount
  useEffect(() => {
    try {
      const savedRemember = localStorage.getItem("rememberMe") === "true";
      if (savedRemember) {
        setRememberMe(true);
        setEmail(localStorage.getItem("rememberedEmail") || "");
        setPassword(localStorage.getItem("rememberedPassword") || "");
      } else {
        setRememberMe(false);
      }
    } catch {
      // no-op if storage is not available
    }
  }, []);

  // Keep storage in sync when rememberMe is enabled
  useEffect(() => {
    try {
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      }
    } catch {
      // ignore storage errors
    }
  }, [rememberMe, email, password]);

  const handleRememberChange = (checked: boolean) => {
    setRememberMe(checked);
    try {
      if (!checked) {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      } else {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      }
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // fetch user from database
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data: LoginResponse = await res.json();

    if (!data.success) {
      setError(data.error || "Login failed");
      setIsLoading(false);
      return;
    }

    //router.push("/dashboard");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#F8FAFB] to-[#EBF2F7]/50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#5C9BB8]/5 to-transparent"></div>
      
      {/* Animated gradient orbs - larger and more vibrant */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-[#FC9770]/25 mix-blend-multiply filter blur-3xl opacity-80 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-[#FBC841]/35 mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#5C9BB8]/25 mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#E5A168]/20 mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-3000"></div>
      
      {/* Floating decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#5C9BB8]/20 rounded-full animate-float"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-[#FC9770]/20 rounded-full animate-float-delayed"></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#FBC841]/10 rounded-full animate-float-slow"></div>
      
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
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Subtle three-dot loader for the Sign In button */
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .loading-dots {
          display: inline-flex;
          gap: 6px;
          margin-right: 8px;
          align-items: center;
        }
        .loading-dots .dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #ffffff;
          animation: dotPulse 1.2s infinite ease-in-out;
        }
        .loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        {/* Info Section */}
        <div className="hidden lg:block max-w-md animate-slide-up py-8">
          <div className="flex items-center mb-8">
            <Image
              src="/yubi-logo.png"
              alt="Yubi Logo"
              width={72}
              height={72}
              style={{ height: "auto" }}
            />
            <h2 className="text-5xl font-bold text-[#5C9BB8] font-notulen">
              Yubi
            </h2>
          </div>
          <p className="text-lg text-[#4a4a4a] mb-10 leading-relaxed font-recursive">
            Experience the future of interaction with gesture-based controls. Yubi transforms how you interact with your data visualisations using just your hands.
          </p>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-[#5C9BB8] flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 font-notulen text-lg">Gesture Control</h3>
                <p className="text-sm text-[#6a6a6a] font-recursive">Navigate and interact with your content using natural hand gestures</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-[#FBC841] flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 font-notulen text-lg">Data Visualisation</h3>
                <p className="text-sm text-[#6a6a6a] font-recursive">Create and manage beautiful charts and visualisations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-[#FC9770] flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 font-notulen text-lg">Smart Collections</h3>
                <p className="text-sm text-[#6a6a6a] font-recursive">Organise your work into collections for easy access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass p-10 shadow-2xl w-full max-w-md animate-scale-in">
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
              <span className="text-3xl font-bold text-[#5C9BB8] font-notulen">Yubi</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-foreground font-notulen">Welcome</h1>
          <p className="text-center text-[#4a4a4a] mb-8 font-recursive">Sign in to access your dashboard</p>

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

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => handleRememberChange(e.target.checked)}
              className="relative inline-grid place-content-center w-4 h-4 border border-[#E5A168]/40 bg-white checked:bg-white checked:border-[#E5A168]/40 focus:ring-2 focus:ring-[#5C9BB8]/30 cursor-pointer transition-all appearance-none after:content-[''] after:w-2 after:h-2 after:bg-[#5C9BB8] after:hidden checked:after:block"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[#4a4a4a] cursor-pointer font-recursive">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5C9BB8] hover:bg-[#4a89a6] text-white py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <span className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
                Signing in
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4a4a4a] font-recursive">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="font-semibold text-[#5C9BB8] hover:text-[#4a89a6] cursor-pointer transition-colors"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
      </div>
    </main>
  );
}
