import React from 'react';
import { mount } from 'enzyme';

import SearchField from './SearchField';
import Input from 'src/shared/input/Input';

describe('<SearchField />', () => {
  const commonProps = {
    search: '',
    onChange: jest.fn(),
    onSubmit: jest.fn()
  };

  const getMountedComponent = (props: any) => mount(<SearchField {...props} />);

  describe('rendering', () => {
    test('renders an Input element', () => {
      const mountedComponent = getMountedComponent(commonProps);
      expect(mountedComponent.find(Input).length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('calls onSubmit passing it the search value if enter is pressed', () => {
      const mountedComponent = getMountedComponent(commonProps);
      const event = new CustomEvent('keypress', {
        detail: { key: 'Enter', keyCode: 13 }
      });
      console.log(mountedComponent.find('input').getDOMNode());
      mountedComponent
        .find('input')
        .getDOMNode()
        .dispatchEvent(event);

      console.log(commonProps.onSubmit.mock.calls);
    });
  });
});
