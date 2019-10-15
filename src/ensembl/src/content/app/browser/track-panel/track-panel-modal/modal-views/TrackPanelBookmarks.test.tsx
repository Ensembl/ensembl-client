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

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { PreviouslyViewedObject } from '../../trackPanelState';

jest.mock('react-router-dom', () => ({
  Link: (props: any) => (
    <div {...props} className={'link'}>
      {props.children}
    </div>
  )
}));

const createPreviouslyViewedLink = (): PreviouslyViewedObject => ({
  genome_id: faker.random.word(),
  object_id: faker.random.word(),
  object_type: faker.random.word(),
  label: faker.random.word()
});

const closeTrackPanelModalMock = jest.fn();
const updateTrackStatesAndSaveMock = jest.fn();
const fetchExampleEnsObjectsMock = jest.fn();
const changeDrawerViewAndOpenMock = jest.fn();

describe('<TrackPanelBookmarks />', () => {
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
    fetchExampleEnsObjects: fetchExampleEnsObjectsMock,
    updateTrackStatesAndSave: updateTrackStatesAndSaveMock,
    closeTrackPanelModal: closeTrackPanelModalMock,
    changeDrawerViewAndOpen: changeDrawerViewAndOpenMock
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

  it('shows the ellipsis only when the total objects is more than 20', () => {
    const previouslyViewedObjects = times(20, () =>
      createPreviouslyViewedLink()
    );
    wrapper = mount(
      <TrackPanelBookmarks
        {...props}
        previouslyViewedObjects={previouslyViewedObjects}
      />
    );

    expect(wrapper.find(ImageButton)).toHaveLength(0);

    // Add another link to make it 21 links
    previouslyViewedObjects.push(createPreviouslyViewedLink());
    wrapper = mount(
      <TrackPanelBookmarks
        {...props}
        previouslyViewedObjects={previouslyViewedObjects}
      />
    );

    expect(wrapper.find(ImageButton)).toHaveLength(1);
  });

  it('calls changeDrawerViewAndOpen when the ellipsis is clicked', () => {
    const previouslyViewedObjects = times(21, () =>
      createPreviouslyViewedLink()
    );
    wrapper = mount(
      <TrackPanelBookmarks
        {...props}
        previouslyViewedObjects={previouslyViewedObjects}
      />
    );

    wrapper.find(ImageButton).simulate('click');

    expect(changeDrawerViewAndOpenMock).toBeCalled();
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
