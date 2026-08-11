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

import { useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import Tooltip from 'src/shared/components/tooltip/Tooltip';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import DownloadIcon from 'static/icons/icon_download.svg';

import styles from './DownloadOptions.module.css';

type Props = {
  vcfHref: string;
  tableHref: string;
  disabled?: boolean;
  /**
   * What the control is offering, shown on hover rather than beside the icon —
   * "Download", or "Download filtered" where the hrefs carry the active
   * filters. It is the tooltip *and* the panel's own heading, so the two cannot
   * describe the control differently.
   */
  label?: string;
  ariaLabel?: string;
};

/**
 * The results download control: a bare download icon that names itself on
 * hover, and opens the formats in a panel down the right-hand side.
 *
 * Both halves follow the genome page on ensembl.org, whose equivalent control
 * is an icon whose options open into a closable drawer. The word beside the
 * icon went with it: an icon that has to be captioned is doing half a job, and
 * the caption cost more width than the control.
 *
 * The panel rather than the small pointer menu this used to open, because the
 * options are not a menu — each is a format with something to say about it, and
 * a popover that closes on any outside click is a poor place to read.
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
  // Hover is tracked here rather than through the shared `useHover`, and the
  // anchor is held in state rather than a ref, for one reason: the tooltip has
  // to be given the element while rendering. Reading a ref there — or writing
  // to the one `useHover` returns — are both errors under ensembl-client's
  // React Compiler rules, and this is shorter than either.
  //
  // The listeners sit on the wrapper, not the button, so the tooltip still
  // appears while the control is disabled: a disabled button fires no pointer
  // events, and "why can I not download?" is exactly when its name is worth
  // having.
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const close = () => setIsOpen(false);

  const panel = (
    <>
      {/* The area beside the panel: dimmed so the panel reads as the active
          thing, and closing on click, as the drawer's own window does. */}
      <div className={styles.panelWindow} onClick={close} />
      <aside
        className={styles.panel}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="false"
      >
        <CloseButton className={styles.panelClose} onClick={close} />
        <div className={styles.panelTitle}>{label}</div>
        <div className={styles.panelOptions}>
          <a
            className={styles.option}
            href={vcfHref}
            download={true}
            onClick={close}
          >
            <span className={styles.optionTitle}>VCF</span>
            <span className={styles.optionDetail}>Variant Call Format</span>
          </a>
          <a
            className={styles.option}
            href={tableHref}
            download={true}
            onClick={close}
          >
            <span className={styles.optionTitle}>Simple table</span>
            <span className={styles.optionDetail}>
              TSV — human readable, easy to import to a spreadsheet
            </span>
          </a>
        </div>
      </aside>
    </>
  );

  return (
    <div
      ref={setAnchor}
      className={styles.wrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className={classNames(styles.trigger, {
          [styles.triggerDisabled]: disabled
        })}
        onClick={() => {
          // Cleared on open as well as on mouseleave: a tap fires mouseenter on
          // touch devices, and without this the tooltip would be waiting when
          // the panel is closed again.
          setIsHovered(false);
          setIsOpen((open) => !open);
        }}
        inert={disabled || undefined}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <DownloadIcon />
      </button>
      {isHovered && !isOpen && anchor && (
        <Tooltip anchor={anchor} autoAdjust={true}>
          {label}
        </Tooltip>
      )}
      {/* Portalled to the body: the panel runs the height of the viewport, and
          rendering it in place would put it inside the results header's own
          stacking and overflow. */}
      {isOpen && createPortal(panel, document.body)}
    </div>
  );
};

export default DownloadOptions;
