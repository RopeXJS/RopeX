import { EntryKey } from "./types";

export class RopexIndex<Entry extends object, K extends EntryKey> {
  // Getters

  /**
   * Get all the entries in this index
   */
  getAll(): Entry[] {}

  /**
   * Return a meta-data field on the index
   *
   * If the meta-data field doesn't exist, return the default value.
   *
   * @param key The meta-data field to look up
   * @param defaultVal Default value for the meta-data
   */
  getMetaData<T>(key: string, defaultVal: T): T {}

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
  setEntry(entry: Entry, keyField: string): RopexIndex {}

  /**
   * Replace the entries in this index
   *
   * If there are any draft entries, they will be discarded
   *
   * @param entries New entries to set for this index
   * @param keyField What field on the object to use as the key
   */
  setEntries(entries: Entry[], keyField: string): RopexIndex {}

  /**
   * Add a new entry to the index
   *
   * If there is a draft entry with the same ID as the new entry,
   * the draft will be discarded
   *
   * @param entry New entry to add to the index
   */
  addEntry(entry: Entry): RopexIndex {}

  /**
   * Add new entries to this index
   *
   * If there are any draft entries that have the same key as
   * the new entries, the drafts will be discarded.
   *
   * @param entries New entries to add to this index
   */
  addEntries(entries: Entry[]): RopexIndex {}

  /**
   * Set a meta-data field
   *
   * @param key meta-data field key
   * @param value what to set the meta-data field as
   */
  setMetaData<T>(key: string, value: T): RopexIndex {}

  /**
   * Apply a map function to an entry
   *
   * @param key The key of the entry to apply the map function to
   * @param map Function to map an entry to another entry
   */
  mapEntry(key: EntryKey, map: (entry: Entry) => Entry): RopexIndex {}

  /**
   * Apply a map function to every entry in the index
   *
   * @param map Function to map an entry to another entry
   */
  mapEntries(map: (entry: Entry) => Entry): RopexIndex {}

  // Misc

  /**
   * Get a sibling index
   *
   * @param key The key of the index to lookup
   */
  index(key: K): RopexIndex<Entry, K> {}

  /**
   * Complete the current transaction and return the new state
   */
  done(): RopexState {}

  /**
   * Remove this index and return the parent {@link RopexStore}
   */
  remove(): RopexStore {}
}
