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

/**
 * A NOTE ABOUT THIS COMPONENT:
 *
 * 1. RENDERING THE SEQUENCE
 * Each sequence line is a grid that contains the sequence itself,
 * as well as the numbers at the start and the end of the sequence line
 * to indicate the coordinates of the nucleotides in the line.
 *
 * Every sequence line is rendered in a monospace font.
 * The width of the middle part of each line (containing the sequence itself)
 * is 60 characters; and the width of the left and right columns are
 * passed from the parent as a `--gutter-width` property.
 *
 * Lines are grouped into chunks that have `content-visibility: auto`
 * and a calculated containIntrinsicSize CSS property. This is done
 * so the browser can skip rendering whole sections of the sequence
 * when they are offscreen, which should improve the performance
 * during the initial rendering and subsequent scrolling.
 *
 * 2. INTERACTIVITY
 * The component supports the following kinds of interaction:
 * - Upon moving the mouse cursor over a letter, the component:
 *  - Highlights the outline of the letter
 *  - Shows a popover with letter coordinates next to the letter
 * - Upon a click on a letter, the component fetches the features
 *   that overlap the coordinate of this letter, and show them
 *   in a popover
 * - Upon selection of a subsequence, the component shows a popover
 *   that has a "Copy" button (to copy the sequence with a FASTA header),
 *   and a button that takes user to genome browser.
 */

import { SequenceInteractions } from './sequence-interactions';

import type { OverlapRequestParamsWithoutLocation } from '../overlapRequest';

const staticStyles = `
  :host {
    --_column-gap: var(--sequence-line-column-gap, 1rem);
    font-family: var(--font-family-monospace);
  }

  .content-visibility-block {
    content-visibility: auto;
    width: calc(2 * var(--gutter-width) + 60ch + 2 * var(--_column-gap));
  }

  .line {
    position: relative;
    display: grid;
    grid-template-columns: var(--gutter-width) 60ch var(--gutter-width);
    column-gap: var(--_column-gap);
    align-items: baseline;
    width: calc(2 * var(--gutter-width) + 60ch + 2 * var(--_column-gap));
  }

  .line-middle.has-hovered-letter,
  .line-middle.has-hovered-letter * {
    cursor: pointer;
  }

  .line-left, .line-right {
    font-size: 12px;
    font-weight: var(--font-weight-light);
    -webkit-user-select: none;
    user-select: none;
  }

  .line-left {
    text-align: right;
  }

  .protein-line {
    margin-bottom: 5px;
  }

  .protein {
    white-space: pre;
  }

  .letter-highlight {
    position: absolute;
    pointer-events: none;
    user-select: none;
    box-sizing: border-box;
    outline: 1px solid var(--color-black);
  }


  [popover]:popover-open {
    background-color: var(--color-black);
    color: var(--color-white);
    border: none;
    padding: 12px 20px;
    max-height: min(80cqh, calc(100dvh - 16px));
    box-sizing: border-box;
    overflow: auto;
    filter: drop-shadow(2px 2px 3px var(--shadow-color));
    position-try-fallbacks: --popover-center-on-line;
  }

  .sequence-popover[data-mode="coordinates"] {
    pointer-events: none;
  }

  .sequence-popover-actions {
    display: flex;
    gap: 12px;
    margin-top: 12px;
  }

  .sequence-popover button {
    font: inherit;
    color: var(--color-white);
  }

  .sequence-popover button {
    background: var(--color-blue);
    border: none;
    padding: 6px 12px;
    cursor: pointer;
  }

  .sequence-popover {
    position: fixed;
    inset: auto;
    margin: 0;
    left: calc(anchor(left) + var(--letter-offset-x));
    top: calc(anchor(top) + var(--letter-offset-y) + 6px);
  }

  @position-try --popover-center-on-line {
    top: auto;
    bottom: auto;
    height: max-content;
    align-self: anchor-center;
  }
`;

const LINES_PER_CHUNK = 100;

export type LegendEventDetail = {
  template: string | null;
};

export class Sequence extends HTMLElement {
  #interactions: SequenceInteractions | null = null;
  getOverlapRequestParams:
    (() => OverlapRequestParamsWithoutLocation | undefined) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.#interactions?.destroy();
    this.#interactions = new SequenceInteractions({
      host: this,
      root: this.shadowRoot!,
      getOverlapRequestParams: () => this.getOverlapRequestParams?.()
    });
  }

  disconnectedCallback() {
    this.#interactions?.destroy();
    this.#interactions = null;
    this.#reportLegend(null);
  }

  set sequence(htmlTemplate: string) {
    const parsedTemplate = new DOMParser().parseFromString(
      htmlTemplate,
      'text/html'
    );
    const sequenceTemplate =
      parsedTemplate.querySelector<HTMLTemplateElement>('template#sequence');
    const stylesTemplate =
      parsedTemplate.querySelector<HTMLTemplateElement>('template#styles');
    const legendTemplate =
      parsedTemplate.querySelector<HTMLTemplateElement>('template#legend');

    if (!sequenceTemplate || !stylesTemplate) {
      throw new Error('No template found in response!');
    }

    this.#updateStyles(stylesTemplate);

    this.#renderChunks(sequenceTemplate);

    const legendTemplateForEvent = legendTemplate
      ? legendTemplate.outerHTML + stylesTemplate.outerHTML
      : null;

    this.#reportLegend(legendTemplateForEvent);
  }

  #reportLegend(template: string | null) {
    this.dispatchEvent(
      new CustomEvent<LegendEventDetail>('report-legend', {
        detail: { template },
        bubbles: true
      })
    );
  }

  #renderChunks(sequenceTemplate: HTMLTemplateElement) {
    this.#interactions?.reset();
    const groupedContent = document.createDocumentFragment();
    let linesInChunk: HTMLElement[] = [];

    const appendChunk = () => {
      if (!linesInChunk.length) {
        return;
      }

      const chunk = document.createElement('div');
      chunk.className = 'content-visibility-block';
      chunk.style.containIntrinsicSize = `auto ${linesInChunk.length}lh`;
      chunk.append(...linesInChunk);
      groupedContent.append(chunk);
      linesInChunk = [];
    };

    for (const node of Array.from(sequenceTemplate.content.childNodes)) {
      if (node instanceof HTMLElement && node.classList.contains('line')) {
        linesInChunk.push(node);
        if (linesInChunk.length === LINES_PER_CHUNK) {
          appendChunk();
        }
      } else if (
        node.nodeType === Node.TEXT_NODE &&
        !node.textContent?.trim()
      ) {
        // Ignore whitespace between the formatted template's line divs.
      } else {
        appendChunk();
        groupedContent.append(node);
      }
    }
    appendChunk();

    const resultContainer = this.shadowRoot;
    resultContainer!.replaceChildren(groupedContent);
  }

  #updateStyles(stylesTemplate: HTMLTemplateElement) {
    const dynamicStylesNode = stylesTemplate.content.querySelector('style');

    const staticStyleSheet = new CSSStyleSheet();
    staticStyleSheet.replaceSync(staticStyles);

    const styleSheets: CSSStyleSheet[] = [staticStyleSheet];

    if (dynamicStylesNode) {
      const dynamicStyles = dynamicStylesNode.textContent;
      const dynamicStyleSheet = new CSSStyleSheet();
      dynamicStyleSheet.replaceSync(dynamicStyles);
      styleSheets.push(dynamicStyleSheet);
    }

    this.shadowRoot!.adoptedStyleSheets = styleSheets;
  }
}

window.customElements.define('ens-sequence-viewer-sequence', Sequence);
