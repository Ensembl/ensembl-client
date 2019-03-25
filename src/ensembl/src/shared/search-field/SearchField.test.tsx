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

  afterEach(() => {
    jest.resetAllMocks();
  });

  const getMountedComponent = (props: any) => mount(<SearchField {...props} />);

  describe('rendering', () => {
    test('renders an Input element', () => {
      const mountedComponent = getMountedComponent(commonProps);
      expect(mountedComponent.find(Input).length).toBe(1);
    });
  });

  describe('behaviour', () => {
    test('calls onChange handler for every search change', () => {
      const mountedComponent = getMountedComponent(commonProps);
      const newSearch = 'foo';
      mountedComponent
        .find('input')
        .simulate('change', { target: { value: newSearch } });
      expect(commonProps.onChange).toHaveBeenCalled();
      expect(commonProps.onChange.mock.calls[0][0]).toBe(newSearch);
    });

    test('calls onSubmit passing it the search value if enter is pressed', () => {
      // cheating here slightly by directly simulating the submit event
      const search = 'foo';
      const mountedComponent = getMountedComponent({
        ...commonProps,
        search
      });
      mountedComponent.simulate('submit');
      expect(commonProps.onSubmit).toHaveBeenCalled();
      expect(commonProps.onSubmit.mock.calls[0][0]).toBe(search);
    });
  });
});
