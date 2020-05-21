/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';

import SearchField from './SearchField';
import Input from 'src/shared/components/input/Input';

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
