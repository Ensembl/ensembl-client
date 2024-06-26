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

import { ReactNode } from 'react';
import classNames from 'classnames';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import styles from './Toolbox.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

export enum ToolboxPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

type ToolboxProps = {
  position?: ToolboxPosition;
  anchor: HTMLElement;
  onOutsideClick?: () => void;
  className?: string;
  children: ReactNode;
};

const Toolbox = (props: ToolboxProps) => {
  const { position: positionFromProps = ToolboxPosition.RIGHT } = props;
  const pointerBoxPosition =
    positionFromProps === ToolboxPosition.LEFT
      ? Position.LEFT_BOTTOM
      : Position.RIGHT_BOTTOM;

  const componentClasses = classNames(
    styles.toolbox,
    pointerBoxStyles.pointerBoxShadow,
    props.className
  );

  return (
    <PointerBox
      position={pointerBoxPosition}
      anchor={props.anchor}
      onOutsideClick={props.onOutsideClick}
      renderInsideAnchor={true}
      className={componentClasses}
    >
      {props.children}
    </PointerBox>
  );
};

export default Toolbox;
