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

import { MemoryRouter, type Location } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchMainView from './SearchMainView';
import RouteChecker from 'tests/router/RouteChecker';

const renderComponent = () => {
  const routerInfo: { location: Location | null } = {
    location: null
  };

  render(
    <MemoryRouter initialEntries={['/search']}>
      <SearchMainView />
      <RouteChecker
        setLocation={(location) => {
          routerInfo.location = location;
        }}
      />
    </MemoryRouter>
  );

  return routerInfo;
};

describe('<SearchMainView />', () => {
  it('navigates to search results on feature search submit', async () => {
    const routerInfo = renderComponent();
    const featureSearchInput = screen.getByPlaceholderText(
      'Gene, transcript or variant ID...'
    );

    await userEvent.type(featureSearchInput, 'TP53');

    const featureSearchForm = featureSearchInput.closest('form');
    await userEvent.click(
      within(featureSearchForm as HTMLFormElement).getByRole('button', {
        name: 'Find'
      })
    );

    expect(routerInfo.location?.pathname).toBe('/search/results');
    expect(routerInfo.location?.search).toBe('?query=TP53');
  });
});
