import axios from "axios";
import { API_URL } from "./constants";
import { QueryClient, useMutation } from "react-query";
import { useToast } from "@chakra-ui/react";

axios.defaults.withCredentials = true;

export const queryClient = new QueryClient();

export const analyticsAggregate = async ({ id }: { id: string }) => {
  const res = await axios.get(`${API_URL}/analytics/website/${id}/aggregate`);
  return res.data;
};

export const analyticsSources = async ({ id }: { id: string }) => {
  const res = await axios.get(`${API_URL}/analytics/website/${id}/sources`);
  return res.data;
};

export const analyticsTopPages = async ({ id }: { id: string }) => {
  const res = await axios.get(`${API_URL}/analytics/website/${id}/top-pages`);
  return res.data;
};

export const analytics = async () => {
  const res = await axios.get(`${API_URL}/analytics/all`);
  return res.data;
};

export const projectWebsitesApi = async ({
  projectId,
}: {
  projectId: string;
}) => {
  const res = await axios.get(`${API_URL}/websites/all/${projectId}`);
  return res.data;
};

export const projectMonitor = async () => {
  const res = await axios.get(`${API_URL}/monitor`);
  return res.data;
};

export const checkAuth = async () => {
  const res = await axios.get(`${API_URL}/auth/current-session`);
  return res.data;
};

export const projectsApi = async ({ filter }: { filter: string }) => {
  const res = await axios.get(`${API_URL}/projects/all?filter=${filter}`);
  return res.data;
};

export const projectApi = async (id: string) => {
  const res = await axios.get(`${API_URL}/projects/single/${id}`);
  return res.data;
};

export const apiKeyAPI = async () => {
  const res = await axios.get(`${API_URL}/api-settings/key`);
  return res.data;
};

export const apiSettingsApi = async () => {
  const res = await axios.get(`${API_URL}/api-settings/settings`);
  return res.data;
};

type ProjectProps = {
  name: string;
  github_url?: string;
  description: string;
  language: string;
  active: boolean;
  url?: string;
  environment?: string;
  image_url?: string;
};

const addProject = (project: ProjectProps) => {
  return axios.post(`${API_URL}/projects/new`, project);
};

export const useAddProject = () => {
  const toast = useToast();
  return useMutation(addProject, {
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error adding the project",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        queryClient.invalidateQueries(["projects"]);
      }
    },
  });
};

type WebsiteProps = {
  url: string;
  environment?: string;
  projectId: Number | null;
};

const addWebsite = (website: WebsiteProps) => {
  return axios.post(`${API_URL}/website/new`, website);
};

export const useAddWebsite = () => {
  const toast = useToast();
  return useMutation(addWebsite, {
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error adding the upload",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        queryClient.invalidateQueries(["Monitor"]);
      }
    },
  });
};

type UpdateWebsiteProps = {
  url: string;
  environment?: string;
  default: boolean;
  id: number;
};

export const updateWebsite = (website: UpdateWebsiteProps) => {
  return axios.post(`${API_URL}/website/update`, website);
};

export const useUpdateWebsite = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  return useMutation(updateWebsite, {
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the website",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Website updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // queryClient.invalidateQueries(["monitor"]);
        // queryClient.invalidateQueries(["websites"]);
        window.location.reload()
        onClose();
      }
    },
  });
};

const deleteWebsite = (id: { id: number }) => {
  return axios.post(`${API_URL}/website/delete`, id);
};

export const useDeleteWebsite = () => {
  const toast = useToast();
  return useMutation(deleteWebsite, {
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error deleting the website",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        queryClient.invalidateQueries(["websites"]);
        queryClient.invalidateQueries(["monitor"]);
        toast({
          title: "Success",
          description: "Website deleted",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });
};

const trackWebsite = ({ id, timezone }: { id: number; timezone: string }) => {
  return axios.post(`${API_URL}/analytics/track`, { id, timezone });
};

export const useTrackWebsite = () => {
  const toast = useToast();
  return useMutation(trackWebsite, {
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error tracking the website",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Website tracking setup.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries(["analytics"]);
      }
    },
  });
};

const removeTracking = (id: { id: number }) => {
  return axios.post(`${API_URL}/analytics/remove`, id);
};

export const useRemoveTracking = () => {
  const toast = useToast();
  return useMutation(removeTracking, {
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error removing the website tracking",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ data }) => {
      if (data.message) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Website tracking removed.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries(["analytics"]);
      }
    },
  });
};
