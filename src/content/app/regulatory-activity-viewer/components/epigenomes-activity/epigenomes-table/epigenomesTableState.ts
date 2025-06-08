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

import { BehaviorSubject } from 'rxjs';

/**
 * A simple store to track the open/closed state of the epigenomes table,
 * and to couple the table with the button that toggles its visibility.
 *
 * The button is separated from the table into a different component;
 * and the purpose of using this component rather than parent component's state
 * was to avoid re-rendering of the epigenomes activity diagram when the table
 * is shown or hidden.
 *
 * This could have easily been implemented via React context;
 * but that would have required wrapping the relevant part of the tree
 * into a context provider component.
 *
 * Note that because the store created in this file is a singleton,
 * the implementation assumes that there will ever only be one epigenomes table
 * on any given page. So far, this looks like a reasonable assumption.
 */

export type TableState = {
  isOpen: boolean;
  isAvailable: boolean;
};

export const initialState: TableState = {
  isOpen: false,
  isAvailable: false
};

const tableVisibilitySubject = new BehaviorSubject<TableState>(initialState);

export const updateTableState = (fragment: Partial<TableState>) => {
  const currentState = tableVisibilitySubject.value;
  const newState = { ...currentState, ...fragment };
  tableVisibilitySubject.next(newState);
};

export const changeTableVisibility = ({ isOpen }: { isOpen: boolean }) => {
  const currentState = tableVisibilitySubject.value;
  const newState = { ...currentState, isOpen };
  tableVisibilitySubject.next(newState);
};

export const changeTableAvailability = ({
  isAvailable
}: {
  isAvailable: boolean;
}) => {
  const currentState = tableVisibilitySubject.value;
  const newState = { ...currentState, isAvailable };
  tableVisibilitySubject.next(newState);
};

export const tableVisibility$ = tableVisibilitySubject.asObservable();
