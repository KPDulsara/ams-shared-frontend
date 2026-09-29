import { useEffect, useState } from 'react';
import { useLocation, useNavigate, type NavigateOptions } from 'react-router-dom';

interface FlashState {
  flash?: string;
}

/** Navigation options that carry a one-time success message to the next screen. */
export const withFlash = (flash: string): NavigateOptions => ({ state: { flash } satisfies FlashState });

/** Reads a one-time message passed with `withFlash` and clears it from history. */
export const useFlashMessage = (): string | null => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message] = useState<string | null>(() => (location.state as FlashState | null)?.flash ?? null);

  useEffect(() => {
    if (message) navigate(location.pathname, { replace: true, state: null });
    // Only clear once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return message;
};
