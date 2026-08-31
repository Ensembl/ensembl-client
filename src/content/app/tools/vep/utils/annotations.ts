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

import type { Annotation } from 'src/content/app/tools/vep/types/vepResultsResponse';

// Anything carrying the generic annotation list: a variant allele,
// or a predicted transcript consequence.
export type AnnotatedEntity = {
  annotations?: Annotation[];
};

/**
 * Read the data of the given plugin's annotation
 * from the "annotated entity" (i.e. a variant allele, or a predicted transcript consequence object)
 *
 * The plugin id is a plain string, as it is on the wire and in the display spec.
 * A caller that knows the shape it wants asks for it: getAnnotation<Foo>(...)
 */
export const getAnnotation = <Data = unknown>(
  entity: AnnotatedEntity | null | undefined,
  plugin: string
): Data | null => {
  const entry = entity?.annotations?.find(
    (annotation) => annotation.plugin === plugin
  );
  return entry ? (entry.data as Data) : null;
};
