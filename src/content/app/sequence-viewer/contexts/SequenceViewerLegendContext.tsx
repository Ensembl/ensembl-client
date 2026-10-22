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

import { useState, createContext, type ReactNode } from 'react';
import noop from 'lodash/noop';

/**
 * The purpose of this component is to connect the sequence component,
 * which receives the legend html template, along with the styles, from the backend,
 * and the sidebar component that has to render the legend.
 */

type SequenceViewerLegendContextType = {
  template: string | null;
  setTemplate: (template: string) => void;
};

const defaultContext: SequenceViewerLegendContextType = {
  template: null,
  setTemplate: noop
};

export const SequenceViewerLegendContext =
  createContext<SequenceViewerLegendContextType>(defaultContext);

export const SequenceViewerLegendContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [template, setTemplate] = useState<string | null>(null);

  const contextValue: SequenceViewerLegendContextType = {
    template,
    setTemplate
  };

  return (
    <SequenceViewerLegendContext value={contextValue}>
      {children}
    </SequenceViewerLegendContext>
  );
};
