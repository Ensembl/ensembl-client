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
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as router from 'connected-react-router';
import configureMockStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import sampleSize from 'lodash/sampleSize';

import { ViewInApp, AppName, Apps, ViewInAppProps, UrlObj } from './ViewInApp';

const mockStore = configureMockStore([thunk]);
const store: ReturnType<typeof mockStore> = mockStore({});

const renderComponent = (props: Partial<ViewInAppProps>) => {
  const defaultProps = { links: {} };
  const completeProps = {
    ...defaultProps,
    ...props
  };

  return render(
    <Provider store={store}>
      <ViewInApp {...completeProps} />
    </Provider>
  );
};

const appLinkTuples = Object.keys(Apps).map(
  (appName) => [appName as AppName, faker.internet.url()] as const
);

const randomSampleSize = Math.ceil(Math.random() * appLinkTuples.length);
const tuplesSample = sampleSize(appLinkTuples, randomSampleSize);

const links = tuplesSample.reduce((result, tuple) => {
  const [appName, link] = tuple;

  return {
    ...result,
    [appName]: { url: link }
  };
}, {}) as UrlObj;

describe('<ViewInApp />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns null if the links prop is empty', () => {
    const { container } = renderComponent({ links: {} });
    expect(container.innerHTML).toBeFalsy();
  });

  it('renders correct number of buttons', () => {
    const { container } = renderComponent({ links });
    expect(container.querySelectorAll('button')).toHaveLength(
      Object.keys(links).length
    );
  });

  it('changes url using history push by default', () => {
    jest
      .spyOn(router, 'push')
      .mockImplementation((link) => ({ type: 'push', link } as any));

    const links = {
      genomeBrowser: {
        url: faker.internet.url()
      }
    };

    renderComponent({ links });

    const appButtonContainer = screen.getByTestId('genomeBrowser');

    userEvent.click(
      appButtonContainer.querySelector('button') as HTMLButtonElement
    );

    expect(router.push).toHaveBeenCalledWith(links.genomeBrowser.url);
  });

  it('changes url using history replace with appropriate props', () => {
    jest
      .spyOn(router, 'replace')
      .mockImplementation((link) => ({ type: 'replace', link } as any));

    const links = {
      genomeBrowser: {
        url: faker.internet.url(),
        replaceState: true
      }
    };

    renderComponent({ links });

    const appButtonContainer = screen.getByTestId('genomeBrowser');

    userEvent.click(
      appButtonContainer.querySelector('button') as HTMLButtonElement
    );

    expect(router.replace).toHaveBeenCalledWith(links.genomeBrowser.url);
  });

  describe('onClick behaviour', () => {
    it('calls a click handler associated with a single app', () => {
      const links = {
        entityViewer: { url: 'http://foo.com' },
        genomeBrowser: { url: 'http://bar.com' }
      };
      const clickHandlerMock = jest.fn();
      const { getByTestId } = renderComponent({
        links,
        onAppClick: { genomeBrowser: clickHandlerMock }
      });
      const genomeBrowserButtonWrapper = getByTestId('genomeBrowser');
      const genomeBrowserButton = genomeBrowserButtonWrapper.querySelector(
        'button'
      ) as HTMLButtonElement;
      const entityViewerButtonWrapper = getByTestId('entityViewer');
      const entityViewerButton = entityViewerButtonWrapper.querySelector(
        'button'
      ) as HTMLButtonElement;

      userEvent.click(entityViewerButton);
      expect(clickHandlerMock).not.toHaveBeenCalled(); // <-- because click handler is associated with genome browser button

      userEvent.click(genomeBrowserButton);
      expect(clickHandlerMock).toHaveBeenCalled();
    });

    it('calls a click handler associated with any app', () => {
      const links = {
        entityViewer: { url: 'http://foo.com' },
        genomeBrowser: { url: 'http://bar.com' }
      };
      const clickHandlerMock = jest.fn();
      const { getByTestId } = renderComponent({
        links,
        onAnyAppClick: clickHandlerMock
      });
      const genomeBrowserButtonWrapper = getByTestId('genomeBrowser');
      const genomeBrowserButton = genomeBrowserButtonWrapper.querySelector(
        'button'
      ) as HTMLButtonElement;
      const entityViewerButtonWrapper = getByTestId('entityViewer');
      const entityViewerButton = entityViewerButtonWrapper.querySelector(
        'button'
      ) as HTMLButtonElement;

      userEvent.click(entityViewerButton);
      expect(clickHandlerMock).toHaveBeenCalledTimes(1);

      userEvent.click(genomeBrowserButton);
      expect(clickHandlerMock).toHaveBeenCalledTimes(2);
    });
  });
});
