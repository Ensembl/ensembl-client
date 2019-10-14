import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import faker from 'faker';

import ZmenuContent, {
  ZmenuContentProps,
  ZmenuContentItem,
  ZmenuContentItemProps
} from './ZmenuContent';

import configureStore from 'src/store';
import { Markup } from './zmenu-types';
import { createZmenuContent } from 'tests/fixtures/browser';

describe('<ZmenuContent />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const store = configureStore();
  const defaultProps: ZmenuContentProps = {
    content: createZmenuContent()
  };

  const wrappingComponent = (props: any) => (
    <Provider store={store}>{props.children}</Provider>
  );

  const mountZmenuContent = () =>
    mount(<ZmenuContent {...defaultProps} />, {
      wrappingComponent
    });

  describe('rendering', () => {
    test('renders zmenu content feature', () => {
      const wrapper = mountZmenuContent();
      expect(wrapper.find('.zmenuContentFeature')).toHaveLength(1);
    });

    test('renders zmenu content line', () => {
      const wrapper = mountZmenuContent();
      expect(wrapper.find('.zmenuContentLine')).toHaveLength(1);
    });

    test('renders zmenu content block', () => {
      const wrapper = mountZmenuContent();
      expect(wrapper.find('.zmenuContentBlock')).toHaveLength(2);
    });
  });

  describe('behaviour', () => {
    test('changes focus feature when feature link is clicked', () => {
      const props: ZmenuContentItemProps = {
        id: faker.lorem.words(),
        markup: [Markup.FOCUS],
        text: faker.lorem.words(),
        changeFocusObject: jest.fn()
      };

      const wrapper = mount(<ZmenuContentItem {...props} />);

      wrapper.simulate('click');
      expect(wrapper.props().changeFocusObject).toHaveBeenCalledTimes(1);
    });
  });
});
