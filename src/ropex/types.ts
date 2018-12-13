/**
 * Entry key
 */
export type EntryKey = string | number;

/**
 * Individual index in the state
 */
export type RopexStateIndex<M> = {
  /** Meta data for this index */
  meta: M;

  /** List of all the entry keys */
  keys: EntryKey[];
};

/**
 * Indexed state
 */
export type RopexState<T, I extends EntryKey = string> = {
  /** The data entries */
  entries: Record<I, T>;

  /** All the indexes */
  indexes: Record<string, RopexStateIndex<any>>;
};
