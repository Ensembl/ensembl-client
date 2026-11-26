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

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import genomeBrowserIconLink from 'static/icons/icon_launchbar_browser.svg?url';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';
import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';
import type { LetterHit, SequenceSelection } from './sequence-hit-testing';

export type GenomeBrowserNavigationEventDetail = {
  location: GenomicLocation;
};

export type PopoverState =
  | { kind: 'closed' }
  | { kind: 'coordinates'; letter: LetterHit }
  | {
      kind: 'features';
      letter: LetterHit;
      content:
        | { status: 'loading' }
        | { status: 'ready'; template: string }
        | { status: 'error' };
    }
  | {
      kind: 'selection';
      selection: SequenceSelection;
      sequenceType: TranscriptSequenceView;
      genomeBrowserLocation?: GenomicLocation;
    };

let popoverCounter = 0;

export class SequencePopover {
  #element = document.createElement('div');
  #anchor: HTMLElement | null = null;
  #anchorName = `--sequence-popover-${++popoverCounter}`;

  constructor(
    private root: ShadowRoot,
    onDismiss: () => void
  ) {
    this.#element.className = 'sequence-popover';
    this.#element.addEventListener('toggle', (event) => {
      // Wait until native dismissal has finished before cleaning up. A queued
      // close event must not dismiss a popover that has since been reopened.
      if (
        event.newState === 'closed' &&
        this.#element.isConnected &&
        !this.#element.matches(':popover-open')
      ) {
        onDismiss();
      }
    });
  }

  contains(target: EventTarget | null) {
    return target instanceof Node && this.#element.contains(target);
  }

  close() {
    if (this.#element.matches(':popover-open')) {
      this.#element.hidePopover();
    }
    this.#element.remove();
    this.#clearAnchor();
  }

  render(state: PopoverState, regionName?: string) {
    if (state.kind === 'closed') {
      this.close();
      return;
    }

    const element = this.#element;
    const popoverType = state.kind === 'coordinates' ? 'manual' : 'auto';
    if (element.popover !== popoverType) {
      if (element.matches(':popover-open')) {
        element.hidePopover();
      }
      element.popover = popoverType;
    }
    element.dataset.mode = state.kind;
    element.replaceChildren();

    const position =
      state.kind === 'selection'
        ? state.selection
        : { lineBlock: state.letter.lineBlock, rect: state.letter.rect };
    const lineRect = position.lineBlock.getBoundingClientRect();
    this.#clearAnchor();
    this.#anchor = position.lineBlock;
    this.#anchor.style.setProperty('anchor-name', this.#anchorName);
    element.style.setProperty('position-anchor', this.#anchorName);
    element.style.setProperty(
      '--letter-offset-x',
      `${position.rect.right - lineRect.left}px`
    );
    element.style.setProperty(
      '--letter-offset-y',
      `${position.rect.bottom - lineRect.top}px`
    );

    if (state.kind === 'selection') {
      this.#renderSelection(state, regionName);
    } else {
      const coordinates = document.createElement('div');
      const formattedPosition = formatNumber(state.letter.location.start);
      const location = regionName
        ? `${regionName}:${formattedPosition}`
        : formattedPosition;
      coordinates.textContent = `${state.letter.character}: ${location}`;
      element.append(coordinates);
      if (state.kind === 'features') {
        if (state.content.status === 'ready') {
          const parsed = new DOMParser().parseFromString(
            state.content.template,
            'text/html'
          );
          element.append(...parsed.head.childNodes, ...parsed.body.childNodes);
        } else {
          const status = document.createElement('div');
          status.setAttribute('role', 'status');
          status.textContent =
            state.content.status === 'loading'
              ? 'Loading overlapping features…'
              : 'Unable to load overlapping features. Click the letter to try again.';
          element.append(status);
        }
      }
    }

    if (!element.isConnected) {
      this.root.append(element);
    }
    if (!element.matches(':popover-open')) {
      element.showPopover();
    }
  }

  #clearAnchor() {
    if (
      this.#anchor?.style.getPropertyValue('anchor-name') === this.#anchorName
    ) {
      this.#anchor.style.removeProperty('anchor-name');
    }
    this.#anchor = null;
  }

  #renderSelection(
    state: Extract<PopoverState, { kind: 'selection' }>,
    regionName?: string
  ) {
    const { selection, sequenceType, genomeBrowserLocation } = state;

    const titleElement = document.createElement('div');
    titleElement.textContent = 'Selected range';

    const locationWrapper = document.createElement('div');
    const range = `${formatNumber(selection.start)}-${formatNumber(selection.end)}`;
    const coordinates = regionName ? `${regionName}:${range}` : range;
    locationWrapper.textContent = coordinates;

    const lengthWrapper = document.createElement('div');
    const unit = sequenceType === 'protein' ? 'aa' : 'bp';
    lengthWrapper.textContent = `${formatNumber(selection.length)} ${unit}`;

    const buttonsSection = createSelectionPopoverButtons({
      coordinates,
      sequence: selection.sequence,
      sequenceType,
      genomeBrowserLocation
    });

    const children = [titleElement, locationWrapper, lengthWrapper];
    if (buttonsSection) {
      children.push(buttonsSection);
    }

    this.#element.append(...children);
  }
}

const createSelectionPopoverButtons = ({
  genomeBrowserLocation,
  sequenceType,
  coordinates,
  sequence
}: {
  genomeBrowserLocation?: GenomicLocation;
  sequenceType: TranscriptSequenceView;
  coordinates: string;
  sequence: string;
}) => {
  const controls = document.createElement('div');
  controls.className = 'sequence-popover-actions';

  const canCopyToClipboard = globalThis.navigator?.clipboard;
  let hasChildren = false;

  if (canCopyToClipboard) {
    controls.append(
      createCopyButton('Copy coordinates', coordinates),
      createCopyButton('Copy sequence', sequence)
    );
    hasChildren = true;
  }

  if (sequenceType === 'genomic' && genomeBrowserLocation) {
    const genomeBrowserButton = createViewInGenomeBrowserButton({
      genomeBrowserLocation
    });
    controls.append(genomeBrowserButton);
    hasChildren = true;
  }

  return hasChildren ? controls : null;
};

const createCopyButton = (label: string, value: string) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'text-button';
  button.textContent = label;
  let resetTimeout: ReturnType<typeof setTimeout> | undefined;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(value);
      clearTimeout(resetTimeout);
      button.textContent = 'Copied';
      button.disabled = true;
      resetTimeout = setTimeout(() => {
        button.textContent = label;
        button.disabled = false;
      }, 2000);
    } catch {
      // Keep the original label so the user can retry a failed write.
    }
  });
  return button;
};

const createViewInGenomeBrowserButton = ({
  genomeBrowserLocation
}: {
  genomeBrowserLocation: GenomicLocation;
}) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'genome-browser-button-wrapper';

  const label = document.createElement('span');
  label.textContent = 'View in';
  wrapper.append(label);

  const genomeBrowserButton = document.createElement('button');
  genomeBrowserButton.className = 'genome-browser-button';

  const image = document.createElement('img');
  image.setAttribute('src', genomeBrowserIconLink);
  genomeBrowserButton.appendChild(image);

  genomeBrowserButton.addEventListener('click', () => {
    genomeBrowserButton.dispatchEvent(
      new CustomEvent<GenomeBrowserNavigationEventDetail>(
        'genome-browser-navigation',
        {
          detail: { location: genomeBrowserLocation },
          bubbles: true,
          composed: true
        }
      )
    );
  });

  wrapper.append(genomeBrowserButton);
  return wrapper;
};
