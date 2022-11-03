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

import React, { useState } from 'react';
import EnsemblGenomeBrowser from '@ensembl/ensembl-genome-browser';

import type { StateZmenu } from '../components/zmenu/ZmenuController';

type GenomeBrowserContextType = {
  genomeBrowser: EnsemblGenomeBrowser | null;
  setGenomeBrowser: (genomeBrowser: EnsemblGenomeBrowser | null) => void;
  zmenus: StateZmenu;
  setZmenus: (zmenus: StateZmenu) => void;
};

export const GenomeBrowserContext = React.createContext<
  GenomeBrowserContextType | undefined
>(undefined);

export const GenomeBrowserProvider = (props: {
  children?: React.ReactNode;
}) => {
  const [genomeBrowser, setGenomeBrowser] =
    useState<EnsemblGenomeBrowser | null>(null);
  const [zmenus, setZmenus] = useState<StateZmenu>({});

  return (
    <GenomeBrowserContext.Provider
      value={{
        genomeBrowser,
        setGenomeBrowser,
        zmenus,
        setZmenus
      }}
    >
      {props.children}
    </GenomeBrowserContext.Provider>
  );
};
