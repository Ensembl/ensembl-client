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

import { useAppSelector } from 'src/store';

import { getPageMeta } from 'src/shared/state/page-meta/pageMetaSelectors';

import favicon16 from 'static/favicons/favicon-16x16.png';
import favicon32 from 'static/favicons/favicon-32x32.png';

const Meta = () => {
  const pageMeta = useAppSelector(getPageMeta);

  return (
    <>
      <title>{pageMeta.title}</title>
      <meta name="description" content={pageMeta.description} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
      <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
    </>
  );
};

export default Meta;
