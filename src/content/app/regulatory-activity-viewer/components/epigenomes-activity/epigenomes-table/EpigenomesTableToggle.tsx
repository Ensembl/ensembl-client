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

import { useState, useEffect } from 'react';
import classNames from 'classnames';

import {
  updateTableState,
  tableVisibility$,
  initialState as initialTableState,
  type TableState
} from './epigenomesTableState';

import Chevron from 'src/shared/components/chevron/Chevron';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import styles from './EpigenomesTableToggle.module.css';

type Props = {
  className?: string;
};

const EpigenomesTableToggle = (props: Props) => {
  const [tableState, setTableState] = useState<TableState>(initialTableState);

  const onOpen = () => {
    updateTableState({ isOpen: true });
  };

  const onClose = () => {
    updateTableState({ isOpen: false });
  };

  useEffect(() => {
    const subscription = tableVisibility$.subscribe((state) => {
      setTableState(state);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (tableState.isOpen) {
    return (
      <CloseButtonWithLabel
        className={props.className}
        onClick={onClose}
        label="Row info"
        aria-label="hide table of epigenomes"
      />
    );
  }

  const componentClasses = classNames(styles.button, props.className);

  return (
    <button
      className={componentClasses}
      onClick={onOpen}
      aria-label="show table of epigenomes"
      disabled={!tableState.isAvailable}
    >
      <span>Row info</span>
      <span className={styles.chevronContainer}>
        <Chevron direction="right" />
      </span>
    </button>
  );
};

export default EpigenomesTableToggle;
