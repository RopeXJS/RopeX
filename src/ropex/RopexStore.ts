import { EntryKey, RopexState } from './types';
import { RopexIndex } from './RopexIndex';

export class RopexStore<Entry extends object, K extends EntryKey> {
  private newState: RopexState<Entry, K>;

  constructor(readonly state: RopexState<Entry, K>) {
    this.newState = JSON.parse(JSON.stringify(state));
  }

  /**
   * Get a ropex index
   *
   * @param key The key of the index to lookup
   */
  public index(key: string): RopexIndex<Entry, K> {
    return new RopexIndex<Entry, K>(this);
  }

  /**
   * Complete the current transaction and return the new state
   */
  public done(): RopexState<Entry, K> {
    return this.newState;
  }

  /**
   * Replace an entry in this store
   *
   * If there is a draft entry with the same ID as the new entry,
   * the draft will be discarded
   *
   * @param entry New entry to set in this index
   * @param keyField What field on the object to use as the key
   */
  public setEntry(entry: Entry, keyField: string): RopexStore<Entry, K> {
    return this;
  }

  /**
   * Apply a map function to an entry
   *
   * @param key The key of the entry to apply the map function to
   * @param map Function to map an entry to another entry
   */
  public mapEntry(
    key: EntryKey,
    map: (entry: Entry) => Entry,
  ): RopexStore<Entry, K> {
    return this;
  }

  /**
   * Apply a map function to every entry in the store
   *
   * @param map Function to map an entry to another entry
   */
  public mapEntries(map: (entry: Entry) => Entry): RopexStore<Entry, K> {
    return this;
  }

  /**
   * Run the garbage collector
   */
  public gc(): RopexStore<Entry, K> {
    const usedEntries = ([] as K[]).concat(
      ...Object.values(this.newState.indexes).map(index => index.keys),
    );

    for (const key of Object.keys(this.newState.entries)) {
      if (!usedEntries.includes(key as K)) {
        delete this.newState.entries[key];
      }
    }

    for (const key of Object.keys(this.newState.drafts)) {
      if (!usedEntries.includes(key as K)) {
        delete this.newState.drafts[key];
      }
    }

    return this;
  }

  /**
   * Remove an index from the state
   *
   * @param index The name of the index to remove
   */
  public remove(index: string): RopexStore<Entry, K> {
    return this;
  }
}
