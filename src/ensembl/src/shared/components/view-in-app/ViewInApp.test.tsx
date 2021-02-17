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

import { ViewInApp, AppName, Apps, ViewInAppProps, LinkObj } from './ViewInApp';

jest.mock('connected-react-router');

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
    [appName]: link
  };
}, {}) as Record<AppName, string>;

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

  it('calls replace with the passed links', () => {
    jest
      .spyOn(router, 'replace')
      .mockImplementation((link) => ({ type: 'replace', link } as any));
    const linksWithReplaceState = tuplesSample.reduce((result, tuple) => {
      const [appName, link] = tuple;

      return {
        ...result,
        [appName]: {
          url: link,
          replaceState: true
        }
      };
    }, {}) as Record<AppName, LinkObj>;

    renderComponent({ links: linksWithReplaceState });

    tuplesSample.forEach(([appName, link]) => {
      const appButtonContainer = screen.getByTestId(appName);

      userEvent.click(
        appButtonContainer.querySelector('button') as HTMLButtonElement
      );

      expect(router.replace).toHaveBeenLastCalledWith(link);
    });
  });
});
