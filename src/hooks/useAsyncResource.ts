import { useCallback, useEffect, useState, type DependencyList, type Dispatch, type SetStateAction } from 'react';

export interface AsyncResource<T> {
  data: T | null;
  setData: Dispatch<SetStateAction<T | null>>;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Loads data from an async source and tracks loading / error state.
 * The loader is re-run whenever `deps` change or `reload()` is called.
 */
export function useAsyncResource<T>(loader: () => Promise<T>, deps: DependencyList): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    loader()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, setData, loading, error, reload };
}
