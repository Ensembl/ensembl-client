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

import { useSearchParams } from 'react-router-dom';

/**
 * - Page number may be included in the url query parameters.
 *   If the page parameter is absent from the url, default to 1
 * - Items count per page may be included in the url query parameters.
 *   If this parameter is absent, use the default value.
 * - Make sure to check that the query parameters in the url aren't bogus.
 */

const DEFAULT_PAGE = 1;
export const PER_PAGE_OPTIONS = [10, 50, 100];
const DEFAULT_PER_PAGE = PER_PAGE_OPTIONS.at(-1) as number;

const useVepResultsPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setPage = (page: number) => {
    searchParams.set('page', `${page}`);
    setSearchParams(searchParams);
  };

  const setPerPage = (perPage: number) => {
    searchParams.set('per_page', `${perPage}`);
    setSearchParams(searchParams);
  };

  return {
    ...validateSearchParams(searchParams),
    setPage,
    setPerPage
  };
};

const validateSearchParams = (searchParams: URLSearchParams) => {
  const pageParam = searchParams.get('page');
  const perPageParam = searchParams.get('per_page');

  const parsedPage = parseInt(pageParam || '');
  const parsedPerPage = parseInt(perPageParam || '');

  const page = isNaN(parsedPage) ? DEFAULT_PAGE : parsedPage;
  const perPage =
    !isNaN(parsedPerPage) && PER_PAGE_OPTIONS.includes(parsedPerPage)
      ? parsedPerPage
      : DEFAULT_PER_PAGE;

  return { page, perPage };
};

export default useVepResultsPagination;