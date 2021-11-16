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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';

import SidebarModal, { SidebarModalProps } from './SidebarModal';

const sidebarModalContent = 'This content goes into the sidebarModal’s content';

const sidebarModalTitle = 'This content goes into the sidebarModal’s title';

const onClose = jest.fn();

const classNames = {
  wrapper: faker.lorem.word(),
  title: faker.lorem.word(),
  content: faker.lorem.word(),
  closeButton: faker.lorem.word()
};

const defaultProps: SidebarModalProps = {
  title: sidebarModalTitle,
  children: sidebarModalContent,
  classNames: classNames,
  onClose: onClose
};

const renderSidebarModal = (props?: Partial<SidebarModalProps>) => {
  return render(<SidebarModal {...defaultProps} {...props} />);
};

describe('<SidebarModal />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('displays the title with the correct content', () => {
    const { container } = renderSidebarModal();
    const title = container.querySelector('.title');

    expect(title?.textContent).toBe(defaultProps.title);
  });

  it('displays the correct content', () => {
    const { container } = renderSidebarModal();
    const content = container.querySelector('.content');

    expect(content?.textContent).toBe(defaultProps.children);
  });

  it('displays the close button only if onClose is set', () => {
    const { container } = renderSidebarModal();
    const closeButton = container.querySelector('.closeButton');

    expect(closeButton).toBeTruthy();
  });

  it('does not display the close button if onClose is not set', () => {
    const { container } = renderSidebarModal({ onClose: undefined });
    const closeButton = container.querySelector('.closeButton');

    expect(closeButton).toBeFalsy();
  });

  it('calls the onClose function when the close button is clicked', () => {
    const { container } = renderSidebarModal();
    const closeButton = container.querySelector('.closeButton');

    userEvent.click(closeButton as HTMLElement);

    expect(onClose).toHaveBeenCalled();
  });

  it('applies the passed in classes', () => {
    const { container } = renderSidebarModal();
    const wrapper = container.querySelector('.wrapper') as HTMLElement;
    const content = container.querySelector('.content') as HTMLElement;
    const title = container.querySelector('.title') as HTMLElement;
    const closeButton = container.querySelector('.closeButton') as HTMLElement;

    expect(wrapper.classList.contains(classNames.wrapper)).toBe(true);
    expect(content.classList.contains(classNames.content)).toBe(true);
    expect(title.classList.contains(classNames.title)).toBe(true);
    expect(closeButton.classList.contains(classNames.closeButton)).toBe(true);
  });
});
