import { EntryKey, RopexState, EntryMap, RopexOptions } from './types';
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
    const index = this.newState.indexes[key] || { meta: {}, keys: [] };
    this.newState.indexes[key] = index;

    return new RopexIndex<Entry, K>(this, key, index);
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
   * Remove an entry from the store
   *
   * If the entry is a draft, the draft will be removed
   *
   * @param key The key of the entry to delete
   */
  public removeEntry(key: K): RopexStore<Entry, K> {
    delete this.newState.entries[key];
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
   * @param options Optional config for how to apply the map
   */
  public mapEntry(
    key: K,
    map: EntryMap<Entry>,
    options?: RopexOptions,
  ): RopexStore<Entry, K> {
    const entry = this.getEntry(key);

    const config = options || { draft: true };

    if (config.draft) {
      this.newState.drafts[key] = map(entry as Entry);
    } else {
      this.newState.entries[key] = map(entry as Entry);
      delete this.newState.drafts[key];
    }

    return this;
  }

  /**
   * Apply a map function to every entry in the store and safe the results as drafts
   *
   * @param map Function to map an entry to another entry
   * @param options Optional config for how to apply the map
   */
  public mapEntries(
    map: EntryMap<Entry>,
    options?: RopexOptions,
  ): RopexStore<Entry, K> {
    for (const key of Object.keys(this.getEntries()) as K[]) {
      this.mapEntry(key, map, options);
    }

    return this;
  }

  /**
   * Run the garbage collector
   */
  public gc(): RopexStore<Entry, K> {
    // Entries that are requested by the indexes
    const requestedEntries = new Set(
      ([] as K[]).concat(
        ...Object.values(this.newState.indexes).map(index => index.keys),
      ),
    );

    // Entries that are in the store
    const knownEntries = new Set();

    // Clean un-requested entries from the store
    for (const entries of [this.newState.entries, this.newState.drafts]) {
      for (const key of Object.keys(entries)) {
        if (!requestedEntries.has(key as K)) {
          delete entries[key];
        } else {
          knownEntries.add(key);
        }
      }
    }

    // Clean any entries that are requested by an index, but not in the store
    if (requestedEntries.size > knownEntries.size) {
      for (const index of Object.values(this.newState.indexes)) {
        index.keys = index.keys.filter(key => knownEntries.has(key));
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
