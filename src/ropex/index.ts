import { RopexState, EntryKey } from './types';
import { RopexStore } from './RopexStore';

/**
 * Create a new ropex store
 *
 * @param state indexed state
 *
 * @template E Store entry type
 * @template K Entry key type
 */
export function ropex<E extends object, K extends EntryKey>(
  state: RopexState<E, K>,
): RopexStore<E, K> {}

export namespace ropex {
  /**
   * Create an empty ropex state
   */
  export function empty<T extends object, K extends EntryKey>(): RopexState<
    T,
    K
  > {
    return {
      entries: {} as Record<K, T>,
      indexes: {},
      drafts: {} as Record<K, T>,
    };
  }
}
