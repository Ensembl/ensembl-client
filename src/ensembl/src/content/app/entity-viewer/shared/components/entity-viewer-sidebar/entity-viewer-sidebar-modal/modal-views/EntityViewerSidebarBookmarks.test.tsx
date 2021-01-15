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
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { EntityViewerSidebarBookmarks } from './EntityViewerSidebarBookmarks';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <a className={'link'} href={props.to}>
      {props.children}
    </a>
  )
}));

const mockStore = configureMockStore();

const exampleObjects = [
  {
    id: 'human-brca2',
    type: 'gene'
  }
];

const mockState = {
  genome: {
    genomeInfo: {
      genomeInfoData: {
        human: {
          example_objects: exampleObjects
        }
      }
    }
  },
  entityViewer: {
    general: {
      activeGenomeId: 'human',
      activeEnsObjectIds: {
        human: 'human-braf'
      }
    },
    bookmarks: {
      previouslyViewed: [
        {
          stable_id: 'human-fry',
          label: 'FRY',
          type: 'gene'
        },
        {
          stable_id: 'human-tp53',
          label: 'TP53',
          type: 'gene'
        }
      ]
    }
  }
};

const wrapInRedux = (state: typeof mockState = mockState) => {
  return render(
    <Provider store={mockStore(state)}>
      <EntityViewerSidebarBookmarks />
    </Provider>
  );
};

describe('<EntityViewerSidebarBookmarks />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows example links if they are present', () => {
    wrapInRedux();
    const exampleLinksSection = screen.getByTestId('example links');
    const links = exampleLinksSection.querySelectorAll('a');

    expect(links.length).toBe(exampleObjects.length);
  });
});

/*

  it('renders correct number of previously viewed links', () => {
    const previouslyViewedLinksWrapper = wrapper.find(PreviouslyViewedLinks);

    expect(previouslyViewedLinksWrapper.find('.link').length).toBe(
      numberOfPreviouslyViewedObjects
    );
  });

  it('calls closeSidebarModal when a previously viewed object link is clicked', () => {
    const previouslyViewedLinksWrapper = wrapper.find(PreviouslyViewedLinks);

    previouslyViewedLinksWrapper.find('.link').first().simulate('click');

    expect(closeSidebarModal).toBeCalled();
  });

  it('shows the ellipsis only when the total objects is more than 20', () => {
    const previouslyViewedObjects = times(20, () =>
      createPreviouslyViewedLink()
    );
    wrapper = mount(
      <EntityViewerSidebarBookmarks/>
    );

    expect(wrapper.find(ImageButton)).toHaveLength(0);

    // Add another link to make it 21 links
    previouslyViewedObjects.push(createPreviouslyViewedLink());
    wrapper = mount(
      <EntityViewerSidebarBookmarks />
    );

    expect(wrapper.find(ImageButton)).toHaveLength(1);
  });

  it('renders correct number of links to example objects', () => {
    const exampleLinksWrapper = wrapper.find(ExampleLinks);

    expect(exampleLinksWrapper.find('div.link').length).toBe(
      numberOfExampleObjects
    );
  });

  it('calls closeSidebarModal when an example object link is clicked', () => {
    const exampleLinksWrapper = wrapper.find(ExampleLinks);
    exampleLinksWrapper.find('.link').first().simulate('click');

    expect(closeSidebarModal).toBeCalled();
  });

*/
