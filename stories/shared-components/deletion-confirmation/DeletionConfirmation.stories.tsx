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

import DeletionConfirmation from 'src/shared/components/deletion-confirmation/DeletionConfirmation';

import styles from './DeletionConfirmation.module.css';

type DefaultArgs = {
  onClick: (...args: any) => void;
};

export const DefaultDeletionConfirmation = (args: DefaultArgs) => (
  <DeletionConfirmation
    warningText="Are you sure you want to delete?"
    confirmText="Delete"
    cancelText="Do not delete"
    onConfirm={() => args.onClick('Confirmed')}
    onCancel={() => args.onClick('Cancel')}
    {...args}
  />
);

DefaultDeletionConfirmation.storyName = 'default';

export const wrappedDeletionConfirmation = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <DeletionConfirmation
      warningText="This is a very long text which will wrap to the next line and we want the text to stay on the line and only the buttons to wrap to the next line. Are you sure you want to to remove this item?"
      confirmText="Remove this item"
      cancelText="Do not remove this item"
      alignContent="right"
      onConfirm={() => args.onClick('Confirmed')}
      onCancel={() => args.onClick('Cancel')}
      {...args}
    />
  </div>
);

wrappedDeletionConfirmation.storyName = 'Text wrapping and align right';

export default {
  title: 'Components/Shared Components/Deletion Confirmation',
  argTypes: { onClick: { action: 'click' } }
};
