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
import { faker } from '@faker-js/faker';

import Panel, { PanelProps } from './Panel';

const panelBodyContent = 'This content goes into the panel’s body';

const panelHeaderContent = 'This content goes into the panel’s header';

const onClose = jest.fn();

const panelClassNames = {
  panel: faker.lorem.word(),
  header: faker.lorem.word(),
  body: faker.lorem.word(),
  closeButton: faker.lorem.word()
};

const defaultProps: PanelProps = {
  header: panelHeaderContent,
  children: panelBodyContent,
  classNames: panelClassNames
};

const renderPanel = (props?: Partial<PanelProps>) => {
  return render(<Panel {...defaultProps} {...props} />);
};

describe('<Panel />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('displays the header with the correct content', () => {
    const { container } = renderPanel();
    const header = container.querySelector('.header');

    expect(header?.textContent).toBe(defaultProps.header);
  });

  it('displays the body with the correct content', () => {
    const { container } = renderPanel();
    const body = container.querySelector('.body');

    expect(body?.textContent).toBe(defaultProps.children);
  });

  it('displays the close button only if onClose is set', () => {
    const { container } = renderPanel({ onClose });
    const closeButton = container.querySelector('.closeButton');

    expect(closeButton).toBeTruthy();
  });

  it('does not display the close button if onClose is not set', () => {
    const { container } = renderPanel();
    const closeButton = container.querySelector('.closeButton');

    expect(closeButton).toBeFalsy();
  });

  it('calls the onClose function when the close button is clicked', async () => {
    const { container } = renderPanel({ onClose });
    const closeButton = container.querySelector('.closeButton');

    await userEvent.click(closeButton as HTMLElement);

    expect(onClose).toHaveBeenCalled();
  });

  it('applies the passed in classes', () => {
    const { container } = renderPanel();
    const panel = container.querySelector('.panel') as HTMLElement;
    const panelBody = container.querySelector('.body') as HTMLElement;
    const panelHeader = container.querySelector('.header') as HTMLElement;

    expect(panel.classList.contains(panelClassNames.panel)).toBe(true);
    expect(panelBody.classList.contains(panelClassNames.body)).toBe(true);
    expect(panelHeader.classList.contains(panelClassNames.header)).toBe(true);
  });

  it('applies the passed in closeButton className', () => {
    const { container } = renderPanel({ onClose });
    const closeButton = container.querySelector('.closeButton') as HTMLElement;

    expect(closeButton.classList.contains(panelClassNames.closeButton)).toBe(
      true
    );
  });

  it('hides the header when there is no header', () => {
    const { container } = renderPanel({ header: undefined });
    const header = container.querySelector('.header') as HTMLElement;

    expect(header).toBeFalsy();
  });
});
