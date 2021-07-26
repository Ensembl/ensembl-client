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
type ValueSetMetadata = {
  value: string | number | boolean;
  label: string;
  definition: string;
};

type ManeMetadata = ValueSetMetadata;
type CanonicalMetadata = ValueSetMetadata;
type GencodeBasicMetadata = ValueSetMetadata;
type ApprisMetadata = ValueSetMetadata;
type TSLMetadata = ValueSetMetadata;

export type TranscriptMetadata = {
  mane: ManeMetadata | null;
  canonical: CanonicalMetadata | null;
  gencode_basic: GencodeBasicMetadata | null;
  appris: ApprisMetadata | null;
  tsl: TSLMetadata | null;
};
