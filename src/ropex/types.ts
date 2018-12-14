/**
 * Entry key
 */
export type EntryKey = string | number;

/**
 * Individual index in the state
 */
export type RopexStateIndex<M, K> = {
  /** Meta data for this index */
  meta: M;

  /** List of all the entry keys */
  keys: K[];
};

/**
 * Indexed state
 */
export type RopexState<E extends object, K extends EntryKey = string> = {
  /** The data entries */
  entries: Record<K, E>;

  /** Draft data entries */
  drafts: Record<K, E>;

  /** All the indexes */
  indexes: Record<string, RopexStateIndex<any, K>>;
};
