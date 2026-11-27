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
  getOverlapRequestParams
} from './overlapRequest';
import { getSelectionFastaHeader } from './sequence-fasta';
import {
  getLetterInfoFromEvent,
  getSequenceSelection
} from './sequence-hit-testing';
import { SequencePopover, type PopoverState } from './sequence-popover';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';
import type {
  SequenceContext,
  SequenceTemplateMetadata
} from './sequence-element';
import type { LetterHit, SequenceSelection } from './sequence-hit-testing';

type Options = {
  host: HTMLElement;
  root: ShadowRoot;
  getSequenceContext: () => SequenceContext | undefined;
  getTemplateMetadata: () => SequenceTemplateMetadata | undefined;
};

export class SequenceInteractions {
  #listenerController = new AbortController();
  #requestController: AbortController | null = null;
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
    const { signal } = this.#listenerController;
    this.#popover = new SequencePopover(root, () => this.reset());
    this.#highlight.className = 'letter-highlight';

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
        const startedWithSelection = Boolean(this.#getSelection());
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
        const selection = this.#getSelection(event);
        this.#gesture.suppressClick =
          Boolean(selection) || this.#gesture.startedWithSelection;
        if (selection) {
          // Native light-dismiss runs on this release too. Open in a new task
          // so the selection gesture cannot immediately dismiss its popover.
          this.#selectionTimeout = setTimeout(() => {
            this.#selectionTimeout = null;
            // A click inside selected text can clear it after pointerup.
            if (this.#getSelection()) {
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
        const selection = this.#getSelection();
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
    this.#requestController?.abort();
    this.#requestController = null;
    this.#clearHover();
    this.#state = { kind: 'closed' };
    this.#popover.close();
  }

  destroy() {
    this.#listenerController.abort();
    this.reset();
  }

  #setState(state: PopoverState) {
    this.#state = state;
    if (state.kind === 'features') {
      this.#highlightLetter(state.letter);
    }
    this.#popover.render(state, this.options.getTemplateMetadata()?.regionName);
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
    const context = this.options.getSequenceContext();
    if (!context) {
      return;
    }
    const params = getOverlapRequestParams(context);
    this.#requestController?.abort();
    const requestController = new AbortController();
    this.#requestController = requestController;
    this.#setState({
      kind: 'features',
      letter,
      content: { status: 'loading' }
    });
    try {
      const template = await fetchOverlapTemplate(
        { ...params, location: letter.location },
        requestController.signal
      );
      if (
        this.#requestController === requestController &&
        !requestController.signal.aborted
      ) {
        this.#setState({
          kind: 'features',
          letter,
          content: { status: 'ready', template }
        });
      }
    } catch {
      if (
        this.#requestController === requestController &&
        !requestController.signal.aborted
      ) {
        this.#setState({
          kind: 'features',
          letter,
          content: { status: 'error' }
        });
      }
    }
  }

  #getSequenceType() {
    const context = this.options.getSequenceContext();
    return (
      this.options.getTemplateMetadata()?.sequenceType ??
      (context && 'transcript' in context ? context.sequenceView : 'genomic')
    );
  }

  #getSelection(releaseEvent?: PointerEvent) {
    return getSequenceSelection({
      root: this.options.root,
      releaseEvent,
      sequenceType: this.#getSequenceType()
    });
  }

  #showSelection(selection: SequenceSelection) {
    this.#cancelPendingSelection();
    this.#requestController?.abort();
    this.#requestController = null;
    this.#clearHover();
    const context = this.options.getSequenceContext();
    const metadata = this.options.getTemplateMetadata();
    const sequenceType = this.#getSequenceType();
    const regionName =
      metadata?.regionName ||
      (context && 'location' in context
        ? context.location.regionName
        : undefined);
    const genomeBrowserLocation =
      sequenceType === 'genomic' && regionName
        ? getGenomeBrowserLocationForSelection({
            regionName,
            start: selection.start,
            end: selection.end,
            regionLength: metadata?.regionLength
          })
        : undefined;
    const header = getSelectionFastaHeader({
      metadata,
      sequenceType,
      selection
    });
    const sequenceToCopy = header
      ? `${header}\n${selection.sequence}`
      : selection.sequence;
    this.#setState({
      kind: 'selection',
      selection,
      sequenceType,
      sequenceToCopy,
      genomeBrowserLocation
    });
  }

  #cancelPendingSelection() {
    if (this.#selectionTimeout !== null) {
      clearTimeout(this.#selectionTimeout);
      this.#selectionTimeout = null;
    }
  }
}

const getGenomeBrowserLocationForSelection = ({
  regionName,
  start,
  end,
  regionLength
}: GenomicLocation & { regionLength?: number }): GenomicLocation => {
  // With no region length, the selection end is the last coordinate known to exist.
  const regionEnd = regionLength ?? Math.max(1, end);
  const selectionStart = Math.min(Math.max(1, start), regionEnd);
  const selectionEnd = Math.min(Math.max(selectionStart, end), regionEnd);
  const selectionLength = selectionEnd - selectionStart + 1;
  const minViewportSize = 30;
  const viewportSize = Math.min(
    Math.max(selectionLength, minViewportSize),
    regionEnd
  );
  const preferredStart =
    selectionStart - Math.ceil((viewportSize - selectionLength) / 2);
  const viewportStart = Math.min(
    Math.max(1, preferredStart),
    regionEnd - viewportSize + 1
  );

  return {
    regionName,
    start: viewportStart,
    end: viewportStart + viewportSize - 1
  };
};
