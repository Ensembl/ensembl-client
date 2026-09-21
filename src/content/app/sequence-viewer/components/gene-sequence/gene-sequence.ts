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

import {
  generateFeatureLookup,
  type GeneFeaturesLookup
} from './getSequenceIntervals';

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
      width: 60ch;
      contain: size layout;
      contain: strict;
      /* width: max-content; */
      content-visibility: auto;
      contain-intrinsic-size: 60ch 1lh;
    }

    .coding {
      background: var(--color-grey);
    }

    .container-left,
    .container-right {
      width: fit-content;
      width: 6ch;
      contain: strict;
      content-visibility: auto;
      contain-intrinsic-size: 6ch 1lh;
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

  #getCodingIntervals({
    featureLookup
  }: {
    featureLookup: GeneFeaturesLookup;
  }) {
    const geneStart = this.gene!.slice.location.start;

    const codingExonIntervals = featureLookup.cds_regions.flatMap((cds) =>
      featureLookup.exons.flatMap((exon) => {
        const start = Math.max(cds.start, exon.start);
        const end = Math.min(cds.end, exon.end);

        return start <= end ? [{ start, end }] : [];
      })
    );

    return codingExonIntervals.map(({ start, end }) => ({
      start: start - geneStart,
      end: end - geneStart + 1
    }));
  }

  #getLineParts({
    lineIndex,
    lineSequence,
    codingIntervals
  }: {
    lineIndex: number;
    lineSequence: string;
    codingIntervals: { start: number; end: number }[];
  }) {
    const lineStart = lineIndex * LINE_LENGTH;
    const lineEnd = lineStart + lineSequence.length;
    const boundaries = new Set([lineStart, lineEnd]);

    for (const interval of codingIntervals) {
      if (interval.start < lineEnd && interval.end > lineStart) {
        boundaries.add(Math.max(interval.start, lineStart));
        boundaries.add(Math.min(interval.end, lineEnd));
      }
    }

    const sortedBoundaries = [...boundaries].sort((a, b) => a - b);

    return sortedBoundaries.slice(0, -1).map((start, index) => {
      const end = sortedBoundaries[index + 1];
      const text = lineSequence.slice(start - lineStart, end - lineStart);
      const coding = codingIntervals.some(
        (interval) => interval.start < end && interval.end > start
      );

      return { text, coding };
    });
  }

  render() {
    if (!this.gene) {
      return null;
    }
    const lines = this.#getSequenceLines();
    const featureLookup = generateFeatureLookup(this.gene);
    const codingIntervals = this.#getCodingIntervals({ featureLookup });

    return html`
      <div class="container-left">
        ${lines.map((_, index) => {
          const number = LINE_LENGTH * index + 1;
          return html`<span class="side-line">${number}</span> `;
        })}
      </div>

      <div class="container-center">
        ${lines.map((line, index) => {
          const parts = this.#getLineParts({
            lineIndex: index,
            lineSequence: line,
            codingIntervals
          });
          return html`
            <span class="line">
              ${parts.map(
                (part) =>
                  html`<span class=${part.coding ? 'coding' : ''}
                    >${part.text}</span
                  >`
              )}
            </span>
          `;
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
