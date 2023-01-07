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
  status: string;
};

export type UserProps = {
  name: string;
  profile_img: string;
  email: string;
  id: number;
};

export type WebsiteProps = {
  createdAt: string;
  environment: string;
  id: number;
  ownerId: number;
  projectId?: number;
  status: string;
  updatedAt: string;
  url: string;
  default: boolean;
  tracking: boolean;
};

export type AggregateProps = {
  bounce_rate: {
    value: number;
  };
  pageviews: {
    value: number;
  };
  visit_duration: {
    value: number;
  };
  visitors: {
    value: number;
  };
};

export type SourcesProps = {
  source: string;
  visitors: number;
};

export type TopPagesProps = {
  page: string;
  visitors: number;
};
