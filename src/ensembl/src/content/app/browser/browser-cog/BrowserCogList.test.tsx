/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { render } from '@testing-library/react';
import faker from 'faker';

import { BrowserCogList } from './BrowserCogList';
import GenomeBrowserService from 'src/content/app/browser/browser-messaging-service';
jest.mock('./BrowserCog', () => () => <div id="browserCog" />);

const genomeBrowserService = new GenomeBrowserService('foo');

describe('<BrowserCogList />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    browserActivated: true,
    browserCogList: 0,
    browserCogTrackList: { 'track:gc': faker.datatype.number() },
    trackConfigNames: {},
    trackConfigLabel: {},
    selectedCog: faker.lorem.words(),
    updateCogList: jest.fn(),
    updateCogTrackList: jest.fn(),
    updateSelectedCog: jest.fn()
  };

  describe('rendering', () => {
    it('contains <BrowserCog /> when browser is activated', () => {
      const { container } = render(<BrowserCogList {...defaultProps} />);
      expect(container.querySelector('#browserCog')).toBeTruthy();
    });

    it('does not contain <BrowserCog /> when browser is not activated', () => {
      const { container } = render(
        <BrowserCogList {...defaultProps} browserActivated={false} />
      );
      expect(container.querySelector('#browserCog')).toBeFalsy();
    });
  });

  describe('behaviour', () => {
    it('sends navigation message when track name setting in browser cog is updated', () => {
      jest.spyOn(genomeBrowserService, 'send');

      const { rerender } = render(<BrowserCogList {...defaultProps} />);
      (genomeBrowserService.send as any).mockReset();

      rerender(
        <BrowserCogList
          {...defaultProps}
          trackConfigNames={{ 'track:gc': true }}
        />
      );
      expect(genomeBrowserService.send).toHaveBeenLastCalledWith('bpane', {
        off: [],
        on: ['track:gc:label', 'track:gc:names']
      });

      // Notice that the ":names" and ":label" suffixes, counterintuitively, mean the opposite
      // See a comment in BrowserCogList for explanation
      // We expect this to be fixed later on.
      rerender(
        <BrowserCogList
          {...defaultProps}
          trackConfigNames={{ 'track:gc': false }}
        />
      );
      expect(genomeBrowserService.send).toHaveBeenLastCalledWith('bpane', {
        off: ['track:gc:label'],
        on: ['track:gc:names']
      });
    });

    it('sends navigation message when track label setting in browser cog is updated', () => {
      jest.spyOn(genomeBrowserService, 'send');

      const { rerender } = render(<BrowserCogList {...defaultProps} />);
      (genomeBrowserService.send as any).mockReset();

      rerender(
        <BrowserCogList
          {...defaultProps}
          trackConfigLabel={{ 'track:gc': true }}
        />
      );
      expect(genomeBrowserService.send).toHaveBeenLastCalledWith('bpane', {
        off: ['track:gc:label'],
        on: ['track:gc:names']
      });

      // Notice that the ":names" and ":label" suffixes, counterintuitively, mean the opposite
      // See a comment in BrowserCogList for explanation
      // We expect this to be fixed later on.
      rerender(
        <BrowserCogList
          {...defaultProps}
          trackConfigLabel={{ 'track:gc': false }}
        />
      );
      expect(genomeBrowserService.send).toHaveBeenLastCalledWith('bpane', {
        off: ['track:gc:label', 'track:gc:names'],
        on: []
      });
    });
  });
});
