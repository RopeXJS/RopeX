import { EntryKey, RopexState, RopexStateIndex } from './types';
import { RopexStore } from './RopexStore';

export class RopexIndex<Entry extends object, K extends EntryKey> {
  constructor(
    private readonly ropexStore: RopexStore<Entry, K>,
    private readonly indexName: string,
    private readonly indexState: RopexStateIndex<Entry, K>,
  ) {}

  // Getters

  /**
   * Get all the entries in this index
   */
  public getAll(): Entry[] {
    return [];
  }

  /**
   * Return a meta-data field on the index
   *
   * If the meta-data field doesn't exist, return the default value.
   *
   * @param key The meta-data field to look up
   * @param defaultVal Default value for the meta-data
   */
  public getMetaData<T>(key: string, defaultVal?: T): T {
    return defaultVal as T;
  }

  // Setters

  /**
   * Replace an entry in this index
   *
   * If there is a draft entry with the same ID as the new entry,
   * the draft will be discarded
   *
   * @param entry New entry to set in this index
   * @param keyField What field on the object to use as the key
   */
  public setEntry(entry: Entry, keyField: string): RopexIndex<Entry, K> {
    return this;
  }

  /**
   * Replace the entries in this index
   *
   * If there are any draft entries, they will be discarded
   *
   * @param entries New entries to set for this index
   * @param keyField What field on the object to use as the key
   */
  public setEntries(entries: Entry[], keyField: string): RopexIndex<Entry, K> {
    return this;
  }

  /**
   * Add a new entry to the index
   *
   * If there is a draft entry with the same ID as the new entry,
   * the draft will be discarded
   *
   * @param entry New entry to add to the index
   * @param keyField What field on the object to use as the key
   */
  public addEntry(entry: Entry, keyField: string): RopexIndex<Entry, K> {
    return this;
  }

  /**
   * Add new entries to this index
   *
   * If there are any draft entries that have the same key as
   * the new entries, the drafts will be discarded.
   *
   * @param entries New entries to add to this index
   * @param keyField What field on the object to use as the key
   */
  public addEntries(entries: Entry[], keyField: string): RopexIndex<Entry, K> {
    return this;
  }

  /**
   * Set a meta-data field
   *
   * @param key meta-data field key
   * @param value what to set the meta-data field as
   */
  public setMetaData<T>(key: string, value: T): RopexIndex<Entry, K> {
    return this;
  }

  /**
   * Apply a map function to an entry
   *
   * @param key The key of the entry to apply the map function to
   * @param map Function to map an entry to another entry
   */
  public mapEntry(key: K, map: (entry: Entry) => Entry): RopexIndex<Entry, K> {
    if (!this.indexState.keys.includes(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Trying to map entry with key "${key}" that's not in index "${
            this.indexName
          }"`,
        );
      }

      return this;
    }

    this.ropexStore.mapEntry(key, map);

    return this;
  }

  /**
   * Apply a map function to every entry in the index
   *
   * @param map Function to map an entry to another entry
   */
  public mapEntries(map: (entry: Entry) => Entry): RopexIndex<Entry, K> {
    return this;
  }

  // Misc

  /**
   * Get a sibling index
   *
   * @param key The key of the index to lookup
   */
  public index(key: K): RopexIndex<Entry, K> {
    return this;
  }

  /**
   * Complete the current transaction and return the new state
   */
  public done(): RopexState<Entry, K> {
    return this.ropexStore.done();
  }

  /**
   * Remove this index and return the parent {@link RopexStore}
   */
  public remove(): RopexStore<Entry, K> {
    return this.ropexStore.remove(this.indexName);
  }
}
