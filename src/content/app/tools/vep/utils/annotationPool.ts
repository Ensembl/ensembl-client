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

import type {
  Annotation,
  VepResultsResponse
} from 'src/content/app/tools/vep/types/vepResultsResponse';

/**
 * Rebuild each entity's `annotations` from its variant's pool.
 *
 * VEP repeats a plugin's value on every CSQ row it applies to, so the backend
 * used to send the same payload once per transcript consequence — ClinVar alone
 * was 421 copies of 14 distinct values on a 50-variant page, 72% of the whole
 * response. It now sends one `annotation_pool` per variant plus indices into
 * it, which took the page from 7.87MB to 1.17MB.
 *
 * Resolving here, at the single point the response arrives, is what keeps that
 * off the rest of the app: `getAnnotation` and every component go on reading
 * `annotations` exactly as before. The entries are assigned by reference, not
 * copied, so the shape the UI sees is the same one it always saw while the
 * duplicates remain a single object in memory.
 */
export const resolveAnnotationPool = (
  response: VepResultsResponse
): VepResultsResponse => {
  for (const variant of response.variants ?? []) {
    const pool = variant.annotation_pool;
    if (!pool) {
      // A response from before pooling: `annotations` is already populated.
      continue;
    }
    for (const allele of variant.alternative_alleles ?? []) {
      allele.annotations = resolve(allele.annotation_refs, pool);
      for (const consequence of allele.predicted_molecular_consequences ?? []) {
        // An intergenic consequence is a different shape and carries none.
        if ('annotation_refs' in consequence) {
          consequence.annotations = resolve(consequence.annotation_refs, pool);
        }
      }
    }
  }
  return response;
};

const resolve = (
  refs: number[] | undefined,
  pool: Annotation[]
): Annotation[] => {
  if (!refs?.length) {
    return [];
  }
  const resolved: Annotation[] = [];
  for (const ref of refs) {
    const annotation = pool[ref];
    // A ref outside the pool would mean a malformed response; drop it rather
    // than putting `undefined` where a component expects an annotation.
    if (annotation) {
      resolved.push(annotation);
    }
  }
  return resolved;
};
