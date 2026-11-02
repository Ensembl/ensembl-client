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

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import type {
  LetterHit,
  SequenceSelection,
  SelectionActions
} from './sequence-hit-testing';

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
      actions: SelectionActions;
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

  render(state: PopoverState) {
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
      this.#renderSelection(state.selection, state.actions);
    } else {
      const coordinates = document.createElement('div');
      coordinates.textContent = `${state.letter.character}: ${state.letter.location.start}`;
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

  #renderSelection(selection: SequenceSelection, actions: SelectionActions) {
    const title = document.createElement('div');
    title.textContent = `${selection.start}–${selection.end} (${selection.sequence.length} letters)`;
    const controls = document.createElement('div');
    controls.className = 'sequence-popover-actions';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'Copy';
    copy.disabled = !navigator.clipboard;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(
          toFasta({ header: actions.header, value: selection.sequence })
        );
        copy.textContent = 'Copied';
      } catch {
        copy.textContent = 'Copy failed — retry';
      }
    });
    const browser = document.createElement('a');
    browser.textContent = 'View in genome browser';
    browser.href = actions.browserUrl;
    controls.append(copy, browser);
    this.#element.append(title, controls);
  }
}
