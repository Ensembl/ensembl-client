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

import { html, css, LitElement } from 'lit';

import type { SequenceViewerGene } from 'src/content/app/sequence-viewer/state/api/queries/geneQuery';

const LINE_LENGTH = 60;

export class GeneSequence extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: repeat(3, max-content);
      column-gap: 1rem;
    }

    .line {
      display: block;
      font-family: var(--font-family-monospace);
      width: max-content;
      content-visibility: auto;
      contain-intrinsic-size: 60ch 1lh;
    }

    .container-left,
    .container-right {
      width: fit-content;
    }

    .container-left .side-line {
      text-align: right;
    }

    .side-line {
      display: block;
    }
  `;

  static properties = {
    sequence: { type: String }
  };

  // FIXME: change this to @property
  declare sequence: string;
  declare gene: SequenceViewerGene | null;

  constructor() {
    super();
    this.sequence = '';
    this.gene = null;
  }

  #getSequenceLines() {
    if (!this.sequence) {
      return [];
    }

    const lines: string[] = [];

    for (let i = 0; i < this.sequence.length; i = i + LINE_LENGTH) {
      const start = i;
      const end = i + LINE_LENGTH;
      const slice = this.sequence.slice(start, end);
      lines.push(slice);
    }

    return lines;
  }

  render() {
    const lines = this.#getSequenceLines();

    return html`
      <div class="container-left">
        ${lines.map((_, index) => {
          const number = LINE_LENGTH * index + 1;
          return html`<span class="side-line">${number}</span> `;
        })}
      </div>

      <div class="container-center">
        ${lines.map((line) => {
          return html`<span class="line">${line}</span> `;
        })}
      </div>

      <div class="container-right">
        ${lines.map((_, index) => {
          const number = LINE_LENGTH * index + LINE_LENGTH;
          return html`<span class="side-line">${number}</span> `;
        })}
      </div>
    `;
  }
}

window.customElements.define('ens-sequence-viewer-gene-sequence', GeneSequence);
