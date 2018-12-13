import { EntryKey } from './types';
import { RopexStore } from './RopexStore';

export class RopexIndex<Entry extends object, K extends EntryKey> {
  constructor(private readonly ropexStore: RopexStore) {}

  // Getters

  /**
   * Get all the entries in this index
   */
  public getAll(): Entry[] {}

  /**
   * Return a meta-data field on the index
   *
   * If the meta-data field doesn't exist, return the default value.
   *
   * @param key The meta-data field to look up
   * @param defaultVal Default value for the meta-data
   */
  public getMetaData<T>(key: string, defaultVal?: T): T {}

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
  public setEntry(entry: Entry, keyField: string): RopexIndex {}

  /**
   * Replace the entries in this index
   *
   * If there are any draft entries, they will be discarded
   *
   * @param entries New entries to set for this index
   * @param keyField What field on the object to use as the key
   */
  public setEntries(entries: Entry[], keyField: string): RopexIndex {}

  /**
   * Add a new entry to the index
   *
   * If there is a draft entry with the same ID as the new entry,
   * the draft will be discarded
   *
   * @param entry New entry to add to the index
   * @param keyField What field on the object to use as the key
   */
  public addEntry(entry: Entry, keyField: string): RopexIndex {}

  /**
   * Add new entries to this index
   *
   * If there are any draft entries that have the same key as
   * the new entries, the drafts will be discarded.
   *
   * @param entries New entries to add to this index
   * @param keyField What field on the object to use as the key
   */
  public addEntries(entries: Entry[], keyField: string): RopexIndex {}

  /**
   * Set a meta-data field
   *
   * @param key meta-data field key
   * @param value what to set the meta-data field as
   */
  public setMetaData<T>(key: string, value: T): RopexIndex {}

  /**
   * Apply a map function to an entry
   *
   * @param key The key of the entry to apply the map function to
   * @param map Function to map an entry to another entry
   */
  public mapEntry(key: EntryKey, map: (entry: Entry) => Entry): RopexIndex {}

  /**
   * Apply a map function to every entry in the index
   *
   * @param map Function to map an entry to another entry
   */
  public mapEntries(map: (entry: Entry) => Entry): RopexIndex {}

  // Misc

  /**
   * Get a sibling index
   *
   * @param key The key of the index to lookup
   */
  public index(key: K): RopexIndex<Entry, K> {}

  /**
   * Complete the current transaction and return the new state
   */
  public done(): RopexState {}

  /**
   * Remove this index and return the parent {@link RopexStore}
   */
  public remove(): RopexStore {}
}
