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

const styles = `
  :host {
    font-family: var(--font-family-monospace);
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
    background-color: hotpink;
  }

  .codon-odd {
    background-color: #6fa2f9;
  }

  .codon-even {
    background-color: #c8d7fa;
  }

  .protein-line {
    margin-bottom: 5px;
  }

  .protein {
    white-space: pre;
  }
`;

// SOMETHING TO CONSIDER:
// 1. Should sequence outlet components for gene, transcript, and location
//    be united into just one component?
// 2. Should transcript sequence have the same CSS performance-improving
//    approach with content-visibility: auto as gene sequence?

export class TranscriptSequence extends HTMLElement {
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

    const resultContainer = this.shadowRoot;
    resultContainer!.replaceChildren(templateElement.content);
  }
}

window.customElements.define(
  'ens-sequence-viewer-transcript-sequence',
  TranscriptSequence
);
