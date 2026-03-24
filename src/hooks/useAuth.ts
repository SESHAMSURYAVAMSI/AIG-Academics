import { useRouter } from "next/navigation";
import API from "@/lib/api";

export const useAuth = () => {
  const router = useRouter();

  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await API.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { login };
};