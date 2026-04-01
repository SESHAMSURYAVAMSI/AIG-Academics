export type Quiz = {
  id: number;
  question: string;
  options: string[];
  active: boolean;
};

export type QuizFormType = {
  question: string;
  options: string[];
  active: boolean;
};