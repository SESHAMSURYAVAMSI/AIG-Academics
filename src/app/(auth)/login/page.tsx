"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await login(data);
      alert("Login successful ✅");
      router.push("/dashboard");
    } catch (error) {
      alert("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#D8E8FB] to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2"
      >
        {/* LEFT - FORM */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="text-center mb-5">
            <h2 className="text-2xl font-bold text-black">APP Login</h2>
            <p className="text-gray-500 text-sm">
              Welcome back! Login to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-black font-medium">Email</label>
              <Input
                placeholder="Enter your email"
                {...register("email")}
                className="mt-1 bg-gray-100 text-black h-9"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-black font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="mt-1 bg-gray-100 text-black h-9"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-md transition"
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="hidden md:block relative">
          {/* <Image
            src="https://aig-academics.s3.ap-southeast-1.amazonaws.com/login_bdhrsz.png"
            alt="Login"
            fill
            className="object-cover"
            unoptimized
          /> */}
          <img
            src="https://aig-academics.s3.ap-southeast-1.amazonaws.com/login_bdhrsz.png"
            alt="Login Background"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
