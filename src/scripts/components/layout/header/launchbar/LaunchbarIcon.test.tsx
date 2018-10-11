import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import {
  launchbarConfig,
  LaunchbarApp
} from '../../../../configs/launchbarConfig';

import LaunchbarIcon from './LaunchbarIcon';

describe('<LaunchbarIcon />', () => {
  const currentApp: string = 'about';
  const app: LaunchbarApp = Object.assign({}, launchbarConfig.about, {
    icon: {
      default: '/assets/img/launchbar/ensembl.svg',
      selected: '/assets/img/launchbar/ensembl-selected.svg'
    }
  });

  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<LaunchbarIcon app={app} currentApp={currentApp} />);
  });

  test('displays selected icon if current app', () => {
    expect(wrapper.instance().getAppIcon()).toEqual(
      expect.stringContaining('selected')
    );
  });

  test('displays selected icon if not current app', () => {
    wrapper.setProps({ currentApp: 'browser' });

    expect(wrapper.instance().getAppIcon()).not.toEqual(
      expect.stringContaining('selected')
    );
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
