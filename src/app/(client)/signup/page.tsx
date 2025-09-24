"use client";

import React, { useState } from "react";
import facebookSvg from "@/images/Facebook.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { register } from "@/services/authService";
import { useSearchParams } from "next/navigation";

const loginSocials = [
  {
    name: "Continue with Facebook",
    provider: "facebook",
    icon: facebookSvg,
  },
  {
    name: "Continue with Google",
    provider: "google",
    icon: googleSvg,
  },
];

const PageSignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      await register(formData);

      // ✅ Auto login after signup, redirect to callbackUrl if present
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: true,
        callbackUrl,
      });
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-PageSignUp" data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 text-center text-3xl md:text-5xl font-semibold">
          Signup
        </h2>

        <div className="max-w-md mx-auto space-y-6">
          {/* Social login */}
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => signIn(item.provider, { callbackUrl })}
                disabled={loading}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image
                  sizes="40px"
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </button>
            ))}
          </div>

          {/* OR divider */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:bg-neutral-900 dark:text-neutral-400">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span>First Name</span>
                <Input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </label>
              <label>
                <span>Last Name</span>
                <Input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </label>
            </div>

            <label>
              <span>Email</span>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </label>

            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Continue"}
            </ButtonPrimary>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          {/* Link to login */}
          <p className="text-center">
            Already have an account?{" "}
            <Link
              href={
                callbackUrl
                  ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : "/login"
              }
              className="text-green-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
