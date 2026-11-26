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

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';

export const getLetterInfoFromEvent = (event: PointerEvent | MouseEvent) => {
  // Document listeners see the shadow host as event.target. The composed path
  // retains the sequence element that was actually under the pointer.
  const target = event.composedPath()[0] ?? event.target;
  if (!(target instanceof Element)) {
    return null;
  }
  const sequenceContainer = target.closest<HTMLElement>('.line-middle');
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
          lineBlock,
          sequenceContainer
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

export type LetterHit = NonNullable<ReturnType<typeof getLetterInfoFromEvent>>;

export type SequenceSelection = {
  lineBlock: HTMLElement;
  rect: Omit<DOMRect, 'toJSON'>;
  start: number;
  end: number;
  length: number;
  sequence: string;
};

type SequenceSelectionOptions = {
  root: ShadowRoot;
  releaseEvent?: PointerEvent;
  sequenceType?: TranscriptSequenceView;
};

export const getSequenceSelection = ({
  root,
  releaseEvent,
  sequenceType = 'genomic'
}: SequenceSelectionOptions): SequenceSelection | null => {
  const useMoleculeCoordinates = sequenceType !== 'genomic';
  // Chromium exposes getSelection on ShadowRoot; other browsers use the document.
  const selection =
    (
      root as ShadowRoot & {
        getSelection?: () => Selection | null;
      }
    ).getSelection?.() ?? root.ownerDocument.getSelection();

  if (!selection) {
    return null;
  }

  const range = document.createRange();
  if (selection.getComposedRanges) {
    const ranges = selection.getComposedRanges({ shadowRoots: [root] });
    if (ranges.length !== 1) {
      return null;
    }
    const composed = ranges[0];
    range.setStart(composed.startContainer, composed.startOffset);
    range.setEnd(composed.endContainer, composed.endOffset);
  } else {
    if (selection.rangeCount !== 1) {
      return null;
    }
    const selectedRange = selection.getRangeAt(0);
    range.setStart(selectedRange.startContainer, selectedRange.startOffset);
    range.setEnd(selectedRange.endContainer, selectedRange.endOffset);
  }
  // WebKit can report Selection.isCollapsed as true for a shadow-tree
  // selection. Check the actual composed range instead.
  if (
    range.collapsed ||
    !root.contains(range.startContainer) ||
    !root.contains(range.endContainer)
  ) {
    return null;
  }

  let position: Pick<SequenceSelection, 'lineBlock' | 'rect'> | null = null;
  let start = Infinity;
  let end = -Infinity;
  let length = 0;
  let sequenceOffset = 0;
  const sequenceParts: string[] = [];

  for (const container of root.querySelectorAll<HTMLElement>('.line-middle')) {
    const lineBlock = container.closest<HTMLElement>('.line');
    // Aligned translations are annotations of the primary nucleotide sequence.
    if (!lineBlock || lineBlock.classList.contains('protein-line')) {
      continue;
    }

    if (!range.intersectsNode(container)) {
      if (length) {
        break;
      }
      if (useMoleculeCoordinates) {
        sequenceOffset += container.textContent.replace(/\s/g, '').length;
      }
      continue;
    }

    const lineStart = Number(lineBlock.dataset.start);
    const lineEnd = Number(lineBlock.dataset.end);
    const step = lineEnd < lineStart ? -1 : 1;
    let lineOffset = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const nodeLength = node.data.replace(/\s/g, '').length;
      if (
        range.intersectsNode(node) &&
        (useMoleculeCoordinates ||
          (Number.isFinite(lineStart) && Number.isFinite(lineEnd)))
      ) {
        const from = node === range.startContainer ? range.startOffset : 0;
        const to = node === range.endContainer ? range.endOffset : node.length;
        const selected = node.data.slice(from, to);
        const letters = selected.replace(/\s/g, '');
        const selectedLength = letters.length;
        if (selectedLength) {
          const offset = node.data.slice(0, from).replace(/\s/g, '').length;
          const first = useMoleculeCoordinates
            ? sequenceOffset + offset + 1
            : lineStart + step * (lineOffset + offset);
          const last =
            first + (useMoleculeCoordinates ? 1 : step) * (selectedLength - 1);
          start = Math.min(start, first, last);
          end = Math.max(end, first, last);
          length += selectedLength;
          sequenceParts.push(letters);

          const lastOffset = from + selected.trimEnd().length - 1;
          const endRange = document.createRange();
          endRange.setStart(node, lastOffset);
          endRange.setEnd(node, lastOffset + 1);
          position = { lineBlock, rect: endRange.getBoundingClientRect() };
        }
      }
      lineOffset += nodeLength;
      sequenceOffset += nodeLength;
    }
  }

  if (!position || !length) {
    return null;
  }

  if (releaseEvent) {
    const letter = getLetterInfoFromEvent(releaseEvent);
    if (letter && root.contains(letter.lineBlock)) {
      position = { lineBlock: letter.lineBlock, rect: letter.rect };
    }
  }

  return { ...position, start, end, length, sequence: sequenceParts.join('') };
};
