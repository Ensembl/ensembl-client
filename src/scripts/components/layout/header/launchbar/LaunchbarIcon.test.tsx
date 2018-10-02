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

  let gotoAppFn: (appName: string) => void;
  let wrapper: any;

  beforeEach(() => {
    gotoAppFn = jest.fn();

    wrapper = shallow(
      <LaunchbarIcon app={app} gotoApp={gotoAppFn} currentApp={currentApp} />
    );
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

  test('should go to app on button click', () => {
    wrapper.find('button').simulate('click');

    expect(gotoAppFn).toHaveBeenCalled();
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
