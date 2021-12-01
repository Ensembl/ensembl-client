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

import { Product, ProductType } from './product';
import { PhasedExon } from './exon';
import { FullCDS } from './cds';
import { UTR } from './utr';
import { CDNA } from './cdna';

// TODO: have at least two types of product-generating contexts:
// one for when product is a protein, and another for when product is an RNA
export type FullProductGeneratingContext = {
  product_type: ProductType;
  default: boolean;
  cds: FullCDS | null;
  five_prime_utr: UTR | null;
  three_prime_utr: UTR | null;
  product: Product | null;
  phased_exons: PhasedExon[];
  cdna: CDNA;
};
