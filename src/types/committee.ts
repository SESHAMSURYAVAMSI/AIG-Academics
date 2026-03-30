export type CommitteeMember = {
  id: number;
  name: string;
  designation: string;
  image: string;
  type: string;
  active: boolean;
};

export type CommitteeMemberForm = {
  name: string;
  designation: string;
  image: string;
  type: string;
  active: boolean;
};

export type CommitteeType = {
  id: number;
  name: string;
  active: boolean;
};