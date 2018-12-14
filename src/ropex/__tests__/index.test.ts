import { ropex } from '..';
import { baseState } from './utils';

describe('Ropex', () => {
  test('ropex.empty() should return empty state', () => {
    expect(ropex.empty()).toEqual({
      entries: {},
      indexes: {},
    });
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
