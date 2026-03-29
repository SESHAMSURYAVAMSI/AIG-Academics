// DB / Stored Data
export type EventInfo = {
  id: number;
  title: string;
  description: string;
  image?: string; // optional (storage)
  active: boolean;
};

// Form State (STRICT)
export type EventInfoFormType = {
  title: string;
  description: string;
  image: string; // always string
  active: boolean;
};