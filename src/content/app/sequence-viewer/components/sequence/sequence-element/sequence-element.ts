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

import {
  fetchOverlapTemplate,
  type OverlapRequestParamsWithoutLocation
} from '../overlapRequest';

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

  .line:has(.letter-highlight) .line-middle {
  }

  .line-left, .line-right {
    font-size: 12px;
    font-weight: var(--font-weight-light);
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
    max-height: 80cqh;
    filter: drop-shadow(2px 2px 3px var(--shadow-color));
    position-try-fallbacks: --popover-center-on-line;
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
  #popoverCounter = 0;
  // #letterHighlight: HTMLDivElement | null = null;
  getOverlapRequestParams:
    (() => OverlapRequestParamsWithoutLocation | undefined) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // add a shadow DOM
  }

  connectedCallback() {
    this.#setListeners();
  }

  disconnectedCallback() {
    this.#reportLegend(null);
  }

  #setListeners() {
    // TODO: make sure that this only happens on click, not on select
    this.shadowRoot!.addEventListener('click', (event) => {
      if (event instanceof PointerEvent) {
        this.#handleClick(event);
      }
    });

    // this.shadowRoot!.addEventListener('mousemove', (event) => {
    //   if (!(event instanceof MouseEvent)) {
    //     return;
    //   }
    //   this.#handleHover(event);
    // });

    this.shadowRoot!.addEventListener('pointerout', (event) => {
      if (!(event instanceof PointerEvent)) {
        return;
      }
      // console.log(event.target, event.relatedTarget);
    });
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

  // #handleHover(event: MouseEvent) {
  //   const letterInfo = getLetterInfoFromEvent(event);
  //   console.log('letterInfo', letterInfo);
  // }

  #handleClick(event: PointerEvent) {
    event.preventDefault();
    const letterInfo = getLetterInfoFromEvent(event);

    if (!letterInfo) {
      return;
    }

    const overlapRequestParams = this.getOverlapRequestParams?.();

    if (overlapRequestParams) {
      fetchOverlapTemplate({
        ...overlapRequestParams,
        location: letterInfo.location
      }).then((template) => this.#injectOverlapInfoInPopover(template));
    }

    this.#showPopover({
      location: letterInfo.location,
      sequence: letterInfo.character,
      boundingRect: letterInfo.rect,
      anchorLine: letterInfo.lineBlock
    });
  }

  #showPopover({
    sequence,
    location,
    anchorLine,
    boundingRect
  }: {
    sequence: string;
    location: { start: number; end: number };
    boundingRect: Omit<DOMRect, 'toJSON'>;
    anchorLine: HTMLElement;
  }) {
    this.#popoverCounter++;
    const anchorName = `--sequence-line-${this.#popoverCounter}`;

    const popover = document.createElement('div');
    popover.popover = 'auto';

    const textContent = `${sequence}: ${location.start}`;

    popover.textContent = textContent;
    this.shadowRoot!.append(popover);

    // set styles for anchor positioning
    const anchorLineRect = anchorLine.getBoundingClientRect();
    anchorLine.style.setProperty('anchor-name', anchorName);
    popover.style.setProperty('position-anchor', anchorName);
    popover.style.setProperty(
      '--letter-offset-x',
      `${boundingRect.right - anchorLineRect.left}px`
    );
    popover.style.setProperty(
      '--letter-offset-y',
      `${boundingRect.bottom - anchorLineRect.top}px`
    );

    popover.className = 'sequence-popover';

    // maybe i don't even need this? just always have a popover available in the dom?
    popover.addEventListener('toggle', (event) => {
      if (event.newState === 'closed') {
        popover.remove();

        // Check that there isn't another popover anchored to this line.
        if (anchorLine.style.getPropertyValue('anchor-name') !== anchorName) {
          return;
        }

        anchorLine.style.removeProperty('anchor-name');

        if (anchorLine.style.length === 0) {
          anchorLine.removeAttribute('style');
        }
        anchorLine.style.removeProperty('anchor-name');
      }
    });

    popover.showPopover();
  }

  #injectOverlapInfoInPopover(template: string) {
    const popover = this.shadowRoot!.querySelector('div[popover]');
    const parsedTemplate = new DOMParser().parseFromString(
      template,
      'text/html'
    );
    // const templateContent = parsedTemplate.body.childNodes;

    popover?.append(
      ...parsedTemplate.head.childNodes,
      ...parsedTemplate.body.childNodes
    );
  }
}

const getLetterInfoFromEvent = (event: PointerEvent | MouseEvent) => {
  const target = event.target as HTMLElement;
  const sequenceContainer = target.closest('.line-middle');
  const lineBlock = target.closest('.line') as HTMLElement | null;

  const startAttr = lineBlock?.dataset.start;
  const endAttr = lineBlock?.dataset.end;

  if (!sequenceContainer || !lineBlock || !startAttr || !endAttr) {
    return null;
  }

  const start = Number(startAttr);
  const end = Number(endAttr);
  const step = end < start ? -1 : 1;

  const walker = document.createTreeWalker(
    sequenceContainer,
    NodeFilter.SHOW_TEXT
  );
  const range = document.createRange();
  let characterIndex = 0;
  let hit = null;

  while (walker.nextNode()) {
    const textNode = walker.currentNode;

    // a check to make typescript happy
    if (!(textNode instanceof Text)) {
      continue;
    }

    for (let offset = 0; offset < textNode.length; offset++) {
      range.setStart(textNode, offset);
      range.setEnd(textNode, offset + 1);

      const rect = range.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        const locationStart = start + step * characterIndex;
        const locationEnd = locationStart;

        hit = {
          character: textNode.data[offset],
          index: characterIndex,
          location: {
            start: locationStart,
            end: locationEnd
          },
          rect: {
            x: rect.x,
            y: rect.y,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },
          lineBlock
        };
        break;
      }

      characterIndex++;
    }

    if (hit) {
      break;
    }
  }

  return hit;
};

window.customElements.define('ens-sequence-viewer-sequence', Sequence);
