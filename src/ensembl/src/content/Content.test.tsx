import React from 'react';
import {
  withRouter,
  RouteComponentProps,
  MemoryRouter
} from 'react-router-dom';
import { mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Content, getExpandClass } from './Content';

describe('<Content />', () => {
  let WrappedComponent: any;

  beforeEach(() => {
    WrappedComponent = withRouter((props: RouteComponentProps) => (
      <Content launchbarExpanded={true} {...props} />
    ));
  });

  describe('<main> element', () => {
    let wrapper: any;

    beforeEach(() => {});

    test('collapses correctly', () => {
      wrapper = mount(
        <MemoryRouter>
          <WrappedComponent />
        </MemoryRouter>
      );

      expect(
        getExpandClass(wrapper.find(Content).prop('launchbarExpanded'))
      ).toBe('');
    });

    test('expands correctly', () => {
      WrappedComponent = withRouter((props: RouteComponentProps) => (
        <Content launchbarExpanded={false} {...props} />
      ));

      wrapper = mount(
        <MemoryRouter>
          <WrappedComponent />
        </MemoryRouter>
      );

      expect(getExpandClass(wrapper.prop('launchbarExpanded'))).toBe(
        'expanded'
      );
    });
  });

  test('renders correctly', () => {
    const wrapper = render(
      <MemoryRouter>
        <WrappedComponent />
      </MemoryRouter>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
