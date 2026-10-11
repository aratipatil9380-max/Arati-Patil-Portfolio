import { useMemo } from 'react';

export type DeviceTier = 'low' | 'high';

type NavigatorWithHints = Navigator & {
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
};

/**
 * A deliberately conservative guess at how much canvas work a device can take.
 * Anything uncertain (touch, small screens, few cores, data-saver) resolves to
 * `low`, so the heaviest scenes only run where there is headroom. Computed once.
 */
export function useDeviceTier(): DeviceTier {
  return useMemo<DeviceTier>(() => {
    if (typeof window === 'undefined') return 'low';

    const nav = navigator as NavigatorWithHints;
    const coarse =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    const cores = nav.hardwareConcurrency ?? 4;
    const saveData = nav.connection?.saveData === true;
    const small = window.innerWidth < 768;

    if (saveData || coarse || small || cores <= 4) return 'low';
    return 'high';
  }, []);
}
