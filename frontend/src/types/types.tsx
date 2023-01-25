export type IUser = {
  id: number;
  username: string;
  email: string;
};

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
  access_token: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type rawNotes = {
  id: string;
} & rawNoteData;

export type rawNoteData = {
  title: string;
  markdown: string;
  tagIDs: string[];
};
export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string | null;
} & TagData;

export type TagData = {
  label: string;
};

export type TeamMembers = {
  image : string;
  name : string ;
  profile_id : string
}

export type ProfileType = {
  username : string 
} & TeamMembers
