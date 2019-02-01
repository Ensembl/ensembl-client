import React from 'react';
import { mount } from 'enzyme';
import { withRouter, MemoryRouter, RouteComponentProps } from 'react-router';

import { App } from './App';

describe('<App />', () => {
  let changeCurrentAppFn: (name: string) => void;
  let WrappedComponent: any;
  let wrapper: any;

  beforeEach(() => {
    changeCurrentAppFn = jest.fn();

    WrappedComponent = withRouter((props: RouteComponentProps) => (
      <App changeCurrentApp={changeCurrentAppFn} {...props} />
    ));

    wrapper = mount(
      <MemoryRouter>
        <WrappedComponent />
      </MemoryRouter>
    );
  });

  describe('changes current app when', () => {
    test('mounted', () => {
      expect(changeCurrentAppFn).toHaveBeenCalled();
    });

    test('updated', () => {
      wrapper
        .find(App)
        .instance()
        .componentDidUpdate();

      expect(changeCurrentAppFn).toHaveBeenCalledTimes(2);
    });
  });
});
