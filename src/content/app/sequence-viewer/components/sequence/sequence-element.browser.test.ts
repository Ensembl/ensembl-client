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

import {
  Sequence as SequenceElement,
  type LegendEventDetail
} from './sequence-element';

// register the element as a side effect of import
import './sequence-element';

const styles =
  '<template id="styles"><style>.feature { color: rgb(12, 34, 56); }</style></template>';
const legend =
  '<template id="legend"><span class="feature">Exon</span></template>';
const response = (content: string, withLegend = true) =>
  styles +
  '<template id="sequence">' +
  content +
  '</template>' +
  (withLegend ? legend : '');

describe('ens-sequence-viewer-sequence element', () => {
  let element: SequenceElement;

  beforeEach(() => {
    element = document.createElement(
      'ens-sequence-viewer-sequence'
    ) as SequenceElement;
    document.body.append(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('handles the template property correctly', async () => {
    // Set event listener before setting the "sequence" property
    // (because the legend event will be sent synchronously after the template is parsed)
    const events: LegendEventDetail[] = [];
    element.addEventListener('report-legend', (event) => {
      events.push((event as CustomEvent<LegendEventDetail>).detail);
    });

    // Set the sequence property on the element
    element.sequence = response(
      Array.from(
        { length: 101 },
        () => '<div class="line"><span class="feature">ACGT</span></div>'
      ).join(' ')
    );

    // Check that the lines from the template get wrapped in content-visibility blocks
    // 100 lines per block
    expect(element.shadowRoot!.querySelectorAll('.line')).toHaveLength(101);
    expect(
      element.shadowRoot!.querySelectorAll('.content-visibility-block')
    ).toHaveLength(2);

    // Check that the styles passed in the template get applied to the element
    expect(
      getComputedStyle(element.shadowRoot!.querySelector('.feature')!).color
    ).toBe('rgb(12, 34, 56)');

    // Check that a legend event is dispatched
    expect(events).toEqual([{ template: legend + styles }]);
  });
});
