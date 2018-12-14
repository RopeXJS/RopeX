import { ropex } from '..';
import { baseState } from './utils';
import { RopexState } from '../types';

describe('Ropex', () => {
  test('ropex.empty() should return empty state', () => {
    const expectedState: RopexState<{}, string> = {
      entries: {},
      indexes: {},
      drafts: {},
    };

    expect(ropex.empty()).toEqual(expectedState);
  });

  it('Should leave original state untouched', () => {
    const stateCopy = JSON.parse(JSON.stringify(baseState));

    ropex(baseState)
      .mapEntries(entry => ({ ...entry, data: 'test' }))
      .done();

    expect(baseState).toEqual(stateCopy);
  });

  it('Should return state', () => {
    expect(ropex(baseState).done()).toEqual(baseState);
  });
});
