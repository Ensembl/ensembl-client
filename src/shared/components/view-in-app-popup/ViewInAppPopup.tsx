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

import { useState, useRef, type ReactNode } from 'react';
import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';
import ViewInApp, {
  LinksConfig
} from 'src/shared/components/view-in-app/ViewInApp';

import styles from './ViewInAppPopup.module.css';

export type ViewInAppPopupProps = {
  links: LinksConfig;
  children: ReactNode;
  position?: Position;
};

const ViewInAppPopup = (props: ViewInAppPopupProps) => {
  const { links, position = Position.BOTTOM_RIGHT, children } = props;
  const [showPointerBox, setShowPointerBox] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const onAnchorClick = () => {
    setShowPointerBox(!showPointerBox);
  };

  const onClose = () => {
    setShowPointerBox(false);
  };

  const onOutsideClick = (event: Event) => {
    // If the PointerBox is rendered outside the anchor (i.e. as a top-level child of the document body)
    // (to avoid adjacent elements from being positioned in front of the popup and intercepting clicks on its buttons),
    // then a click on any of the props.children will be outside the anchor.
    // Thus, an extra check of the click target relative to the anchor becomes necessary.
    // All this will go away when we can switch to the popover api.
    if (!anchorRef.current?.contains(event.target as HTMLElement)) {
      onClose();
    }
  };

  return (
    <>
      <button
        className={styles.wrapper}
        ref={anchorRef}
        onClick={onAnchorClick}
      >
        {children}
      </button>
      {showPointerBox && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
          renderInsideAnchor={false}
          onOutsideClick={onOutsideClick}
          onClose={onClose}
          position={position}
          autoAdjust={true}
          className={styles.pointerBox}
        >
          <ViewInApp theme="dark" links={links} />
        </PointerBox>
      )}
    </>
  );
};

export default ViewInAppPopup;
