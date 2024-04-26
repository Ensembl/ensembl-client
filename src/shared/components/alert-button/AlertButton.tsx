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

import * as React from 'react';
import classNames from 'classnames';

import AlertIcon from 'static/icons/icon_alert_circle.svg';

import { useShowTooltip } from 'src/shared/hooks/useShowTooltip';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import styles from './AlertButton.module.css';

type Props = {
  tooltipContent?: React.ReactNode;
  level?: 'red' | 'amber';
  className?: string;
};

const AlertButton = (props: Props) => {
  const { level: alertLevel = 'red', tooltipContent } = props;

  const { elementRef, onClick, onTooltipCloseSignal, shouldShowTooltip } =
    useShowTooltip();

  const alertButtonClass = classNames(
    styles.alertButton,
    props.className,
    { [styles.alertButtonRed]: alertLevel === 'red' },
    { [styles.alertButtonAmber]: alertLevel === 'amber' },
    { [styles.noTooltip]: !props.tooltipContent }
  );

  return (
    <div ref={elementRef} className={alertButtonClass} onClick={onClick}>
      <AlertIcon />
      {tooltipContent && shouldShowTooltip && (
        <Tooltip
          anchor={elementRef.current}
          autoAdjust={true}
          onClose={onTooltipCloseSignal}
          delay={0}
        >
          {tooltipContent}
        </Tooltip>
      )}
    </div>
  );
};

export default AlertButton;
