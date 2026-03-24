"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
    await login(data);
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-30 blur-3xl animate-pulse"></div>

      {/* 💡 Glow Circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-40"></div>

      {/* 🧊 Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10"
      >
        <div className="w-[400px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          
          {/* Title */}
          <motion.h1
            className="text-3xl font-bold text-center text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🚀 Admin Portal
          </motion.h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email */}
            <Input
              placeholder="Email"
              {...register("email")}
              className="bg-white/10 text-white border-white/20 focus:ring-2 focus:ring-pink-500"
            />

            {/* Password */}
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="bg-white/10 text-white border-white/20 focus:ring-2 focus:ring-purple-500"
            />

            {/* Button */}
            <Button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-all">
              Login
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-300 text-sm mt-5">
            Secure Admin Access 🔐
          </p>
        </div>
      </motion.div>
    </div>
  );
}