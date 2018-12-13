import { EntryKey, RopexState } from "./types";
import { RopexIndex } from "./RopexIndex";

export class RopexStore<Entry, K extends EntryKey> {
  constructor(private readonly state: RopexState<Entry, K>) {}

  /**
   * Get a ropex index
   *
   * @param key The key of the index to lookup
   */
  public index(key: string): RopexIndex<Entry, K> {}

  /**
   * Run the garbage collector
   */
  public gc() {}
}
