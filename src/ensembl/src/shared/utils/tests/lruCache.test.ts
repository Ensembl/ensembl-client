import faker from 'faker';
import times from 'lodash/times';

import LRUCache from '../lruCache';

describe('LRUCache', () => {
  it('can store items', () => {
    const cache = new LRUCache();
    const items = times(10, (index) => ({
      key: `${index}`,
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
    // the test also demonstrates that the cache can handle multiple cycles
    // of replacement of its items
    const cache = new LRUCache({ size: 10 });
    const items = times(100, (index) => ({
      key: `${index}`,
      value: faker.lorem.words()
    }));
    items.forEach(({ key, value }) => {
      cache.set(key, value);
    });

    const itemsExpectedToBeDropped = items.slice(0, 90);
    const itemsExpectedToRemain = items.slice(90);
    itemsExpectedToBeDropped.forEach(({ key }) => {
      expect(cache.get(key)).toBeUndefined();
    });
    itemsExpectedToRemain.forEach(({ key, value }) => {
      expect(cache.get(key)).toBe(value);
    });
  });

  it('keeps items that have been recently accessed', () => {
    const cache = new LRUCache({ size: 10 });
    const items = times(11, (index) => ({
      key: `${index}`,
      value: faker.lorem.words()
    }));
    const extraItem = items.pop() as { key: string; value: string };
    items.forEach(({ key, value }) => {
      cache.set(key, value);
    });
    const oldestItem = items[0];
    const secondOldestItem = items[1];

    cache.get(oldestItem.key); // accessing the item that would have otherwise been dropped by the cache
    cache.set(extraItem.key, extraItem.value); // now second oldest item should have been dropped from cache

    expect(cache.get(oldestItem.key)).toBe(oldestItem.value);
    expect(cache.get(secondOldestItem.key)).toBeUndefined();
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
