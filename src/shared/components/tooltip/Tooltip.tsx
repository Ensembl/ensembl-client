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

import { useEffect, useState, type ReactNode } from 'react';
import classNames from 'classnames';

import { TOOLTIP_TIMEOUT } from './tooltip-constants';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import { TooltipPosition } from './tooltip-types';

import styles from './Tooltip.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

type Props = {
  anchor: HTMLElement;
  position?: TooltipPosition;
  container?: HTMLElement | null;
  autoAdjust?: boolean; // try to adjust tooltip position so as not to extend beyond screen bounds
  delay?: number;
  renderInsideAnchor?: boolean;
  children: ReactNode;
  onClose?: () => void;
};

type PropsWithNullableAnchor = Omit<Props, 'anchor'> & {
  anchor: HTMLElement | null;
};

const Tooltip = (props: PropsWithNullableAnchor) => {
  return props.anchor ? <TooltipWithAnchor {...(props as Props)} /> : null;
};

const TooltipWithAnchor = (props: Props) => {
  const [isWaiting, setIsWaiting] = useState(true);
  const { delay = TOOLTIP_TIMEOUT } = props;
  let timeoutId: ReturnType<typeof setTimeout>;

  useEffect(() => {
    timeoutId = setTimeout(() => {
      setIsWaiting(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isWaiting || !props.children) {
    return null;
  }

  const componentClasses = classNames(
    styles.tooltip,
    pointerBoxStyles.pointerBoxShadow
  );

  return (
    <PointerBox
      position={props.position ?? Position.BOTTOM_RIGHT}
      anchor={props.anchor}
      container={props.container}
      autoAdjust={props.autoAdjust}
      renderInsideAnchor={props.renderInsideAnchor}
      onClose={props.onClose}
      className={componentClasses}
      onOutsideClick={props.onClose}
    >
      {props.children}
    </PointerBox>
  );
};

export { TOOLTIP_TIMEOUT };
export default Tooltip;
