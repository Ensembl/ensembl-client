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

import React, { MutableRefObject } from 'react';
import classNames from 'classnames';
import HelpPopupHistory from '../help-popup/helpPopupHistory';

import { ReactComponent as BackIcon } from 'static/img/browser/navigate-left.svg';
import { ReactComponent as ForwardIcon } from 'static/img/browser/navigate-right.svg';

import styles from '../help-popup/HelpPopupBody.scss';

type HistoryButtonsProps = {
  historyRef: MutableRefObject<HelpPopupHistory | null>;
  onHistoryBack: () => void;
  onHistoryForward: () => void;
};

const HistoryButtons = (props: HistoryButtonsProps) => {
  const { historyRef, onHistoryBack, onHistoryForward } = props;
  const historyForwardClasses = classNames(
    styles.historyButton,
    historyRef.current?.hasNext()
      ? styles.historyButtonActive
      : styles.historyButtonInactive
  );
  const historyBackClasses = classNames(
    styles.historyButton,
    historyRef.current?.hasPrevious()
      ? styles.historyButtonActive
      : styles.historyButtonInactive
  );

  return (
    <div className={styles.historyButtons}>
      <BackIcon className={historyBackClasses} onClick={onHistoryBack} />
      <ForwardIcon
        className={historyForwardClasses}
        onClick={onHistoryForward}
      />
    </div>
  );
};

export default HistoryButtons;
