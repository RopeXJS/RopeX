import { EntryKey, RopexState } from './types';
import { RopexIndex } from './RopexIndex';

export class RopexStore<Entry extends object, K extends EntryKey> {
  constructor(private readonly state: RopexState<Entry, K>) {}

  /**
   * Get a ropex index
   *
   * @param key The key of the index to lookup
   */
  public index(key: string): RopexIndex<Entry, K> {}

  /**
   * Complete the current transaction and return the new state
   */
  public done(): RopexState {}

  /**
   * Replace an entry in this store
   *
   * If there is a draft entry with the same ID as the new entry,
   * the draft will be discarded
   *
   * @param entry New entry to set in this index
   * @param keyField What field on the object to use as the key
   */
  public setEntry(entry: Entry, keyField: string): RopexStore {}

  /**
   * Apply a map function to an entry
   *
   * @param key The key of the entry to apply the map function to
   * @param map Function to map an entry to another entry
   */
  public mapEntry(key: EntryKey, map: (entry: Entry) => Entry): RopexStore {}

  /**
   * Apply a map function to every entry in the store
   *
   * @param map Function to map an entry to another entry
   */
  public mapEntries(map: (entry: Entry) => Entry): RopexStore {}

  /**
   * Run the garbage collector
   */
  public gc(): RopexStore {}
}
