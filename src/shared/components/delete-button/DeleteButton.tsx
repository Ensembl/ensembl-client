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

import React, {
  forwardRef,
  type HTMLAttributes,
  type ForwardedRef
} from 'react';
import { ReactComponent as TrashcanIcon } from 'static/icons/trash.svg';

import styles from './DeleteButton.scss';

type Props = Omit<HTMLAttributes<HTMLButtonElement>, 'children'>;

const DeleteButton = (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <button {...props} ref={ref} className={styles.deleteButton}>
      <TrashcanIcon />
    </button>
  );
};

export default forwardRef(DeleteButton);
