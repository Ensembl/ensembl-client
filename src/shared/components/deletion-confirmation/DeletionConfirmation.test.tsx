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

import DeletionConfirmation, {
  DeletionConfirmationProps
} from './DeletionConfirmation';

const props: DeletionConfirmationProps = {
  onConfirm: jest.fn(),
  onCancel: jest.fn()
};

describe('DeletionConfirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders a button with correct label', () => {
    const { container } = render(
      <DeletionConfirmation {...props} confirmButtonLabel="Remove" />
    );

    const deleteButton = container.querySelector('button') as HTMLButtonElement;
    expect(deleteButton?.textContent).toBe('Remove');
  });

  it('calls confirmDeletion onClick when clicked', async () => {
    const { container } = render(<DeletionConfirmation {...props} />);
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.click(button);

    expect(props.onConfirm).toHaveBeenCalled();
  });

  it('calls cancelDeletion onClick when clicked', async () => {
    const { container } = render(<DeletionConfirmation {...props} />);
    const cancelLabel = container.querySelector('.clickable') as HTMLElement;

    await userEvent.click(cancelLabel);

    expect(props.onCancel).toHaveBeenCalled();
  });
});
