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
    content-visibility: auto;
    contain-intrinsic-size: 60ch 1lh;
  }

  .line-left, .line-right {
    font-size: 12px;
    font-weight: var(--font-weight-light);
    user-select: none;
  }

  .line-left {
    text-align: right;
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

    const resultContainer = this.shadowRoot;
    resultContainer!.replaceChildren(templateElement.content);
  }
}

window.customElements.define('ens-sequence-viewer-gene-sequence', GeneSequence);

/**

export class GeneSequence extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .line {
      --_column-gap: 1rem;
      display: grid;
      grid-template-columns: [gutter-left] var(
          --gutter-width
        ) [main] 60ch [gutter-right] var(--gutter-width);
      column-gap: 1rem;
      font-family: var(--font-family-monospace);
      width: calc(2 * var(--gutter-width) + 60ch + 2 * var(--_column-gap));
      contain: size layout;
      contain: strict;
      content-visibility: auto;
      contain-intrinsic-size: 60ch 1lh;
    }

    .coding {
      background: var(--color-grey);
    }

    .container-left,
    .container-right {
      width: var(--gutter-width);
      user-select: none;
    }

    .container-left {
      text-align: right;
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
    const geneLength = this.gene.slice.location.length;
    const gutterWidth = `${geneLength}`.length;

    const gutterWidthStyleRule = `--gutter-width: ${gutterWidth}ch;`;

    return html`
      ${lines.map((line, index) => {
        const parts = this.#getLineParts({
          lineIndex: index,
          lineSequence: line,
          codingIntervals
        });
        const lineNumStart = LINE_LENGTH * index + 1;
        const lineNumEnd = lineNumStart + LINE_LENGTH - 1;
        const paddedLineNumStart = lineNumStart
          .toString()
          .padStart(gutterWidth, ' ');
        const paddedLineNumEnd = lineNumEnd.toString().padEnd(gutterWidth, ' ');

        return html`
          <div class="line" style="${gutterWidthStyleRule}">
            <div class="container-left">${paddedLineNumStart}</div>

            <div>
              ${parts.map(
                (part) =>
                  html`<span class=${part.coding ? 'coding' : ''}
                    >${part.text}</span
                  >`
              )}
            </div>

            <div class="container-right">${paddedLineNumEnd}</div>
          </div>
        `;
      })}
    `;
  }
}


 */
