import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): UseFetchState<T> & { refetch: () => void } => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetcher();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const error = err as AxiosError<any>;
      setState({
        data: null,
        loading: false,
        error: error.response?.data?.message || error.message || 'An error occurred',
      });
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { ...state, refetch: fetchData };
};
