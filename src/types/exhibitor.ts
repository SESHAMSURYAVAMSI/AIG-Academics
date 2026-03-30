export type ExhibitorMember = {
  id: number;
  name: string;
  stall: string;
  hall: string;
  image: string;
  description: string;
  type: string;
  active: boolean;
};

export type ExhibitorMemberForm = {
  name: string;
  stall: string;
  hall: string;
  image: string;
  description: string;
  type: string;
  active: boolean;
};

export type ExhibitorType = {
  id: number;
  name: string;
  active: boolean;
};