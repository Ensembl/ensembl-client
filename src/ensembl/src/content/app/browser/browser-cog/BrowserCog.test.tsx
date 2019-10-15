import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import faker from 'faker';

import BrowserCog, { BrowserCogProps } from './BrowserCog';
import BrowserTrackConfig from '../browser-track-config/BrowserTrackConfig';

import configureStore from 'src/store';

describe('<BrowserCog />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserCogProps = {
    cogActivated: true,
    index: faker.lorem.words(),
    updateSelectedCog: jest.fn()
  };

  const store = configureStore();
  const wrappingComponent = (props: any) => (
    <Provider store={store}>{props.children}</Provider>
  );

  describe('rendering', () => {
    test('renders browser track config', () => {
      const wrapper = mount(<BrowserCog {...defaultProps} />, {
        wrappingComponent
      });
      expect(wrapper.find(BrowserTrackConfig).length).toBeGreaterThan(0);
    });
  });

  describe('behaviour', () => {
    test('toggles cog on click', () => {
      const wrapper = mount(<BrowserCog {...defaultProps} />, {
        wrappingComponent
      });
      wrapper
        .find('button')
        .first()
        .simulate('click');
      expect(wrapper.props().updateSelectedCog).toHaveBeenCalledTimes(1);
    });
  });
});
