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

import type { LetterHit, SequenceSelection } from './sequence-hit-testing';

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
      this.#renderSelection();
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

  // NOTE: The popover has mock content for the time being
  #renderSelection() {
    const title = document.createElement('div');
    title.textContent = 'hello world';
    const controls = document.createElement('div');
    controls.className = 'sequence-popover-actions';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'Copy';
    const browser = document.createElement('button');
    browser.type = 'button';
    browser.textContent = 'View in genome browser';
    controls.append(copy, browser);
    this.#element.append(title, controls);
  }
}
