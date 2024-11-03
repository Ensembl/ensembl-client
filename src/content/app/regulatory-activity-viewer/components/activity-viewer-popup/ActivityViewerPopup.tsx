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

import { useState, type ReactNode } from 'react';
import classNames from 'classnames';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';
import toolboxStyles from 'src/shared/components/toolbox/Toolbox.module.css';

/**
 * This component is similar to the "Zmenu" component of the genome browser.
 * Since graphics in the regulatory activity viewer tend to be svgs,
 * the component adds a tiny rect element as an anchor for the popup.
 */

type Props = {
  x: number;
  y: number;
  children: ReactNode;
  onClose: () => void;
};

const ActivityViewerPopup = (props: Props) => {
  const { x, y, children, onClose } = props;
  const [anchorElement, setAnchorElement] = useState<SVGRectElement | null>(
    null
  );

  const pointerBoxClasses = classNames(
    toolboxStyles.toolbox,
    pointerBoxStyles.pointerBoxShadow
  );

  return (
    <>
      <rect
        ref={setAnchorElement}
        x={x}
        y={y}
        width={0}
        height={0}
        fill="transparent"
      />
      {anchorElement && (
        <PointerBox
          position={Position.RIGHT_BOTTOM}
          anchor={anchorElement}
          onOutsideClick={onClose}
          className={pointerBoxClasses}
        >
          {children}
        </PointerBox>
      )}
    </>
  );
};

export default ActivityViewerPopup;
