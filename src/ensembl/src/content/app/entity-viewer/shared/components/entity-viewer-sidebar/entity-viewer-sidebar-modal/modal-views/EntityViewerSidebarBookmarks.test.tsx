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
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import { createEnsObject } from 'tests/fixtures/ens-object';
import {
  EntityViewerSidebarBookmarks,
  PreviouslyViewedLinks,
  ExampleLinks
} from './EntityViewerSidebarBookmarks';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { PreviouslyViewedObject } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <div {...props} className={'link'}>
      {props.children}
    </div>
  )
}));

const createPreviouslyViewedLink = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: `${faker.random.word()}:gene:${faker.random.uuid()}`,
  object_type: 'gene',
  label: faker.random.word()
});

const closeSidebarModal = jest.fn();
const fetchExampleEnsObjects = jest.fn();


const mockState = {
  genome: {
    genomeInfoData: {
      'human': {
        example_objects: [
          {
            id: 'human-brca2',
            type: 'gene'
          }
        ]
      }
    },
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
          stable_id: 'human-another',
          label: 'FRY',
          type: 'gene'
        }
      ]
    }
  }
};

describe('<EntityViewerSidebarBookmarks />', () => {
  const numberOfExampleObjects = faker.random.number({ min: 5, max: 10 });
  const numberOfPreviouslyViewedObjects = faker.random.number({
    min: 5,
    max: 20
  });

  const props = {
    activeGenomeId: faker.random.word(),
    exampleEnsObjects: times(numberOfExampleObjects, () => createEnsObject()),
    previouslyViewedObjects: times(numberOfPreviouslyViewedObjects, () =>
      createPreviouslyViewedLink()
    ),
    fetchExampleEnsObjects,
    closeSidebarModal
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<EntityViewerSidebarBookmarks />);
    jest.resetAllMocks();
  });

  it('renders without any error', () => {
    expect(wrapper).toHaveLength(1);
  });

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
});
