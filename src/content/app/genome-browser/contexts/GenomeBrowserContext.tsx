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
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
  type ReactNode
} from 'react';

import type { EnsemblGenomeBrowser } from 'src/content/app/genome-browser/services/genome-browser-service/types/ensemblGenomeBrowser';
import type { Zmenus } from '../components/zmenu/ZmenuController';

type GenomeBrowserService =
  (typeof import('src/content/app/genome-browser/services/genome-browser-service/genomeBrowserService'))['GenomeBrowserService'];

type GenomeBrowserContextType = {
  genomeBrowser: EnsemblGenomeBrowser | null;
  genomeBrowserService: GenomeBrowserService | null;
  setGenomeBrowser: Dispatch<SetStateAction<EnsemblGenomeBrowser | null>>;
  setGenomeBrowserService: Dispatch<
    SetStateAction<GenomeBrowserService | null>
  >;
  zmenus: Zmenus;
  setZmenus: (zmenus: Zmenus) => void;
};

export const GenomeBrowserContext = createContext<
  GenomeBrowserContextType | undefined
>(undefined);

export const GenomeBrowserProvider = (props: { children?: ReactNode }) => {
  const [genomeBrowser, setGenomeBrowser] =
    useState<EnsemblGenomeBrowser | null>(null);
  const [genomeBrowserService, setGenomeBrowserService] =
    useState<GenomeBrowserService | null>(null);
  const [zmenus, setZmenus] = useState<Zmenus>({});

  return (
    <GenomeBrowserContext.Provider
      value={{
        genomeBrowser,
        genomeBrowserService,
        setGenomeBrowser,
        setGenomeBrowserService,
        zmenus,
        setZmenus
      }}
    >
      {props.children}
    </GenomeBrowserContext.Provider>
  );
};
