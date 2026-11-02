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

import {
  fetchOverlapTemplate,
  type OverlapRequestParamsWithoutLocation
} from '../overlapRequest';
import {
  getLetterInfoFromEvent,
  getSequenceSelection
} from './sequence-hit-testing';
import { SequencePopover, type PopoverState } from './sequence-popover';

import type { LetterHit, SequenceSelection } from './sequence-hit-testing';

type Options = {
  host: HTMLElement;
  root: ShadowRoot;
  getOverlapRequestParams: () =>
    OverlapRequestParamsWithoutLocation | undefined;
};

export class SequenceInteractions {
  #listeners = new AbortController();
  #request: AbortController | null = null;
  #selectionTimeout: ReturnType<typeof setTimeout> | null = null;
  #popover: SequencePopover;
  #state: PopoverState = { kind: 'closed' };
  #highlight = document.createElement('div');
  #hovered: LetterHit | null = null;
  #gesture: {
    selecting: boolean;
    suppressClick: boolean;
    startedWithSelection: boolean;
  } = {
    selecting: false,
    suppressClick: false,
    startedWithSelection: false
  };

  constructor(private options: Options) {
    const { root, host } = options;
    const { signal } = this.#listeners;
    this.#popover = new SequencePopover(root, () => this.reset());
    this.#highlight.className = 'letter-highlight';
    this.#highlight.setAttribute('aria-hidden', 'true');

    root.addEventListener(
      'mousemove',
      (event) => {
        if (event instanceof MouseEvent) {
          this.#handleHover(event);
        }
      },
      { signal }
    );
    root.addEventListener(
      'pointerdown',
      (event) => {
        if (
          !(event instanceof PointerEvent) ||
          event.button !== 0 ||
          this.#popover.contains(event.target)
        ) {
          return;
        }
        const startedWithSelection = Boolean(getSequenceSelection(root));
        this.reset();
        this.#gesture = {
          selecting: true,
          suppressClick: false,
          startedWithSelection
        };
      },
      { signal }
    );
    host.ownerDocument.addEventListener(
      'pointerup',
      (event) => {
        if (!this.#gesture.selecting) {
          return;
        }
        this.#gesture.selecting = false;
        const selection = getSequenceSelection(root, event);
        this.#gesture.suppressClick =
          Boolean(selection) || this.#gesture.startedWithSelection;
        if (selection) {
          // Native light-dismiss runs on this release too. Open in a new task
          // so the selection gesture cannot immediately dismiss its popover.
          this.#selectionTimeout = setTimeout(() => {
            this.#selectionTimeout = null;
            // A click inside selected text can clear it after pointerup.
            if (getSequenceSelection(root)) {
              this.#showSelection(selection);
            }
          }, 0);
        }
      },
      { signal }
    );
    root.addEventListener(
      'keyup',
      (event) => {
        if (
          this.#popover.contains(event.target) ||
          (event instanceof KeyboardEvent && event.key === 'Escape')
        ) {
          return;
        }
        const selection = getSequenceSelection(root);
        if (selection) {
          this.#showSelection(selection);
        }
      },
      { signal }
    );
    root.addEventListener(
      'click',
      (event) => {
        if (
          event instanceof MouseEvent &&
          !this.#popover.contains(event.target)
        ) {
          if (this.#gesture.suppressClick) {
            this.#gesture.suppressClick = false;
            return;
          }
          void this.#handleClick(event);
        }
      },
      { signal }
    );
    const leave = () => {
      if (this.#state.kind !== 'features') {
        this.#clearHover();
      }
      this.#closeCoordinates();
    };
    host.addEventListener('mouseleave', leave, { signal });
    host.ownerDocument.addEventListener('scroll', leave, {
      capture: true,
      signal
    });
    root.addEventListener('scroll', leave, { capture: true, signal });
    window.addEventListener('resize', leave, { signal });
    host.ownerDocument.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          this.reset();
        }
      },
      { signal }
    );
    host.ownerDocument.addEventListener(
      'pointercancel',
      () => {
        this.#gesture.selecting = false;
        leave();
      },
      { signal }
    );
  }

  reset() {
    this.#cancelPendingSelection();
    this.#request?.abort();
    this.#request = null;
    this.#clearHover();
    this.#state = { kind: 'closed' };
    this.#popover.close();
  }

  destroy() {
    this.#listeners.abort();
    this.reset();
  }

  #setState(state: PopoverState) {
    this.#state = state;
    if (state.kind === 'features') {
      this.#highlightLetter(state.letter);
    }
    this.#popover.render(state);
  }

  #clearHover() {
    this.#hovered?.sequenceContainer.classList.remove('has-hovered-letter');
    this.#highlight.remove();
    this.#hovered = null;
  }

  #closeCoordinates() {
    if (this.#state.kind === 'coordinates') {
      this.#setState({ kind: 'closed' });
    }
  }

  #handleHover(event: MouseEvent) {
    if (
      this.#state.kind === 'features' ||
      this.#gesture.selecting ||
      event.buttons ||
      this.#popover.contains(event.target)
    ) {
      return;
    }
    const letter = getLetterInfoFromEvent(event);
    if (!letter) {
      this.#clearHover();
      this.#closeCoordinates();
      return;
    }
    if (!this.#highlightLetter(letter)) {
      return;
    }
    if (this.#state.kind === 'closed' || this.#state.kind === 'coordinates') {
      this.#setState({ kind: 'coordinates', letter });
    }
  }

  #highlightLetter(letter: LetterHit) {
    if (
      this.#hovered?.lineBlock === letter.lineBlock &&
      this.#hovered.index === letter.index
    ) {
      return false;
    }
    const lineRect = letter.lineBlock.getBoundingClientRect();
    this.#clearHover();
    this.#hovered = letter;
    letter.sequenceContainer.classList.add('has-hovered-letter');
    Object.assign(this.#highlight.style, {
      left: `${letter.rect.left - lineRect.left - letter.lineBlock.clientLeft}px`,
      top: `${letter.rect.top - lineRect.top - letter.lineBlock.clientTop}px`,
      width: `${letter.rect.width}px`,
      height: `${letter.rect.height}px`
    });
    letter.lineBlock.append(this.#highlight);
    return true;
  }

  async #handleClick(event: MouseEvent) {
    const letter = getLetterInfoFromEvent(event);
    if (!letter) {
      return;
    }
    const params = this.options.getOverlapRequestParams();
    if (!params) {
      return;
    }
    this.#request?.abort();
    const request = new AbortController();
    this.#request = request;
    this.#setState({
      kind: 'features',
      letter,
      content: { status: 'loading' }
    });
    try {
      const template = await fetchOverlapTemplate(
        { ...params, location: letter.location },
        request.signal
      );
      if (this.#request === request && !request.signal.aborted) {
        this.#setState({
          kind: 'features',
          letter,
          content: { status: 'ready', template }
        });
      }
    } catch {
      if (this.#request === request && !request.signal.aborted) {
        this.#setState({
          kind: 'features',
          letter,
          content: { status: 'error' }
        });
      }
    }
  }

  #showSelection(selection: SequenceSelection) {
    this.#cancelPendingSelection();
    this.#request?.abort();
    this.#request = null;
    this.#clearHover();
    this.#setState({ kind: 'selection', selection });
  }

  #cancelPendingSelection() {
    if (this.#selectionTimeout !== null) {
      clearTimeout(this.#selectionTimeout);
      this.#selectionTimeout = null;
    }
  }
}
