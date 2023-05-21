export type ProjectProps = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  github_url?: string;
  language: string;
  description: string;
  active: boolean;
  image_url: string;
  status: string;
  websites?: WebsiteProps[];
  defaultWebsiteId?: number;
  live_url?: string;
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

export type BreadCrumbProps = {
  breadcrumbs: Array<{
    path: string;
    label: string;
    color?: string;
  }>;
  setBreadcrumbs: React.Dispatch<
    React.setStateAction<
      Array<{
        path: string;
        label: string;
        color?: string;
      }>
    >
  >;
};
