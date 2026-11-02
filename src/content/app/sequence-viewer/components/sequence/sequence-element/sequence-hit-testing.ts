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

export const getLetterInfoFromEvent = (event: PointerEvent | MouseEvent) => {
  const target = event.target;
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
  sequence: string;
  start: number;
  end: number;
  lineBlock: HTMLElement;
  rect: DOMRect;
  strand: 1 | -1;
};

export type SelectionActions = {
  header: string;
  browserUrl: string;
};

export const getSequenceSelection = (
  root: ShadowRoot
): SequenceSelection | null => {
  // Chromium exposes getSelection on ShadowRoot; other browsers use the document.
  const selection =
    (
      root as ShadowRoot & {
        getSelection?: () => Selection | null;
      }
    ).getSelection?.() ?? root.ownerDocument.getSelection();

  if (!selection || selection.isCollapsed || selection.rangeCount !== 1) {
    return null;
  }

  const composed = selection.getComposedRanges?.({ shadowRoots: [root] })[0];
  const range = document.createRange();
  if (composed) {
    range.setStart(composed.startContainer, composed.startOffset);
    range.setEnd(composed.endContainer, composed.endOffset);
  } else {
    const selectedRange = selection.getRangeAt(0);
    range.setStart(selectedRange.startContainer, selectedRange.startOffset);
    range.setEnd(selectedRange.endContainer, selectedRange.endOffset);
  }
  if (
    !root.contains(range.startContainer) ||
    !root.contains(range.endContainer)
  ) {
    return null;
  }

  const parts: string[] = [];
  let first: { coordinate: number; line: HTMLElement } | null = null;
  let lastCoordinate = 0;
  let lastLine: HTMLElement | null = null;
  let lastRect: DOMRect | null = null;

  for (const container of root.querySelectorAll<HTMLElement>('.line-middle')) {
    if (!range.intersectsNode(container)) {
      continue;
    }
    const line = container.closest<HTMLElement>('.line');
    if (!line?.hasAttribute('data-start') || !line.hasAttribute('data-end')) {
      continue;
    }
    const start = Number(line.dataset.start);
    const step = Number(line.dataset.end) < start ? -1 : 1;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let index = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (range.intersectsNode(node)) {
        const from = node === range.startContainer ? range.startOffset : 0;
        const to = node === range.endContainer ? range.endOffset : node.length;
        if (to > from) {
          parts.push(node.data.slice(from, to));
          first ??= { coordinate: start + (index + from) * step, line };
          lastLine = line;
          lastCoordinate = start + (index + to - 1) * step;
          const endRange = document.createRange();
          endRange.setStart(node, to - 1);
          endRange.setEnd(node, to);
          lastRect = endRange.getBoundingClientRect();
        }
      }
      index += node.length;
    }
  }

  if (!first || !lastLine || !lastRect || !parts.length) {
    return null;
  }

  return {
    sequence: parts.join('').replace(/\s/g, ''),
    start: first.coordinate,
    end: lastCoordinate,
    lineBlock: lastLine,
    rect: lastRect,
    strand:
      Number(first.line.dataset.end) < Number(first.line.dataset.start) ? -1 : 1
  };
};
