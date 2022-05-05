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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ToolboxExpandableContent, {
  ToggleButton
} from './ToolboxExpandableContent';

const MainContent = () => (
  <div data-test-id="main content">
    <span>This is main content</span>
    <ToggleButton label="Click me!" />
  </div>
);
const FooterContent = () => (
  <div data-test-id="footer content">This is footer content</div>
);

const minimalProps = {
  mainContent: <MainContent />,
  footerContent: <FooterContent />
};

describe('<ToolboxExpandableContent />', () => {
  it('renders only main content by default', () => {
    render(<ToolboxExpandableContent {...minimalProps} />);
    const mainContent = screen.queryByTestId('main content');
    const footerContent = screen.queryByTestId('footer content');

    expect(mainContent).toBeTruthy();
    expect(footerContent).toBeFalsy();
  });

  it('shows footer content when ToggleButton is clicked', async () => {
    render(<ToolboxExpandableContent {...minimalProps} />);
    const toggleButton = screen.getByText('Click me!');

    await userEvent.click(toggleButton as HTMLElement);

    const footerContent = screen.queryByTestId('footer content');
    expect(footerContent).toBeTruthy();
  });
});
