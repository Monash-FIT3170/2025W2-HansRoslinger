"use client";

import React, { FormEvent, useState } from "react";
import { SignupResponse } from "app/api/signup/route";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

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
<<<<<<< HEAD
    console.log("Signing up with:", {email, password });
=======
    console.log("Signing up with:", { email, password });
>>>>>>> origin/develop
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
<<<<<<< HEAD
        if (data.error == "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`email`)") {
=======
        if (
          data.error ==
          "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`email`)"
        ) {
>>>>>>> origin/develop
          setError("User already exists with this email.");
        } else {
          setError(data.error || "Signup failed");
        }
        return;
      }
<<<<<<< HEAD
      redirect("/login");
=======
      router.push("/login");
>>>>>>> origin/develop
    } catch (error) {
      setError(
        "Error creating user. Please try again. If the problem persists, contact support.",
      );
      console.log("Error creating user:", error);
      return;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Sign Up</h1>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD

=======
>>>>>>> origin/develop
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
<<<<<<< HEAD
            onClick={() => redirect("/login")}
=======
            onClick={() => router.push("/login")}
>>>>>>> origin/develop
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </main>
  );
}
