import faker from 'faker';
import times from 'lodash/times';

import LRUCache from '../lruCache';

describe('LRUCache', () => {
  it('can store items', () => {
    const cache = new LRUCache();
    const items = times(10, () => ({
      key: faker.random.uuid(),
      value: faker.lorem.words()
    }));
    items.forEach(({ key, value }) => {
      cache.set(key, value);
    });

    items.forEach(({ key, value }) => {
      expect(cache.get(key)).toBe(value);
    });
  });

  it('removes the least recently used item from cache', () => {
    const cache = new LRUCache({ size: 10 });
    const items = times(11, () => ({
      key: faker.random.uuid(),
      value: faker.lorem.words()
    }));
    items.forEach(({ key, value }) => {
      cache.set(key, value);
    });

    expect(cache.get(items[0].key)).toBeUndefined();
    items.slice(1).forEach(({ key, value }) => {
      expect(cache.get(key)).toBe(value);
    });
  });

  it('invalidates cached item if it’s gone stale', () => {
    const cache = new LRUCache({ maxAge: 1000 });
    const item = { key: faker.random.uuid(), value: faker.lorem.words() };
    const timestamp = Date.now();
    cache.set(item.key, item.value);

    jest.spyOn(global.Date, 'now').mockImplementation(() => timestamp + 1);

    // value can be retrieved before cache has gone stale
    // (btw, notice that accessing a value from cache will reset its timestamp)
    expect(cache.get(item.key)).toBe(item.value);

    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => timestamp + 1000 + 2);

    expect(cache.get(item.key)).toBeUndefined();
  });
});
