import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Launchbar from './Launchbar';
import LaunchbarIcon from './LaunchbarIcon';

import {
  launchbarConfig,
  LaunchbarCategory,
  LaunchbarApp
} from '../../../../configs/launchbarConfig';

describe('<Launchbar />', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<Launchbar currentApp={''} launchbarExpanded={true} />);
  });

  describe('renders', () => {
    test('with launchbar when expanded', () => {
      expect(wrapper.find('.launchbar')).toHaveLength(1);
    });

    test('without launchbar when collapsed', () => {
      wrapper.setProps({ launchbarExpanded: false });

      expect(wrapper.find('.launchbar')).toHaveLength(0);
    });

    describe('icons for', () => {
      test('about app', () => {
        const appProp: LaunchbarApp = wrapper
          .find('.about-app-icon')
          .find(LaunchbarIcon)
          .prop('app');

        expect(appProp.name).toBe(launchbarConfig.about.name);
      });

      launchbarConfig.categories.forEach((category: LaunchbarCategory) => {
        test(`${category.name} category apps`, () => {
          category.apps.forEach((app: LaunchbarApp) => {
            const appProp: LaunchbarApp = wrapper
              .find(`.${app.name}-app-icon`)
              .find(LaunchbarIcon)
              .prop('app');

            expect(appProp.name).toBe(app.name);
          });
        });
      });
    });

    test('about icon separate of other categories', () => {
      expect(wrapper.find('.launchbar > .categories-wrapper')).toHaveLength(1);
      expect(wrapper.find('.launchbar > .about')).toHaveLength(1);
    });

    test('correctly', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  test('shows border for categories with separator', () => {
    expect(wrapper.instance().getCategoryClass(true)).toBe('border');
  });

  test('shows no border for categories without separator', () => {
    expect(wrapper.instance().getCategoryClass(false)).toBe('');
  });
});
