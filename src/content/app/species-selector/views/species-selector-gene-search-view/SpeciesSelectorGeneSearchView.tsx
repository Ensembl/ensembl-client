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

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppDispatch } from 'src/store';

import { setQuery as storeGeneQuery } from 'src/content/app/species-selector/state/species-selector-gene-search-slice/speciesSelectorGeneSearchSlice';

import GeneSearchPanel from 'src/shared/components/gene-search-panel/GeneSearchPanel';

const SpeciesSelectorGeneSearchView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const queryFromParams = searchParams.get('query') ?? '';

  const onClose = () => {
    navigate(-1);
  };

  const onSearchSubmit = (query: string) => {
    updateSearchParams(query);
    dispatch(storeGeneQuery(query));
  };

  const updateSearchParams = (query: string) => {
    searchParams.set('query', query);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <GeneSearchPanel
      query={queryFromParams}
      onSearchSubmit={onSearchSubmit}
      onClose={onClose}
    />
  );
};

export default SpeciesSelectorGeneSearchView;
