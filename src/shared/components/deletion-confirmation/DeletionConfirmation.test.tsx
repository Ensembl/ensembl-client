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

import DeletionConfirmation, {
  DeletionConfirmationProps
} from './DeletionConfirmation';

const props: DeletionConfirmationProps = {
  confirmText: 'Remove',
  cancelText: 'Do not remove',
  warningText: 'Do you want to remove?',
  onConfirm: jest.fn(),
  onCancel: jest.fn()
};

describe('DeletionConfirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('applies custom messages provided by parent', () => {
    const { container } = render(<DeletionConfirmation {...props} />);

    const deleteButton = container.querySelector('button') as HTMLButtonElement;
    expect(deleteButton?.textContent).toBe(props.confirmText);

    const cancelLink = container.querySelector('.cancel') as HTMLElement;
    expect(cancelLink?.textContent).toBe(props.cancelText);

    const warningText = container.querySelector('.warningText') as HTMLElement;
    expect(warningText?.textContent).toBe(props.warningText);
  });

  it('applies custom class name passed from the parent', () => {
    const { container, rerender } = render(<DeletionConfirmation {...props} />);

    const deletionConfirmation = container.firstChild as HTMLElement;
    expect(
      deletionConfirmation.classList.contains('deleteConfirmationContainer')
    ).toBe(true);

    rerender(<DeletionConfirmation {...props} className="componentClass" />);
    expect(deletionConfirmation.classList.contains('componentClass')).toBe(
      true
    );
  });

  it('applies alignment set from the parent', () => {
    const { container, rerender } = render(<DeletionConfirmation {...props} />);

    const deletionConfirmation = container.firstChild as HTMLElement;
    expect(
      deletionConfirmation.classList.contains('deleteConfirmationContainer')
    ).toBe(true);

    rerender(<DeletionConfirmation {...props} alignContent="right" />);
    expect(deletionConfirmation.classList.contains('contentAlignRight')).toBe(
      true
    );
  });

  it('it calls correct callback on confirmation', async () => {
    const { container } = render(<DeletionConfirmation {...props} />);
    const button = container.querySelector('button') as HTMLButtonElement;

    await userEvent.click(button);

    expect(props.onConfirm).toHaveBeenCalled();
  });

  it('it calls correct callback on cancellation', async () => {
    const { container } = render(<DeletionConfirmation {...props} />);
    const cancelLabel = container.querySelector('.cancel') as HTMLElement;

    await userEvent.click(cancelLabel);

    expect(props.onCancel).toHaveBeenCalled();
  });
});
