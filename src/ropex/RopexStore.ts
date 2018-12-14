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
    this.gc();
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
    const key = entry[keyField];

    this.newState.entries[key] = entry;

    delete this.newState.drafts[key];

    return this;
  }

  /**
   * Lookup an entry in the store by key
   *
   * Will give precedence to drafts
   *
   * @param key Entry key to lookup
   */
  public getEntry(key: K): Entry | undefined {
    return this.newState.drafts[key] || this.newState.entries[key];
  }

  /**
   * Return all the entries in the store (merging in drafts)
   *
   * @param key Entry key to lookup
   */
  public getEntries(): Record<K, Entry> {
    // See: https://stackoverflow.com/a/51193091/4103890
    return Object.assign({}, this.newState.entries, this.newState.drafts);
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
    this.newState.drafts[key] = map(this.newState.entries[key]);

    return this;
  }

  /**
   * Apply a map function to every entry in the store and safe the results as drafts
   *
   * @param map Function to map an entry to another entry
   */
  public mapEntries(map: (entry: Entry) => Entry): RopexStore<Entry, K> {
    for (const [key, entry] of Object.entries(this.newState.entries)) {
      this.newState.drafts[key] = map(entry as Entry);
    }

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
    delete this.newState.indexes[index];

    // No need to run the garbage collector, that will be ran once at the end
    return this;
  }
}
