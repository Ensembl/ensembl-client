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

import type { SpeciesFileLinksResponse } from '../speciesApiTypes';

export const mockFtpLinks = {
  links: [
    {
      dataset_type: 'genebuild',
      path: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/genebuild/GENCODE44'
    },
    {
      dataset_type: 'assembly',
      path: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/genome'
    },
    {
      dataset_type: 'variation',
      path: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/variation/GENCODE44'
    },
    {
      dataset_type: 'homologies',
      path: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/homology/GENCODE44'
    },
    {
      dataset_type: 'regulation',
      path: 'https://ftp.ebi.ac.uk/pub/databases/ensembl/organisms/Homo_sapiens/GCA_000001405.29/ensembl/regulation'
    }
  ]
} satisfies SpeciesFileLinksResponse;
