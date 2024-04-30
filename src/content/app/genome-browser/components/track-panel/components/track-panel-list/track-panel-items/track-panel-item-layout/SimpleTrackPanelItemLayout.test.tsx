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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SimpleTrackPanelItemLayout from './SimpleTrackPanelItemLayout';

import { Status } from 'src/shared/types/status';

const mainContentText = 'main content';
const MainContent = () => <div>{mainContentText}</div>;

describe('<SimpleTrackPanelItemLayout />', () => {
  it('renders the main content', () => {
    const { container } = render(
      <SimpleTrackPanelItemLayout>
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );
    const renderedMainContent = container.querySelector('.content');
    const showMoreContainer = container.querySelector('.showMore');
    const visibilitySwitchContainer =
      container.querySelector('.visibilitySwitch');

    expect(renderedMainContent?.textContent).toBe(mainContentText);
    expect(showMoreContainer?.children.length).toBe(0);
    expect(visibilitySwitchContainer?.children.length).toBe(0);
  });

  it('is highlightable on hover by default', () => {
    const { container, rerender } = render(
      <SimpleTrackPanelItemLayout>
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );
    const renderedElement = container.firstChild as HTMLElement;

    expect(renderedElement.classList.contains('highlightableOnHover')).toBe(
      true
    );

    rerender(
      <SimpleTrackPanelItemLayout highlightOnHover={false}>
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );
    expect(renderedElement.classList.contains('highlightableOnHover')).toBe(
      false
    );
  });

  it('can be highlighted by parent', () => {
    const { container, rerender } = render(
      <SimpleTrackPanelItemLayout>
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );
    const renderedElement = container.firstChild as HTMLElement;

    expect(renderedElement.classList.contains('highlighted')).toBe(false);

    rerender(
      <SimpleTrackPanelItemLayout isHighlighted={true}>
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );

    expect(renderedElement.classList.contains('highlighted')).toBe(true);
  });

  it('renders a visibility button with the correct visibility status if a callback is passed', async () => {
    const onChangeVisibility = jest.fn();
    const { container } = render(
      <SimpleTrackPanelItemLayout
        visibilityStatus={Status.SELECTED}
        onChangeVisibility={onChangeVisibility}
      >
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );
    const imageButton = container.querySelector(
      '.visibilitySwitch .imageButton'
    );

    await userEvent.click(imageButton?.firstChild as HTMLButtonElement);

    expect(imageButton?.classList.contains('selected')).toBe(true);
    expect(onChangeVisibility).toHaveBeenCalledTimes(1);
  });

  it('renders an ellipsis if a callback is passed', async () => {
    const onShowMore = jest.fn();
    const { container } = render(
      <SimpleTrackPanelItemLayout onShowMore={onShowMore}>
        <MainContent />
      </SimpleTrackPanelItemLayout>
    );
    const showMoreButton = container.querySelector('.showMore button');

    await userEvent.click(showMoreButton as HTMLButtonElement);

    expect(onShowMore).toHaveBeenCalledTimes(1);
  });
});
