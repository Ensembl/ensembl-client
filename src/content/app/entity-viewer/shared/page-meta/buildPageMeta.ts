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

export const defaultEntityViewerPageTitle = 'Entity viewer — Ensembl';

/**
 * NOTE: for the time being, this function for building page metadata
 * is very simplistic; its only purpose is to set fallback values if none are provided.
 * Later on, I expect we will want to add something like JSON schemas to the pages.
 */
export const buildPageMeta = (
  params: {
    title?: string;
    description?: string;
  } = {}
) => {
  // TODO: eventually, decide on what we want to put in the page description
  const { title = defaultEntityViewerPageTitle, description = '' } = params;

  return {
    title,
    description
  };
};
