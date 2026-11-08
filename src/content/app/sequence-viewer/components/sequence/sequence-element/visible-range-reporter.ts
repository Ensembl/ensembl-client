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

/** Start of the first visible line and end of the last, in display order. */
export type VisibleRange = { start: number; end: number } | null;

export class VisibleRangeReporter {
  #chunkObserver: IntersectionObserver;
  #lineObserver: IntersectionObserver;
  #activeChunks = new Map<Element, HTMLElement[]>();
  #observedLines = new Map<Element, { start: number; end: number }>();
  #visibleLines = new Set<Element>();
  #lastReportedRange: VisibleRange | undefined;
  #pendingFrame: number | null = null;
  #destroyed = false;

  constructor(
    private host: HTMLElement,
    chunks: HTMLElement[]
  ) {
    this.#lineObserver = new IntersectionObserver(
      (entries) => {
        if (this.#destroyed) {
          return;
        }
        for (const entry of entries) {
          if (!this.#observedLines.has(entry.target)) {
            continue;
          }
          if (
            entry.isIntersecting &&
            entry.intersectionRect.height > 0 &&
            entry.intersectionRect.width > 0
          ) {
            this.#visibleLines.add(entry.target);
          } else {
            this.#visibleLines.delete(entry.target);
          }
        }
        this.#scheduleReport();
      },
      {
        // The viewport root also respects clipping by scrolling ancestors.
        root: null,
        // Include a positive threshold: edge contact can have zero area while
        // isIntersecting is true. We need another notification on entry.
        threshold: [0, 0.000001]
      }
    );

    this.#chunkObserver = new IntersectionObserver(
      (entries) => {
        if (this.#destroyed) {
          return;
        }
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.#observeChunkLines(entry.target);
          } else {
            this.#unobserveChunkLines(entry.target);
          }
        }
        this.#scheduleReport();
      },
      { root: null, threshold: 0 }
    );

    for (const chunk of chunks) {
      this.#chunkObserver.observe(chunk);
    }
    this.#scheduleReport();
  }

  #observeChunkLines(chunk: Element) {
    if (this.#activeChunks.has(chunk)) {
      return;
    }
    const lines = Array.from(
      chunk.querySelectorAll<HTMLElement>('.line[data-start][data-end]')
    );
    this.#activeChunks.set(chunk, lines);
    for (const line of lines) {
      const start = Number(line.dataset.start);
      const end = Number(line.dataset.end);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        continue;
      }
      this.#observedLines.set(line, { start, end });
      this.#lineObserver.observe(line);
    }
  }

  #unobserveChunkLines(chunk: Element) {
    for (const line of this.#activeChunks.get(chunk) ?? []) {
      this.#lineObserver.unobserve(line);
      this.#observedLines.delete(line);
      this.#visibleLines.delete(line);
    }
    this.#activeChunks.delete(chunk);
  }

  #scheduleReport() {
    if (this.#pendingFrame !== null) {
      return;
    }
    this.#pendingFrame = requestAnimationFrame(() => {
      this.#pendingFrame = null;
      this.#report();
    });
  }

  #report() {
    let firstLine: Element | null = null;
    let lastLine: Element | null = null;
    for (const line of this.#visibleLines) {
      // Observer notifications (and Set insertion order) need not follow DOM order.
      if (
        !firstLine ||
        firstLine.compareDocumentPosition(line) &
          Node.DOCUMENT_POSITION_PRECEDING
      ) {
        firstLine = line;
      }
      if (
        !lastLine ||
        lastLine.compareDocumentPosition(line) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ) {
        lastLine = line;
      }
    }
    const next: VisibleRange =
      firstLine && lastLine
        ? {
            start: this.#observedLines.get(firstLine)!.start,
            end: this.#observedLines.get(lastLine)!.end
          }
        : null;
    const previous = this.#lastReportedRange;
    if (
      previous !== undefined &&
      previous?.start === next?.start &&
      previous?.end === next?.end
    ) {
      return;
    }
    this.#lastReportedRange = next;
    this.host.dispatchEvent(
      new CustomEvent<VisibleRange>('visible-range-change', {
        detail: next,
        bubbles: true
      })
    );
  }

  destroy() {
    this.#destroyed = true;
    this.#chunkObserver.disconnect();
    this.#lineObserver.disconnect();
    if (this.#pendingFrame !== null) {
      cancelAnimationFrame(this.#pendingFrame);
      this.#pendingFrame = null;
    }
    this.#activeChunks.clear();
    this.#observedLines.clear();
    this.#visibleLines.clear();
  }
}
