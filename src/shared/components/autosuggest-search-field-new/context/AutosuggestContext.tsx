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

import { createContext, useState, type ReactNode } from 'react';

import useAutosuggestState from './autosuggestState';
import { EventBus } from './eventBus';

type Props = {
  children: ReactNode;
};

type UseAutosuggestStateReturnValue = ReturnType<typeof useAutosuggestState> & {
  eventBus: EventBus;
};

type AutosuggestContextType = UseAutosuggestStateReturnValue;

export const AutosuggestContext = createContext<AutosuggestContextType | null>(
  null
);

const AutosuggestContextProvider = (props: Props) => {
  const stateAndMethods = useAutosuggestState();
  const [eventBus] = useState(new EventBus());

  const contextValue = {
    ...stateAndMethods,
    eventBus
  };

  return (
    <AutosuggestContext.Provider value={contextValue}>
      {props.children}
    </AutosuggestContext.Provider>
  );
};

export default AutosuggestContextProvider;
