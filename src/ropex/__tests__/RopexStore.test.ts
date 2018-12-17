import { ropex } from '..';
import { baseState, Entry } from './utils';
import { RopexState } from '../types';

describe('RopexStore', () => {
  describe('.gc()', () => {
    it('Should remove unused entries', () => {
      const state: RopexState<Entry, string> = {
        entries: {
          a: { id: 'a', data: 'test' },
          b: { id: 'b', data: 'test' },
          e: { id: 'e', data: '' },
        },
        drafts: {
          d: { id: 'd', data: 'test' },
          c: { id: 'c', data: 'test' },
          e: { id: 'e', data: 'test' },
        },
        indexes: {
          index: {
            meta: {},
            keys: ['a', 'c', 'e'],
          },
        },
      };
      expect(
        ropex(state)
          .gc()
          .done(),
      ).toEqual({
        entries: {
          a: { id: 'a', data: 'test' },
          e: { id: 'e', data: '' },
        },
        drafts: {
          c: { id: 'c', data: 'test' },
          e: { id: 'e', data: 'test' },
        },
        indexes: {
          index: {
            meta: {},
            keys: ['a', 'c', 'e'],
          },
        },
      });
    });
  });

  describe('.setEntry()', () => {
    it('Should update an existing entry in the store (and discard the draft)', () => {
      expect(
        ropex(baseState)
          .setEntry(
            {
              id: 'b',
              data: 'test',
            },
            'id',
          )
          .done(),
      ).toEqual({
        ...baseState,
        entries: {
          ...baseState.entries,
          b: { id: 'b', data: 'test' },
        },
        drafts: {},
      });
    });

    it("Shouldn't add an entry that's not in an index", () => {
      expect(
        ropex(baseState)
          .setEntry({ id: 'e', data: 'test' }, 'id')
          .done(),
      ).toEqual(baseState);
    });
  });

  describe('.mapEntry()', () => {
    it('Should apply map function to entry and add result as draft', () => {
      expect(
        ropex(baseState)
          .mapEntry('a', entry => ({
            ...entry,
            data: 'test',
          }))
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {
          ...baseState.drafts,
          a: { id: 'a', data: 'test' },
        },
      });
    });

    it('Should apply map function on drafts', () => {
      expect(
        ropex(baseState)
          .mapEntry('b', entry => ({ ...entry, data: entry.data + '_updated' }))
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {
          ...baseState.drafts,
          b: { id: 'b', data: 'entry_b_draft_updated' },
        },
      });
    });

    it('Should update the entries and clear the drafts if the option is set', () => {
      expect(
        ropex(baseState)
          .mapEntry(
            'b',
            entry => ({
              ...entry,
              data: entry.data + '_updated',
            }),
            { draft: false },
          )
          .done(),
      ).toEqual({
        ...baseState,
        entries: {
          ...baseState.entries,
          b: { id: 'b', data: 'entry_b_draft_updated' },
        },
        drafts: {},
      });
    });
  });
  describe('.mapEntries()', () => {
    it('Should apply map function to every entry and add result as draft', () => {
      expect(
        ropex(baseState)
          .mapEntries(entry => ({
            ...entry,
            data: 'test',
          }))
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {
          a: { id: 'a', data: 'test' },
          b: { id: 'b', data: 'test' },
        },
      });
    });

    it('Should apply map function on drafts', () => {
      expect(
        ropex(baseState)
          .mapEntries(entry => ({
            ...entry,
            data: entry.data + '_updated',
          }))
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {
          a: { id: 'a', data: 'entry_a_updated' },
          b: { id: 'b', data: 'entry_b_draft_updated' },
        },
      });
    });

    it('Should update entries and clear drafts if draft is false', () => {
      expect(
        ropex(baseState)
          .mapEntries(entry => ({ ...entry, data: 'test' }), { draft: false })
          .done(),
      ).toEqual({
        ...baseState,
        entries: {
          a: { id: 'a', data: 'test' },
          b: { id: 'b', data: 'test' },
        },
        drafts: {},
      });
    });
  });

  describe('.remove()', () => {
    it('Should remove an index from the state', () => {
      expect(
        ropex(baseState)
          .remove('index')
          .done(),
      ).toEqual(ropex.empty());
    });
  });

  describe('.getEntry()', () => {
    it('Should get entry by key', () => {
      expect(ropex(baseState).getEntry('a')).toEqual({
        id: 'a',
        data: 'entry_a',
      });
    });

    it('Should get draft entry by key', () => {
      expect(ropex(baseState).getEntry('b')).toEqual({
        id: 'b',
        data: 'entry_b_draft',
      });
    });
  });

  describe('.getEntries()', () => {
    it('Should get all entries and drafts', () => {
      expect(
        ropex<Entry, string>({
          ...baseState,
          drafts: {
            ...baseState.drafts,
            c: { id: 'c', data: 'test' },
          },
        }).getEntries(),
      ).toEqual({
        a: {
          id: 'a',
          data: 'entry_a',
        },
        b: {
          id: 'b',
          data: 'entry_b_draft',
        },
        c: {
          id: 'c',
          data: 'test',
        },
      });
    });
  });
});
