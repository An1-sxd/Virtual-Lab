import { useQuery } from '@tanstack/react-query';

const ip = "192.168.43.101:5000";

export const useApi = (key) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await fetch(`http://${ip}/${key}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useApiBody = (key, body, options = {}) => {
  return useQuery({
    queryKey: [key, body],
    queryFn: async () => {
      const response = await fetch(`http://${ip}/${key}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    ...options
  });
}