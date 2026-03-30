export type Delegate = {
  id: number;
  name: string;
  designation: string;
  email: string;
  image?: string; // ✅ ADD THIS
  active: boolean;
};