import { RopexState, EntryKey } from './types';
import { RopexStore } from './RopexStore';

export function ropex<T extends object = {}, I extends EntryKey = string>(
  state: RopexState<T, I>,
): RopexStore<T, I> {}

export namespace ropex {
  /**
   * Create an empty ropex state
   */
  export function empty<T, I extends EntryKey>(): RopexState<T, I> {
    return {
      entries: {} as Record<I, T>,
      indexes: {},
    };
  }
}
