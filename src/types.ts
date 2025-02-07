export type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  options?: string[];
  likes?: number;
  dislikes?: number;
};

export type IncomeDetails = {
  [key: string]: string | number | boolean | undefined;
  salary?: string;
  rental?: string;
  business?: string;
  capitalgains?: string;
  interest?: string;
};

export type ITRForm = {
  name: string;
  description: string;
  applicableFor: string[];
};