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

import type { Variant } from 'src/shared/types/variation-api/variant';

/**
 * NOTE: this file will need rework when we start querying real variation data:
 * - we will have to add the actual graphql queries
 * - we might want to split it into several queries (a smaller VariantSummary query and a larger VariantDetails query)
 *
 * Meanwhile, I am using this file to define the type of the expected response.
 */

export type VariantQueryResult = {
  variant: Variant;
};
