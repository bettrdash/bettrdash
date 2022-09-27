export type ProjectProps = {
  createdAt: string;
  id: number;
  name: string;
  github_url?: string;
  description: string;
  language: string;
  active: boolean;
  image_url: string;
  live_url?: string;
};

export type UserProps = {
  name: string;
  profile_img: string;
  email: string;
  id: number;
};
