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

import HelpPopupHistory from './helpPopupHistory';

describe('HelpPopupHistory', () => {
  it('does not return next or previous item if there is only one item in the history', () => {
    // initialise without items
    const history1 = new HelpPopupHistory();
    history1.add({ slug: 'one' });
    expect(history1.hasNext()).toBe(false);
    expect(history1.hasPrevious()).toBe(false);
    expect(history1.getNext()).toBe(null);
    expect(history1.getPrevious()).toBe(null);

    // initialise with an item
    const history2 = new HelpPopupHistory({ slug: 'one' });
    expect(history2.hasNext()).toBe(false);
    expect(history2.hasPrevious()).toBe(false);
    expect(history2.getNext()).toBe(null);
    expect(history2.getPrevious()).toBe(null);
  });

  it('can retrieve previous history item', () => {
    const history = new HelpPopupHistory({ slug: 'one' });
    history.add({ slug: 'two' });
    expect(history.hasPrevious()).toBe(true);
    expect(history.hasNext()).toBe(false);
    expect(history.getPrevious()).toEqual({ slug: 'one' });
  });

  it('can retrieve next history item', () => {
    const history = new HelpPopupHistory({ slug: 'one' });
    history.add({ slug: 'two' });
    // in order to get the next history item, one first needs to move back in history
    history.getPrevious();

    expect(history.hasPrevious()).toBe(false);
    expect(history.hasNext()).toBe(true);
    expect(history.getNext()).toEqual({ slug: 'two' });
  });

  it('removes next history items when a new item is added to history', () => {
    const history = new HelpPopupHistory({ slug: 'one' });
    history.add({ slug: 'two' });
    history.getPrevious(); // now { slug: "two" } should become the next history item
    history.add({ slug: 'three' }); // now { slug: "two" } should be gone

    expect(history.hasNext()).toBe(false); // { slug: "two" } isn't hiding there :-)
    expect(history.getPrevious()).toEqual({ slug: 'one' });
    expect(history.getNext()).toEqual({ slug: 'three' }); // yep, { slug: "two" } is gone
  });
});
