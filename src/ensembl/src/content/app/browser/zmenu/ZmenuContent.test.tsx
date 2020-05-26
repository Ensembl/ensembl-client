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
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import faker from 'faker';
import configureMockStore from 'redux-mock-store';

import {
  ZmenuContent,
  ZmenuContentProps,
  ZmenuContentItem,
  ZmenuContentItemProps,
  ZmenuContentLine
} from './ZmenuContent';

import {
  Markup,
  ZmenuContentItem as ZmenuContentItemType
} from './zmenu-types';
import { createZmenuContent } from 'tests/fixtures/browser';

jest.mock('./ZmenuAppLinks', () => () => <div>ZmenuAppLinks</div>);

describe('<ZmenuContent />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockStoreCreator = configureMockStore();
  const mockStore = mockStoreCreator(() => ({}));
  const wrappingComponent = (props: any) => (
    <Provider store={mockStore}>{props.children}</Provider>
  );
  const defaultProps: ZmenuContentProps = {
    content: createZmenuContent()
  };
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(<ZmenuContent {...defaultProps} />, { wrappingComponent });
  });

  describe('rendering', () => {
    it('renders the correct zmenu content information', () => {
      const firstLineData = wrapper
        .find(ZmenuContentLine)
        .first()
        .props()
        .blocks.map((items: ZmenuContentItemType[]) => items[0].text);

      firstLineData.forEach((lineText: string) => {
        expect(wrapper.find('.zmenuContentLine').first().text()).toContain(
          lineText
        );
      });
    });
  });

  describe('behaviour', () => {
    it('changes focus feature when feature link is clicked', () => {
      const props: ZmenuContentItemProps = {
        id: faker.lorem.words(),
        markup: [Markup.FOCUS],
        text: faker.lorem.words(),
        changeFocusObject: jest.fn()
      };
      const wrapper = mount(<ZmenuContentItem {...props} />);

      wrapper.simulate('click');
      expect(wrapper.props().changeFocusObject).toHaveBeenCalledTimes(1);
    });
  });
});
