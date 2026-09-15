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

import type { TranscriptSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/transcriptSummaryQuery';
import type { TranscriptView } from 'src/content/app/sequence-viewer/types/transcriptView';

const LINE_LENGTH = 60;

type CDNASequenceSpan = {
  startIndex: number; // from transcript start
  endIndex: number; // from transcript start
  transcriptStartIndex: number;
  transcriptEndIndex: number;
  sequence: string;
};

export class TranscriptSequence extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .block {
      display: block;
      width: max-content;
      margin-bottom: 1rem;
    }

    .block-line {
      display: grid;
      grid-template-columns: repeat(3, max-content);
      font-family: var(--font-family-monospace);
      column-gap: 1rem;
    }

    .block-line-left,
    .block-line-right {
      width: fit-content;
    }

    .block-line-left {
      text-align: right;
    }

    .padded-number {
      white-space: pre;
    }
  `;

  static properties = {
    sequence: { type: String },
    transcript: { type: Object },
    view: { type: String }
  };

  // FIXME: change this to @property
  declare sequence: string;
  declare proteinSequence: string | null;
  declare transcript: TranscriptSummaryQueryResult['transcript'] | null;
  declare view: TranscriptView;

  constructor() {
    super();
    this.sequence = '';
    this.transcript = null;
    this.proteinSequence = null;
    this.view = 'genomic';
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
    if (this.view === 'cdna') {
      return this.#renderCDNA();
    }

    const lines = this.#getSequenceLines();
    const padLeftLength =
      this.transcript?.slice.location.length.toString().length ?? 0;

    return html`
      ${lines.map((line, index) => {
        const numberStart = LINE_LENGTH * index + 1;
        const numberEnd = numberStart + LINE_LENGTH;

        return html`
          <div class="block-line">
            <div class="block-line-left">
              <span class="padded-number"
                >${numberStart.toString().padStart(padLeftLength, ' ')}</span
              >
            </div>
            <div class="line">${line}</div>
            <div class="block-line-right">${numberEnd}</div>
          </div>
        `;
      })}
    `;
  }

  #renderCDNA() {
    if (!this.sequence || !this.transcript) {
      return null;
    }

    const transcript = this.transcript;
    const transcriptSequence = this.sequence;
    const proteinContext = transcript.product_generating_contexts.find(
      (context) => context.product_type === 'Protein'
    );
    const cds = proteinContext?.cds ?? null;
    // const proteinSequence = this.proteinSequence;
    const exons = transcript.spliced_exons;

    // Prepare cDNA spans
    const cdnaSpans: CDNASequenceSpan[] = [];

    let cdnaStartIndex = 0;

    for (const exon of exons) {
      // API coordinates are 1-based and inclusive. Convert the start to a
      // zero-based index and use the API end as the JS slice end.
      let transcriptStartIndex = exon.relative_location.start - 1;
      const transcriptEndIndex = exon.relative_location.end;

      while (transcriptStartIndex < transcriptEndIndex) {
        let cdnaSpan = cdnaSpans.at(-1);

        if (!cdnaSpan || cdnaSpan.sequence.length === LINE_LENGTH) {
          cdnaSpan = {
            startIndex: cdnaStartIndex,
            endIndex: cdnaStartIndex,
            transcriptStartIndex,
            transcriptEndIndex: transcriptStartIndex,
            sequence: ''
          };
          cdnaSpans.push(cdnaSpan);
        }

        const remainingCapacity = LINE_LENGTH - cdnaSpan.sequence.length;
        const length = Math.min(
          remainingCapacity,
          transcriptEndIndex - transcriptStartIndex
        );

        // Slice from the exon/source coordinates, not from the cDNA
        // coordinates. The latter no longer match after an intron is removed.
        cdnaSpan.sequence += transcriptSequence.slice(
          transcriptStartIndex,
          transcriptStartIndex + length
        );
        cdnaSpan.endIndex += length;
        cdnaSpan.transcriptEndIndex = transcriptStartIndex + length;

        cdnaStartIndex += length;
        transcriptStartIndex += length;
      }
    }

    return cdnaSpans.map((span) =>
      this.#renderCDNABlock({
        cdnaSpan: span,
        cds
      })
    );
  }

  #renderCDNABlock({
    cdnaSpan,
    cds
  }: {
    cdnaSpan: CDNASequenceSpan;
    cds: {
      relative_start: number;
      relative_end: number;
    } | null;
  }) {
    const start = cdnaSpan.startIndex + 1;
    const end = cdnaSpan.endIndex;

    // FIXME: calculate padleft from the full cDNA length
    const padLeftLength = 5;

    // FIXME: change block / row

    const cdnaRow = html`
      <div class="block-line">
        <div class="block-line-left">
          <span class="padded-number"
            >${start.toString().padStart(padLeftLength, ' ')}</span
          >
        </div>
        <div>${cdnaSpan.sequence}</div>
        <div class="block-line-right">${end}</div>
      </div>
    `;

    const blockRows = [cdnaRow];

    const { transcriptStartIndex, transcriptEndIndex } = cdnaSpan;
    const transcriptStart = transcriptStartIndex + 1;
    const transcriptEnd = transcriptEndIndex;

    if (
      cds &&
      cds.relative_end >= transcriptStart &&
      cds.relative_start <= transcriptEnd
    ) {
      // CDS line
      const cdsStartIndex = Math.max(
        cds.relative_start - 1,
        transcriptStart - 1
      );
      const cdsEndIndex = Math.min(cds.relative_end, transcriptEnd);
      let cdsSequence = this.sequence.slice(cdsStartIndex, cdsEndIndex);
      // Keep the annotation row aligned with the cDNA row. CDS coordinates
      // currently refer to the source transcript sequence, while a cDNA span
      // may be assembled from more than one exon. Therefore never use the
      // raw coordinate difference as an unconstrained padding length.
      const offsetLeft = Math.max(
        0,
        Math.min(cdnaSpan.sequence.length, cdsStartIndex - transcriptStartIndex)
      );
      const availableLength = Math.max(
        0,
        cdnaSpan.sequence.length - offsetLeft
      );
      cdsSequence = cdsSequence.slice(0, availableLength);
      const offsetRight = Math.max(
        0,
        cdnaSpan.sequence.length - offsetLeft - cdsSequence.length
      );

      if (offsetLeft) {
        const padding = Array(offsetLeft).fill('.').join('');
        cdsSequence = `${padding}${cdsSequence}`;
      }
      if (offsetRight) {
        const padding = Array(offsetRight).fill('.').join('');
        cdsSequence = `${cdsSequence}${padding}`;
      }

      const cdsRow = html`
        <div class="block-line">
          <div class="block-line-left">
            <span class="padded-number"
              >${start.toString().padStart(padLeftLength, ' ')}</span
            >
          </div>
          <div>${cdsSequence}</div>
          <div class="block-line-right">${end}</div>
        </div>
      `;

      blockRows.push(cdsRow);

      // Protein line
      // const phase = cds.relative_start > start + 1 ? 0 : (start + 1 - cds.relative_start) % 3;
    } else if (cds) {
      const emptySequence = Array(LINE_LENGTH).fill('.').join('');

      const cdsRow = html`
        <div class="block-line">
          <div class="block-line-left">
            <span class="padded-number"
              >${Array(padLeftLength).fill(' ').join('')}</span
            >
          </div>
          <div>${emptySequence}</div>
          <div class="block-line-right"></div>
        </div>
      `;

      blockRows.push(cdsRow);
    }

    return html` <div class="block">${blockRows}</div> `;
  }
}

window.customElements.define(
  'ens-sequence-viewer-transcript-sequence',
  TranscriptSequence
);
