import { baseState, Entry, entries } from './utils';
import { ropex } from '..';
import { RopexState } from '../types';

describe('RopexIndex', () => {
  // getters
  describe('.getAll()', () => {
    it('Should get all entries in the index (merging in drafts)', () => {
      expect(
        ropex(baseState)
          .index('index')
          .getAll(),
      ).toEqual([entries[0], { id: 'b', data: 'entry_b_draft' }]);
    });
  });

  describe('.getMetaData', () => {
    const state = {
      ...baseState,
      indexes: {
        index: {
          ...baseState.indexes.index,
          meta: {
            attr: 'test',
          },
        },
      },
    };

    it('Should return the valid data', () => {
      expect(
        ropex(state)
          .index('index')
          .getMetaData('test'),
      ).toEqual('test');
    });

    it("Should return undefined if the meta-data field doesn't exist", () => {
      expect(
        ropex(state)
          .index('index')
          .getMetaData('invalid'),
      ).toEqual(undefined);
    });

    it("Should return default parameter if meta-data field doesn't exist", () => {
      expect(
        ropex(state)
          .index('index')
          .getMetaData('invalid', 'default'),
      ).toEqual('default');
    });
  });

  // setters
  describe('.setEntries()', () => {
    it('Should set all the entries of the index (and wipe the drafts)', () => {
      expect(
        ropex(ropex.empty())
          .index('index')
          .setEntries(entries, 'id')
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {},
      });
    });
  });

  describe('.setEntry()', () => {
    it('Should set a specific entry', () => {
      expect(
        ropex(baseState)
          .index('index')
          .setEntry({ id: 'a', data: 'test' }, 'id')
          .done(),
      ).toEqual({
        ...baseState,
        entries: { a: { id: 'a', data: 'test' }, b: entries[1] },
      });
    });

    it('Should set a specific entry and wipe its draft', () => {
      expect(
        ropex(baseState)
          .index('index')
          .setEntry({ id: 'b', data: 'test' }, 'id')
          .done(),
      ).toEqual({
        ...baseState,
        entries: { a: entries[0], b: { id: 'b', data: 'test' } },
        drafts: {},
      });
    });
  });

  describe('.addEntries()', () => {
    it('Should add all the entries to the index', () => {
      expect(
        ropex<Entry, string>({ ...baseState, entries: {} })
          .index('index')
          .addEntries(entries, 'id')
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {},
      });
    });
  });

  describe('.addEntry()', () => {
    it('Should add a specific entry to the index', () => {
      expect(
        ropex<Entry, string>({ ...baseState, entries: {} })
          .index('index')
          .addEntry(entries[0], 'id')
          .done(),
      ).toEqual({ ...baseState, entries: { a: entries[0] } });
    });
  });

  describe('.setMetaData()', () => {
    it('Should set the meta-data field of an index', () => {
      expect(
        ropex(baseState)
          .index('index')
          .setMetaData('test', 10)
          .done(),
      ).toEqual({
        ...baseState,
        indexes: {
          index: {
            ...baseState.indexes.index,
            meta: {
              test: 10,
            },
          },
        },
      });
    });
  });

  describe('.mapEntry()', () => {
    it('Should update the entry and apply it to the state as a draft', () => {
      expect(
        ropex({ ...baseState, drafts: {} })
          .index('index')
          .mapEntry('a', entry => ({ ...entry, data: 'test' }))
          .done(),
      ).toEqual({
        ...baseState,
        drafts: {
          a: {
            id: 'a',
            data: 'test',
          },
        },
      });
    });

    it("Shouldn't update the entry if it's not in the index", () => {
      const state = {
        ...baseState,
        drafts: { c: { id: 'c', data: 'test' } },
        indexes: {
          ...baseState.indexes,
          test: {
            meta: {},
            keys: ['c'],
          },
        },
      };
      expect(
        ropex(state)
          .index('index')
          .mapEntry('c', entry => ({ ...entry, data: 'test' }))
          .done(),
      ).toEqual(state);
    });
  });

  describe('.mapEntries()', () => {
    it('Should update all entries in the index and add them to the state as drafts', () => {
      const state = {
        ...baseState,
        entries: {
          ...baseState.entries,
          c: { id: 'c', data: 'test' },
        },
        indexes: {
          index: baseState.indexes.index,
          other: {
            meta: {},
            keys: ['c'],
          },
        },
      };

      const expectedState = {
        ...state,
        drafts: {
          a: { id: 'a', data: 'test' },
          b: { id: 'b', data: 'test' },
        },
      };

      expect(
        ropex<Entry, string>(state)
          .index('index')
          .mapEntries(entry => ({ ...entry, data: 'test' }))
          .done(),
      ).toEqual(expectedState);
    });
  });

  describe('.remove()', () => {
    it('Should remove the index and apply the garbage collector', () => {
      const inputState: RopexState<Entry, string> = {
        ...baseState,
        indexes: { a: { meta: {}, keys: ['a'] }, b: { meta: {}, keys: ['b'] } },
        drafts: {},
      };
      const expectedState: RopexState<Entry, string> = {
        entries: { b: { id: 'b', data: 'entry_b' } },
        indexes: { b: { meta: {}, keys: ['b'] } },
        drafts: {},
      };

      expect(
        ropex(inputState)
          .index('a')
          .remove()
          .done(),
      ).toEqual(expectedState);
    });
  });
});
