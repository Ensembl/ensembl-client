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
 * A NOTE ABOUT THE STYLES:
 *
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
 */

const styles = `
  :host {
    font-family: var(--font-family-monospace);
  }

  .content-visibility-block {
    content-visibility: auto;
  }

  .line {
    --_column-gap: 1rem;
    display: grid;
    grid-template-columns: var(--gutter-width) 60ch var(--gutter-width);
    column-gap: var(--_column-gap);
    align-items: baseline;
    width: calc(2 * var(--gutter-width) + 60ch + 2 * var(--_column-gap));
  }

  .line-left, .line-right {
    font-size: 12px;
    font-weight: var(--font-weight-light);
    user-select: none;
  }

  .line-left {
    text-align: right;
  }

  .flank {
    font-weight: var(--font-weight-light);
  }

  .exon {
    background-color: cadetblue;
  }

  .intron {
    background-color: rgba(0, 100, 0, 0.5);
  }

  .cds {
    background-color: rebeccapurple;
  }

  .utr {
    background-color: teal;
  }

  .mixed {
    background-color: hotpink;
  }
`;

const LINES_PER_CHUNK = 100;

export class GeneSequence extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);

    shadow.adoptedStyleSheets = [styleSheet];
  }

  set sequence(htmlTemplate: string) {
    const parsedTemplate = new DOMParser().parseFromString(
      htmlTemplate,
      'text/html'
    );
    const templateElement = parsedTemplate.querySelector('template');

    if (!templateElement) {
      throw new Error('No template found in response!');
    }

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

    for (const node of Array.from(templateElement.content.childNodes)) {
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
}

window.customElements.define('ens-sequence-viewer-gene-sequence', GeneSequence);
