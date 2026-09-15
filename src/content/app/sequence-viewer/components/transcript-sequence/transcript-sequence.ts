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

type CDSSequenceSpan = {
  startIndex: number;
  endIndex: number;
  offsetFromStart: number;
};

type ProteinSequenceSpan = {
  startIndex: number;
  endIndex: number;
  offsetFromStart: number;
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

  #getMarkedIntervals() {
    if (!this.transcript) {
      return [];
    }

    // it may not be a coding transcript
    const cds = this.transcript.product_generating_contexts
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
    // const lines = this.#getSequenceLines();

    return this.#renderCDNA();


    // return html`
    //   <div class="container-left">
    //     ${lines.map((_, index) => {
    //       const number = LINE_LENGTH * index + 1;
    //       return html`<span class="side-line">${number}</span> `;
    //     })}
    //   </div>

    //   <div class="container-center">
    //     ${lines.map((line) => {
    //       return html`<span class="line">${line}</span> `;
    //     })}
    //   </div>

    //   <div class="container-right">
    //     ${lines.map((_, index) => {
    //       const number = LINE_LENGTH * index + LINE_LENGTH;
    //       return html`<span class="side-line">${number}</span> `;
    //     })}
    //   </div>
    // `;
  }

  #renderCDNA() {
    if (!this.sequence || !this.transcript) {
      return null;
    }

    const transcript = this.transcript;
    const transcriptSequence = this.sequence;
    const proteinContext = transcript.product_generating_contexts
      .find(context => context.product_type === 'Protein');
    const cds = proteinContext?.cds ?? null;
    const proteinSequence = this.proteinSequence;
    const exons = transcript.spliced_exons;

    // Prepare cDNA spans
    const cdnaSpans: CDNASequenceSpan[] = [];

    let cdnaStartIndex = 0;

    for (const exon of exons) {
      let relativeStart = exon.relative_location.start;
      const relativeEnd = exon.relative_location.end;
      const exonLength = relativeEnd - relativeStart + 1;

      const lastCDNASpan = cdnaSpans.at(-1);
      
      if (lastCDNASpan && lastCDNASpan.sequence.length < LINE_LENGTH) {
        const lastCDNASpanEndIndex = lastCDNASpan.endIndex;
        const remainingCapacity = LINE_LENGTH - lastCDNASpan.sequence.length;
        const remainder = Math.min(
          remainingCapacity,
          exonLength
        );
        // FIXME: what if the exon is so tiny it is shorter than the line?

        const newEndIndex = lastCDNASpanEndIndex + remainder;
        const sequenceSlice = transcriptSequence.slice(lastCDNASpan.startIndex, newEndIndex);

        lastCDNASpan.transcriptEndIndex = newEndIndex;
        lastCDNASpan.endIndex += remainder;
        lastCDNASpan.sequence = sequenceSlice;
        relativeStart = relativeStart + remainder; // move the pointer that will be used in subsequent cycle
      }

      for (let i = relativeStart - 1; i < relativeEnd; i += LINE_LENGTH) {
        const transcriptStartIndex = i;
        const transcriptEndIndex = Math.min(i + LINE_LENGTH, relativeEnd);
        const length = transcriptEndIndex - transcriptStartIndex;

        const cdnaSpan: CDNASequenceSpan = {
          startIndex: cdnaStartIndex,
          endIndex: cdnaStartIndex + length,
          transcriptStartIndex,
          transcriptEndIndex,
          sequence: transcriptSequence.slice(transcriptStartIndex, transcriptEndIndex)
        };
        cdnaSpans.push(cdnaSpan);

        cdnaStartIndex += length;
      }

    }


    return cdnaSpans.map(span => this.#renderCDNABlock({
      cdnaSpan: span,
      cds
    }));
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
          <span class="padded-number">${start.toString().padStart(padLeftLength, ' ')}</span>
        </div>
        <div>${cdnaSpan.sequence}</div>
        <div class="block-line-right">
          ${end}
        </div>
      </div>
    `;

    const blockRows = [
      cdnaRow
    ];

    const {transcriptStartIndex, transcriptEndIndex} = cdnaSpan;
    const transcriptStart = transcriptStartIndex + 1;
    const transcriptEnd = transcriptEndIndex;

    if (cds && cds.relative_end >= transcriptStart && cds.relative_start <= transcriptEnd) {
      // CDS line
      const cdsStartIndex = Math.max(cds.relative_start - 1, transcriptStart - 1);
      const cdsEndIndex = Math.min(cds.relative_end, transcriptEnd);
      let cdsSequence = this.sequence.slice(cdsStartIndex, cdsEndIndex);
      const offsetLeft = cds.relative_start > transcriptStart ? LINE_LENGTH - cdsSequence.length : 0;
      const offsetRight = cds.relative_end < transcriptEnd ? LINE_LENGTH - cdsSequence.length : 0;
      
      if (offsetLeft) {
        const padding = Array(offsetLeft).fill('.').join('');
        cdsSequence = `${padding}${cdsSequence}`;
      } if (offsetRight) {
        const padding = Array(offsetRight).fill('.').join('');
        cdsSequence = `${cdsSequence}${padding}`;
      }

      const cdsRow = html`
        <div class="block-line">
          <div class="block-line-left">
            <span class="padded-number">${start.toString().padStart(padLeftLength, ' ')}</span>
          </div>
          <div>${cdsSequence}</div>
          <div class="block-line-right">
            ${end}
          </div>
        </div>
      `;

      blockRows.push(cdsRow);

      // Protein line
      const phase = cds.relative_start > start + 1 ? 0 : (start + 1 - cds.relative_start) % 3;
    } else if (cds) {
      const emptySequence = Array(LINE_LENGTH).fill('.').join('');

      const cdsRow = html`
        <div class="block-line">
          <div class="block-line-left">
            <span class="padded-number">${Array(padLeftLength).fill(' ').join('')}</span>
          </div>
          <div>${emptySequence}</div>
          <div class="block-line-right">
            
          </div>
        </div>
      `;

      blockRows.push(cdsRow);
    }

    return html`
      <div class="block">
        ${blockRows}
      </div>
    `;
  }
}

window.customElements.define(
  'ens-sequence-viewer-transcript-sequence',
  TranscriptSequence
);
