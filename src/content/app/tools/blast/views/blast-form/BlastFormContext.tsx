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

import { createContext, ReactNode, useState } from 'react';

import useBlastForm from 'src/content/app/tools/blast/hooks/useBlastForm';

type BlastFormContextType = {
  updateSequenceValidityFlags: (index: number | null, status: boolean) => void;
  removeSequenceValidityFlag: (index: number | null) => void;
  setSequenceValidityFlags: (flags: boolean[]) => void;
  clearSequenceValidityFlags: () => void;
  sequenceValidityFlags: boolean[];
};

export const BlastFormContext = createContext<BlastFormContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export const BlastFormContextContainer = (props: Props) => {
  const [sequenceValidityFlags, setSequenceValidityFlags] = useState<boolean[]>(
    []
  );
  const { sequences } = useBlastForm();

  const updateSequenceValidityFlags = (
    index: number | null,
    status: boolean
  ) => {
    const array = [...sequenceValidityFlags];
    index = index ?? sequences.length;
    array[index] = status;
    setSequenceValidityFlags(array);
  };

  const removeSequenceValidityFlag = (index: number | null) => {
    index = index ?? sequences.length;
    setSequenceValidityFlags(
      sequenceValidityFlags.filter((value, i) => i !== index)
    );
  };

  const clearSequenceValidityFlags = () => {
    setSequenceValidityFlags([]);
  };
  return (
    <BlastFormContext.Provider
      value={{
        updateSequenceValidityFlags,
        removeSequenceValidityFlag,
        clearSequenceValidityFlags,
        setSequenceValidityFlags,
        sequenceValidityFlags
      }}
    >
      {props.children}
    </BlastFormContext.Provider>
  );
};

export default BlastFormContext;
