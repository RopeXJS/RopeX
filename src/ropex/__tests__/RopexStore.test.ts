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
        ropex(baseState).mapEntry('a', entry => ({
          ...entry,
          data: 'test',
        })),
      ).toEqual({
        ...baseState,
        drafts: {
          ...baseState.drafts,
          a: { id: 'a', data: 'test' },
        },
      });
    });
  });
  describe('.mapEntries()', () => {
    it('Should apply map function to every entry and add result as draft', () => {
      expect(
        ropex(baseState).mapEntries(entry => ({
          ...entry,
          data: 'test',
        })),
      ).toEqual({
        ...baseState,
        drafts: {
          a: { id: 'a', data: 'test' },
          b: { id: 'b', data: 'test' },
        },
      });
    });
  });

  describe('.remove()', () => {
    it('Should remove an index from the state', () => {
      expect(ropex(baseState).remove('index')).toEqual(ropex.empty());
    });
  });
});
