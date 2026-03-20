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

import { Subject } from 'rxjs';

/**
 * The event is sent:
 * - By the root if user uses keyboard navigation to move through suggestions
 * - By a suggestion element if user hovers over it (???)
 */
type CurrentSuggestionEvent = {
  type: 'current_suggestion';
  element: HTMLElement;
};

/**
 * The event is sent:
 * - By the root if user presses enter while one of the suggestions is highlighted
 */
type SuggestionConfirmedEvent = {
  type: 'suggestion_confirmed';
  element: HTMLElement;
};

/**
 * The event is sent:
 * - By a suggestion element that owns the suggestion data
 */
type SuggestionDataEvent = {
  type: 'suggestion_data';
  element: HTMLElement;
  data: unknown;
};

type AutosuggestSearchFieldEvent =
  | CurrentSuggestionEvent
  | SuggestionConfirmedEvent
  | SuggestionDataEvent;

export class EventBus {
  #subject: Subject<AutosuggestSearchFieldEvent>;

  constructor() {
    this.#subject = new Subject();
  }

  subscribe(callback: (event: AutosuggestSearchFieldEvent) => void) {
    return this.#subject.subscribe(callback);
  }

  currentSuggestion(element: HTMLElement) {
    this.#subject.next({
      type: 'current_suggestion',
      element
    });
  }

  confirmSuggestion(element: HTMLElement) {
    this.#subject.next({
      type: 'suggestion_confirmed',
      element
    });
  }

  suggestionData(params: { element: HTMLElement; data: unknown }) {
    this.#subject.next({
      type: 'suggestion_data',
      ...params
    });
  }
}
