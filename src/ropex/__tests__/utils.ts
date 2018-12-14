export type Entry = {
  id: string;
  data: string;
};
export const entries: Entry[] = [
  { id: 'a', data: 'entry_a' },
  { id: 'b', data: 'entry_b' },
];
export const baseState = {
  entries: entries.reduce<Record<string, Entry>>(
    (acc, data) => ({ ...acc, [data.id]: data }),
    {},
  ),
  drafts: {
    b: { id: 'b', data: 'entry_b_draft' },
  },
  indexes: {
    index: {
      meta: {},
      keys: ['a', 'b'],
    },
  },
};
