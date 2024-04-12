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

import React from 'react';
import { render } from '@testing-library/react';
import upperFirst from 'lodash/upperFirst';

import { humanGenome } from './fixtures/speciesTestData';

import SpeciesLozenge from './SpeciesLozenge';

describe('<SpeciesLozenge />', () => {
  describe('common-name_assembly-name', () => {
    it('Displays common name and assembly name if common name is available', () => {
      const { container } = render(
        <SpeciesLozenge
          species={humanGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const expectedText = `${humanGenome.common_name}${humanGenome.assembly.name}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Displays scientific name and assembly name if common name is not available', () => {
      const testGenome = {
        ...humanGenome,
        common_name: null
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const expectedText = `${humanGenome.scientific_name}${humanGenome.assembly.name}`;
      expect(renderedText).toBe(expectedText);
    });
  });

  describe('common-name_type_assembly-name', () => {
    it('Shows common name, type, reference and assembly name if all present', () => {
      const { container } = render(
        <SpeciesLozenge
          species={humanGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const commonName = humanGenome.common_name;
      const typeKind = upperFirst(humanGenome.type.kind);
      const typeValue = humanGenome.type.value;
      const ref = 'Reference';
      const assName = humanGenome.assembly.name;
      const expectedText = `${commonName}${typeKind} - ${typeValue}, ${ref}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name, type, reference and assembly name if common name is absent', () => {
      const testGenome = {
        ...humanGenome,
        common_name: null
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const typeKind = upperFirst(testGenome.type.kind);
      const typeValue = testGenome.type.value;
      const ref = 'Reference';
      const assName = testGenome.assembly.name;
      const expectedText = `${scientificName}${typeKind} - ${typeValue}, ${ref}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows common name and reference if no type and is reference', () => {
      const testGenome = {
        ...humanGenome,
        type: null
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const commonName = testGenome.common_name;
      const ref = 'Reference';
      const assName = testGenome.assembly.name;
      const expectedText = `${commonName}${ref}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name and reference if no common name or type and is reference', () => {
      const testGenome = {
        ...humanGenome,
        common_name: null,
        type: null
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const ref = 'Reference';
      const assName = testGenome.assembly.name;
      const expectedText = `${scientificName}${ref}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows common name and type but no reference if not reference', () => {
      const testGenome = {
        ...humanGenome,
        is_reference: false
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const commonName = testGenome.common_name;
      const typeKind = upperFirst(testGenome.type.kind);
      const typeValue = testGenome.type.value;
      const assName = testGenome.assembly.name;
      const expectedText = `${commonName}${typeKind} - ${typeValue}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows common name and assembly name if no type and not reference', () => {
      const testGenome = {
        ...humanGenome,
        type: null,
        is_reference: false
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const commonName = testGenome.common_name;
      const assName = testGenome.assembly.name;
      const expectedText = `${commonName}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name, type and assembly name if no common name and not reference', () => {
      const testGenome = {
        ...humanGenome,
        common_name: null,
        is_reference: false
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const typeKind = upperFirst(testGenome.type.kind);
      const typeValue = testGenome.type.value;
      const assName = testGenome.assembly.name;
      const expectedText = `${scientificName}${typeKind} - ${typeValue}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name and assembly name if no common name, no type and not reference', () => {
      const testGenome = {
        ...humanGenome,
        common_name: null,
        type: null,
        is_reference: false
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="common-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const assName = testGenome.assembly.name;
      const expectedText = `${scientificName}${assName}`;
      expect(renderedText).toBe(expectedText);
    });
  });

  describe('scientific-name_assembly-name', () => {
    it('Shows scientific name and assembly name', () => {
      const testGenome = humanGenome;

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="scientific-name_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const assName = testGenome.assembly.name;
      const expectedText = `${scientificName}${assName}`;
      expect(renderedText).toBe(expectedText);
    });
  });

  describe('scientific-name_type_assembly-name', () => {
    it('Shows scientific name, type, reference and assembly name when all present', () => {
      const testGenome = humanGenome;
      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="scientific-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const assName = testGenome.assembly.name;
      const typeKind = upperFirst(testGenome.type.kind);
      const typeValue = testGenome.type.value;
      const ref = 'Reference';
      const expectedText = `${scientificName}${typeKind} - ${typeValue}, ${ref}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name, type and assembly name when no reference', () => {
      const testGenome = {
        ...humanGenome,
        is_reference: false
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="scientific-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const assName = testGenome.assembly.name;
      const typeKind = upperFirst(testGenome.type.kind);
      const typeValue = testGenome.type.value;
      const expectedText = `${scientificName}${typeKind} - ${typeValue}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name and assembly name when no type and no reference', () => {
      const testGenome = {
        ...humanGenome,
        type: null,
        is_reference: false
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="scientific-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const assName = testGenome.assembly.name;
      const expectedText = `${scientificName}${assName}`;
      expect(renderedText).toBe(expectedText);
    });

    it('Shows scientific name, reference and assembly name when no type is present', () => {
      const testGenome = {
        ...humanGenome,
        type: null
      };

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="scientific-name_type_assembly-name"
        />
      );

      const renderedText = container.textContent;
      const scientificName = testGenome.scientific_name;
      const assName = testGenome.assembly.name;
      const ref = 'Reference';
      const expectedText = `${scientificName}${ref}${assName}`;
      expect(renderedText).toBe(expectedText);
    });
  });

  describe('assembly-accession-id', () => {
    it('Shows only assembly accession id', () => {
      const testGenome = humanGenome;

      const { container } = render(
        <SpeciesLozenge
          species={testGenome}
          theme="blue"
          speciesNameDisplayOption="assembly-accession-id"
        />
      );

      const renderedText = container.textContent;
      const assemblyAccessionId = testGenome.assembly.accession_id;
      const expectedText = `${assemblyAccessionId}`;
      expect(renderedText).toBe(expectedText);
    });
  });
});
