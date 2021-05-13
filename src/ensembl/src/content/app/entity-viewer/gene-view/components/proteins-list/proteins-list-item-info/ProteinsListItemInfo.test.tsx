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
import userEvent from '@testing-library/user-event';
import times from 'lodash/times';

import { ProteinExternalReferenceGroup } from './ProteinsListItemInfo';
import { createExternalReference } from 'tests/fixtures/entity-viewer/product';
import { ExternalSource } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

jest.mock(
  'src/shared/components/instant-download/instant-download-protein/InstantDownloadProtein',
  () => jest.fn()
);

const swissprotXref = createExternalReference({
  accession_id: 'SWISS123',
  source: {
    name: 'UniProtKB/Swiss-Prot',
    id: 'swiss_123'
  }
});

const tremblSource = {
  name: 'UniProtKB/TrEMBL',
  id: 'trembl1'
};
const tremblXrefs = times(4, () =>
  createExternalReference({ source: tremblSource })
);

times(4, (index) => (tremblXrefs[index].accession_id = `trembl_${index}`));

describe('<ProteinsListItemInfo /', () => {
  it('renders a single xref', () => {
    const props = {
      source: ExternalSource.UNIPROT_SWISSPROT,
      xrefs: [swissprotXref]
    };
    // ProteinExternalReferenceGroup expect xrefs from a single source
    const { queryByText } = render(
      <ProteinExternalReferenceGroup {...props} />
    );
    expect(queryByText(swissprotXref.source.name)).toBeTruthy();
    expect(queryByText(swissprotXref.accession_id)).toBeTruthy();
  });

  describe('multiple xrefs', () => {
    it('renders 2 xrefs', () => {
      const props = {
        source: ExternalSource.UNIPROT_TREMBL,
        xrefs: tremblXrefs.slice(0, 2)
      };
      const { queryByText, queryAllByText } = render(
        <ProteinExternalReferenceGroup {...props} />
      );
      expect(queryAllByText(props.source)).toHaveLength(2);
      expect(queryByText(props.xrefs[0].accession_id)).toBeTruthy();
      expect(queryByText(props.xrefs[1].accession_id)).toBeTruthy();
    });

    it('displays 1 xref with an option to expand other ids if there are more than 3 xrefs', () => {
      const props = {
        source: ExternalSource.UNIPROT_TREMBL,
        xrefs: tremblXrefs
      };
      const { container, queryByText, queryAllByText } = render(
        <ProteinExternalReferenceGroup {...props} />
      );
      expect(queryByText(props.source)).toBeTruthy();
      expect(queryAllByText(props.xrefs[0].accession_id)).toHaveLength(1);
      const chevron = container.querySelector('.chevron');
      expect(chevron).toBeTruthy();
    });

    it('displays all xrefs when expanded if there are more than 3 xrefs', () => {
      const props = {
        source: ExternalSource.UNIPROT_TREMBL,
        xrefs: tremblXrefs
      };
      const { container, getByText, getAllByText } = render(
        <ProteinExternalReferenceGroup {...props} />
      );
      const chevron = container.querySelector('.chevron') as HTMLElement;
      userEvent.click(chevron);
      expect(getByText(props.xrefs[1].accession_id)).toBeTruthy();
      expect(getAllByText(props.source)).toHaveLength(4);
      expect(container.querySelectorAll('.externalLinkContainer')).toHaveLength(
        4
      );
    });
  });
});
