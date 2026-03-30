export type SpeakerMember = {
  id: number;
  name: string;
  designation: string;
  description: string;
  image: string;
  type: string;
  active: boolean;
};

export type SpeakerMemberFormType = {
  name: string;
  designation: string;
  description: string;
  image: string;
  type: string;
  active: boolean;
};

export type SpeakerType = {
  id: number;
  name: string;
  active: boolean;
};