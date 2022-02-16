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

import { VisibilityIcon } from './VisibilityIcon';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';

jest.mock('src/shared/components/image-button/ImageButton', () => {
  return jest.fn(() => <div data-test-id="image button" />);
});

describe('<VisibilityIcon />', () => {
  const onClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ImageButton', () => {
    render(<VisibilityIcon status={Status.SELECTED} onClick={onClick} />);

    expect(screen.queryByTestId('image button')).toBeTruthy();
  });

  it('passes the DEFAULT status to ImageButton when partially selected', () => {
    render(
      <VisibilityIcon status={Status.PARTIALLY_SELECTED} onClick={onClick} />
    );

    const imageButtonProps = (ImageButton as any).mock.calls[0][0];

    // image button status should be default
    expect(imageButtonProps.status).toBe(Status.DEFAULT);
    // however, the default class of the image button should be partiallySelected
    expect(imageButtonProps.statusClasses.default).toBe('partiallySelected');
  });
});
