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

import { useEffect } from 'react';

import { useAppSelector } from 'src/store';

import { getPageMeta } from 'src/shared/state/page-meta/pageMetaSelectors';

import type { PageMetaState } from 'src/shared/state/page-meta/pageMetaSlice';

const Meta = () => {
  const pageMeta = useAppSelector(getPageMeta);

  useEffect(() => {
    updatePageMeta(pageMeta);
  }, [pageMeta]);

  return null;
};

const updatePageMeta = (pageMeta: PageMetaState) => {
  updateTitle(pageMeta);
  updateDescription(pageMeta);
};

const updateTitle = (pageMeta: PageMetaState) => {
  const { title } = pageMeta;

  const titleTag = document.querySelector('title');

  if (!titleTag) {
    return;
  }

  const currentTitle = titleTag.innerText;
  if (title !== currentTitle) {
    titleTag.innerText = title;
  }
};

const updateDescription = (pageMeta: PageMetaState) => {
  const { description } = pageMeta;

  const descriptionMetaTag = document.querySelector('meta[name="description"]');

  if (!descriptionMetaTag) {
    return;
  }

  const currentDescription = descriptionMetaTag.getAttribute('content');

  if (currentDescription !== description) {
    descriptionMetaTag.setAttribute('content', description);
  }
};

export default Meta;
