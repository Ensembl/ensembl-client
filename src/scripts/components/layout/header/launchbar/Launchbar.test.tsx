import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import {
  MemoryRouter,
  RouteComponentProps,
  withRouter
} from 'react-router-dom';

import { Launchbar } from './Launchbar';

describe('<Launchbar />', () => {
  let wrapper: any;

  beforeEach(() => {
    const changeCurrentApp: (currentApp: string) => void = jest.fn();

    const WrappedComponent: any = withRouter((props: RouteComponentProps) => (
      <Launchbar
        changeCurrentApp={changeCurrentApp}
        currentApp={''}
        launchbarExpanded={true}
        {...props}
      />
    ));

    wrapper = render(
      <MemoryRouter>
        <WrappedComponent />
      </MemoryRouter>
    );
  });

  test('renders about icon separate of other categories', () => {
    expect(wrapper.find('.launchbar > .categories-wrapper')).toHaveLength(1);
    expect(wrapper.find('.launchbar > .about')).toHaveLength(1);
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
