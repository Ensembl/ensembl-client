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
  const props = {
    activeGenomeId: faker.random.word(),
    exampleEnsObjects: times(2, () => createEnsObject()),
    previouslyViewedObjects: times(2, () => createPreviouslyViewedLinks()),
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

  it('renders N number of previously viewed links based on the length of previously viewed objects', () => {
    const previouslyViewedLinksWrapper = wrapper.find(PreviouslyViewedLinks);

    expect(previouslyViewedLinksWrapper.find('div.link').length).toBe(2);
  });

  it('calls the closeTrackPanelModalMock when the link is clicked', () => {
    const previouslyViewedLinksWrapper = wrapper.find(PreviouslyViewedLinks);

    previouslyViewedLinksWrapper
      .find('div.link')
      .first()
      .simulate('click');

    expect(closeTrackPanelModalMock).toBeCalled();
  });

  it('renders N number of Links based on the length of example links', () => {
    const exampleLinksWrapper = wrapper.find(ExampleLinks);

    expect(exampleLinksWrapper.find('div.link').length).toBe(2);
  });

  it('calls the closeTrackPanelModalMock when the link is clicked', () => {
    const exampleLinksWrapper = wrapper.find(ExampleLinks);
    exampleLinksWrapper
      .find('div.link')
      .first()
      .simulate('click');

    expect(closeTrackPanelModalMock).toBeCalled();
  });
});
