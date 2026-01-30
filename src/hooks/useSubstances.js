import { useQuery } from '@tanstack/react-query';

export const useSubstances = () => {
  return useQuery({
    queryKey: ['substances'],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:5000/substances/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};
