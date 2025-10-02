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

import { MemoryRouter, Location } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sampleSize from 'lodash/sampleSize';
import kebabCase from 'lodash/kebabCase';

import {
  ViewInApp,
  Apps,
  type AppName,
  type ViewInAppProps,
  type LinksConfig
} from './ViewInApp';
import RouteChecker from 'tests/router/RouteChecker';

const renderComponent = (props: Partial<ViewInAppProps>) => {
  const defaultProps = { links: {} };
  const completeProps = {
    ...defaultProps,
    ...props
  };

  const routerInfo: { location: Location | null; navigationType: string } = {
    location: null,
    navigationType: ''
  };

  const renderResult = render(
    <MemoryRouter initialEntries={['/']}>
      <ViewInApp {...completeProps} />
      <RouteChecker
        setLocation={(location) => (routerInfo.location = location)}
        setNavigationType={(navigationType) =>
          (routerInfo.navigationType = navigationType)
        }
      />
    </MemoryRouter>
  );

  return {
    ...renderResult,
    routerInfo
  };
};

const appLinkTuples = Object.keys(Apps).map(
  (appName) => [appName as AppName, `/${kebabCase(appName)}`] as const
);

const randomSampleSize = Math.ceil(Math.random() * appLinkTuples.length);
const tuplesSample = sampleSize(appLinkTuples, randomSampleSize);

const links = tuplesSample.reduce((result, tuple) => {
  const [appName, link] = tuple;

  return {
    ...result,
    [appName]: { url: link }
  };
}, {}) as LinksConfig;

describe('<ViewInApp />', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

  it('changes url using history push by default', async () => {
    const links = {
      genomeBrowser: {
        url: '/genome-browser'
      }
    };

    const { routerInfo } = renderComponent({ links });

    const appButtonContainer = screen.getByTestId('genomeBrowser');

    await userEvent.click(
      appButtonContainer.querySelector('button') as HTMLButtonElement
    );

    expect(routerInfo.location?.pathname).toBe(links.genomeBrowser.url);
    expect(routerInfo.navigationType).toBe('PUSH');
  });

  it('changes url using history replace with appropriate props', async () => {
    const links = {
      genomeBrowser: {
        url: '/genome-browser',
        replaceState: true
      }
    };

    const { routerInfo } = renderComponent({ links });

    const appButtonContainer = screen.getByTestId('genomeBrowser');

    await userEvent.click(
      appButtonContainer.querySelector('button') as HTMLButtonElement
    );

    expect(routerInfo.location?.pathname).toBe(links.genomeBrowser.url);
    expect(routerInfo.navigationType).toBe('REPLACE');
  });

  it('correctly handles links as functions', async () => {
    const genomeBrowserLinkFn = vi.fn();
    const links = {
      genomeBrowser: genomeBrowserLinkFn
    };

    renderComponent({ links });

    const appButtonContainer = screen.getByTestId('genomeBrowser');

    await userEvent.click(
      appButtonContainer.querySelector('button') as HTMLButtonElement
    );

    expect(genomeBrowserLinkFn).toHaveBeenCalled();
  });

  describe('onClick behaviour', () => {
    it('calls a click handler associated with a single app', async () => {
      const links = {
        entityViewer: { url: '/entity-viewer' },
        genomeBrowser: { url: '/genome-browser' }
      };
      const clickHandlerMock = vi.fn();
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

      await userEvent.click(entityViewerButton);
      expect(clickHandlerMock).not.toHaveBeenCalled(); // <-- because click handler is associated with genome browser button

      await userEvent.click(genomeBrowserButton);
      expect(clickHandlerMock).toHaveBeenCalled();
    });

    it('calls a click handler associated with any app', async () => {
      const links = {
        entityViewer: { url: '/entity-viewer' },
        genomeBrowser: { url: '/genome-browser' }
      };
      const clickHandlerMock = vi.fn();
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

      await userEvent.click(entityViewerButton);
      expect(clickHandlerMock).toHaveBeenCalledTimes(1);

      await userEvent.click(genomeBrowserButton);
      expect(clickHandlerMock).toHaveBeenCalledTimes(2);
    });
  });
});
