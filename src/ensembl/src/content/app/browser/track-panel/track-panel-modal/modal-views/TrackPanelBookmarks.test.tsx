import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import { createEnsObject } from 'tests/fixtures/ens-object';
import {
  TrackPanelBookmarks,
  PreviouslyViewedLinks,
  ExampleLinks
} from './TrackPanelBookmarks';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <div {...props} className={'link'}>
      {props.children}
    </div>
  )
}));

const createPreviouslyViewedLinks = () => ({
  genome_id: faker.random.word(),
  object_id: faker.random.word(),
  object_type: faker.random.word(),
  label: faker.random.word(),
  location: {
    start: faker.random.number(),
    end: faker.random.number(),
    chromosome: faker.random.word()
  },
  trackStates: {}
});

const closeTrackPanelModalMock = jest.fn();
const updateTrackStatesMock = jest.fn();
const fetchExampleEnsObjectsMock = jest.fn();

describe('<TrackPanelBookmarks />', () => {
  const numberOfExampleObjects = faker.random.number({ min: 5, max: 10 });
  const numberOfPreviouslyViewedObjects = faker.random.number({
    min: 5,
    max: 10
  });

  const props = {
    activeGenomeId: faker.random.word(),
    exampleEnsObjects: times(numberOfExampleObjects, () => createEnsObject()),
    previouslyViewedObjects: times(numberOfPreviouslyViewedObjects, () =>
      createPreviouslyViewedLinks()
    ),
    fetchExampleEnsObjects: fetchExampleEnsObjectsMock,
    updateTrackStates: updateTrackStatesMock,
    closeTrackPanelModal: closeTrackPanelModalMock
  };

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<TrackPanelBookmarks {...props} />);
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

  it('calls closeTrackPanelModal when a previously viewed object link is clicked', () => {
    const previouslyViewedLinksWrapper = wrapper.find(PreviouslyViewedLinks);

    previouslyViewedLinksWrapper
      .find('.link')
      .first()
      .simulate('click');

    expect(closeTrackPanelModalMock).toBeCalled();
  });

  it('renders correct number of links to example objects', () => {
    const exampleLinksWrapper = wrapper.find(ExampleLinks);

    expect(exampleLinksWrapper.find('div.link').length).toBe(
      numberOfExampleObjects
    );
  });

  it('calls closeTrackPanelModal when an example object link is clicked', () => {
    const exampleLinksWrapper = wrapper.find(ExampleLinks);
    exampleLinksWrapper
      .find('.link')
      .first()
      .simulate('click');

    expect(closeTrackPanelModalMock).toBeCalled();
  });
});
