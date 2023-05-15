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

import React, { useState, useRef, ReactNode } from 'react';
import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';
import ViewInApp, {
  LinksConfig
} from 'src/shared/components/view-in-app/ViewInApp';

import styles from './ViewInAppPopup.scss';

export type ViewInAppPopupProps = {
  links: LinksConfig;
  children: ReactNode;
  position?: Position;
};

const ViewInAppPopup = (props: ViewInAppPopupProps) => {
  const { links, position = Position.BOTTOM_RIGHT, children } = props;
  const [showPointerBox, setShowPointerBox] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const onAnchorClick = () => {
    setShowPointerBox(!showPointerBox);
  };

  return (
    <span className={styles.wrapper} ref={anchorRef} onClick={onAnchorClick}>
      {children}
      {showPointerBox && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
          renderInsideAnchor={true}
          onOutsideClick={() => setShowPointerBox(false)}
          position={position}
          autoAdjust={true}
          classNames={{
            box: styles.pointerBox,
            pointer: styles.pointerBoxPointer
          }}
        >
          <ViewInApp theme="dark" links={links} />
        </PointerBox>
      )}
    </span>
  );
};

export default ViewInAppPopup;
