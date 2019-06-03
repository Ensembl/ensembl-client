import faker from 'faker';
import windowService from 'src/services/window-service';

import { ensureAbsoluteUrl } from '../urlHelper';

describe('ensureAbsoluteUrl', () => {
  const protocol = `${faker.internet.protocol()}:`;
  const host = faker.internet.domainName();
  const mockAbsoluteUrl = faker.internet.url();
  const mockRelativePath = `/${faker.lorem.word()}/${faker.lorem.word()}`;

  const mockLocation: any = {
    protocol,
    host
  };

  jest
    .spyOn(windowService, 'getLocation')
    .mockImplementation(() => mockLocation);

  it('does not change absolute urls', () => {
    expect(ensureAbsoluteUrl(mockAbsoluteUrl)).toBe(mockAbsoluteUrl);
  });

  it('changes relative url to absolute url', () => {
    const expectedUrl = `${protocol}//${host}${mockRelativePath}`;
    expect(ensureAbsoluteUrl(mockRelativePath)).toBe(expectedUrl);
  });
});
