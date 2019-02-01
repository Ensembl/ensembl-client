import React from 'react';
import { withRouter, RouteComponentProps, MemoryRouter } from 'react-router';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';

import { LaunchbarContainer } from './LaunchbarContainer';

describe('<LaunchbarContainer />', () => {
  let wrapper: any;
  let changeCurrentAppFn = jest.fn();

  beforeEach(() => {
    const WrappedComponent = withRouter((props: RouteComponentProps) => (
      <LaunchbarContainer
        changeCurrentApp={changeCurrentAppFn}
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

  test('contains <Launchbar />', () => {
    expect(wrapper.find('.launchbar')).toHaveLength(1);
  });

  test('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
