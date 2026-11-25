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

import favicon from 'static/favicons/favicon.svg?url';
import iconPng from 'static/favicons/android-chrome-512x512.png';

const Meta = () => {
  const pageMeta = useAppSelector(getPageMeta);

  return (
    <>
      <title>{pageMeta.title}</title>
      <meta name="description" content={pageMeta.description} />
      <meta property="og:title" content={pageMeta.title} />
      <meta property="og:description" content={pageMeta.description} />
      <meta property="og:site_name" content="Ensembl" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={iconPng} />
      <meta property="og:image:alt" content="Ensembl logo" />
      <link rel="icon" type="image/svg+xml" href={favicon} />
    </>
  );
};

export default Meta;
