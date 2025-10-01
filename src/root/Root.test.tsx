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

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import createRootReducer from 'src/root/rootReducer';

import useRestoredReduxState from './useRestoredReduxState';
import { updateBreakpointWidth } from 'src/global/globalSlice';

import { Root } from './Root';
import privacyBannerService from '../shared/components/privacy-banner/privacy-banner-service';
import windowService from 'src/services/window-service';

import { mockMatchMedia } from 'tests/mocks/mockWindowService';

vi.mock('../content/app/App', () => () => <div id="app" />);
vi.mock('../shared/components/privacy-banner/PrivacyBanner', () => () => (
  <div className="privacyBanner">PrivacyBanner</div>
));
vi.mock('../global/globalSlice', () => ({
  updateBreakpointWidth: vi.fn(() => ({ type: 'updateBreakpointWidth' }))
}));
vi.mock('./useRestoredReduxState', () => vi.fn());
vi.mock(
  'src/content/app/tools/blast/state/blast-results/blastResultsSlice',
  () => ({
    restoreBlastSubmissions: vi.fn(() => ({
      type: 'restoreBlastSubmissions'
    }))
  })
);

describe('<Root />', () => {
  const getRenderedRoot = () => {
    const store = configureStore({
      reducer: createRootReducer()
    });

    return render(
      <Provider store={store}>
        <Root />
      </Provider>
    );
  };

  beforeEach(() => {
    vi.spyOn(windowService, 'getMatchMedia').mockImplementation(
      mockMatchMedia as any
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('contains App', () => {
    const { container } = getRenderedRoot();
    expect(container.querySelector('#app')).toBeTruthy();
  });

  it('runs a function to restore redux state', () => {
    getRenderedRoot();
    expect(useRestoredReduxState).toHaveBeenCalled(); // it might be called a couple of itmes, because the component may rerender; this is fine
  });

  it('calls updateBreakpointWidth on mount', () => {
    getRenderedRoot();
    expect(updateBreakpointWidth).toHaveBeenCalledTimes(1);
  });

  it('shows privacy banner if privacy policy version is not set or if version does not match', () => {
    vi.spyOn(privacyBannerService, 'shouldShowBanner').mockImplementation(
      () => true
    );
    const { container } = getRenderedRoot();
    expect(container.querySelector('.privacyBanner')).toBeTruthy();
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });

  it('does not show privacy banner if policy version is set', () => {
    vi.spyOn(privacyBannerService, 'shouldShowBanner').mockImplementation(
      () => false
    );
    const { container } = getRenderedRoot();
    expect(container.querySelector('.privacyBanner')).toBeFalsy();
    (privacyBannerService.shouldShowBanner as any).mockRestore();
  });
});
