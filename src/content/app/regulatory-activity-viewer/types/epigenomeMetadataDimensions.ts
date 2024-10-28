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

type AgeDimension = {
  name: string;
  values: {
    unit: string;
    max_value: string;
    min_value: string;
  }[];
};

type SexDimension = {
  name: string;
  values: string[];
};

type TermDimension = {
  name: string;
  values: {
    name: string;
    ontology: string;
  }[];
};

type MaterialDimension = {
  name: string;
  values: string[];
};

type LifeStageDimension = {
  name: string;
  values: string[];
};

type OrganDimension = {
  name: string;
  values: {
    name: string;
    terms: string[];
    ontology: string;
  }[];
};

type OrgansSystemDimension = {
  name: string;
  values: {
    name: string;
    terms: string[];
    ontology: string;
  }[];
};

type AssayTypeDimension = {
  name: string;
  values: string[];
};

type AssayTargetDimension = {
  name: string;
  values: string[];
};

type AssayTargetTypeDimension = {
  name: string;
  values: string[];
};

export type MetadataDimensions = {
  age: AgeDimension;
  sex: SexDimension;
  term: TermDimension;
  material: MaterialDimension;
  life_stage: LifeStageDimension;
  organ_slims: OrganDimension;
  system_slims: OrgansSystemDimension;
  assay_type: AssayTypeDimension;
  assay_target: AssayTargetDimension;
  assay_target_type: AssayTargetTypeDimension;
};
