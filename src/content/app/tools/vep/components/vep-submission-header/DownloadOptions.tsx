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

import { useState, useRef } from 'react';
import classNames from 'classnames';

import PointerBox, {
  Position
} from 'src/shared/components/pointer-box/PointerBox';

import DownloadIcon from 'static/icons/icon_download.svg';

import styles from './DownloadOptions.module.css';

type Props = {
  vcfHref: string;
  tableHref: string;
  disabled?: boolean;
  // Trigger label (default "Download"); e.g. "Download filtered" when the hrefs
  // carry the active filters.
  label?: string;
  ariaLabel?: string;
};

/**
 * The results download control: a single download icon that opens a small menu
 * offering the two formats (raw VCF, or the flattened simple table), each with a
 * brief description, rather than a separate icon + link.
 */
const DownloadOptions = (props: Props) => {
  const {
    vcfHref,
    tableHref,
    disabled,
    label = 'Download',
    ariaLabel = 'Download results'
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);

  const onOutsideClick = (event: Event) => {
    // PointerBox renders to document.body, so clicks on the menu are "outside"
    // the anchor; only close when the click is genuinely elsewhere.
    if (!anchorRef.current?.contains(event.target as HTMLElement)) {
      close();
    }
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className={classNames(styles.trigger, {
          [styles.triggerDisabled]: disabled
        })}
        onClick={() => setIsOpen((open) => !open)}
        inert={disabled || undefined}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <DownloadIcon />
        <span>{label}</span>
      </button>
      {isOpen && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
          renderInsideAnchor={false}
          onOutsideClick={onOutsideClick}
          onClose={close}
          position={Position.BOTTOM_RIGHT}
          autoAdjust={true}
          className={styles.pointerBox}
        >
          <div className={styles.menu} role="menu">
            <a
              className={styles.option}
              href={vcfHref}
              download={true}
              role="menuitem"
              onClick={close}
            >
              <span className={styles.optionTitle}>VCF</span>
              <span className={styles.optionDetail}>Variant Call Format</span>
            </a>
            <a
              className={styles.option}
              href={tableHref}
              download={true}
              role="menuitem"
              onClick={close}
            >
              <span className={styles.optionTitle}>Simple table</span>
              <span className={styles.optionDetail}>
                TSV — human readable, easy to import to a spreadsheet
              </span>
            </a>
          </div>
        </PointerBox>
      )}
    </>
  );
};

export default DownloadOptions;
