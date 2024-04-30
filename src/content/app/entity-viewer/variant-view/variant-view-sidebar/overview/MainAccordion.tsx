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

import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';
import VariantVCF from 'src/shared/components/variant-vcf/VariantVCF';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';

import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getReferenceAndAltAlleles } from 'src/shared/helpers/variantHelpers';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';

import type { VariantDetails } from 'src/content/app/entity-viewer/state/api/queries/variantDefaultQuery';
import prepareVariantSummaryData, {
  type PreparedVariantSummaryData
} from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/prepareVariantSummaryData';
import { CADDScores } from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/VariantSummary';
import { Strand } from 'src/shared/types/core-api/strand';

import styles from './VariantOverview.module.css';

type Props = {
  genomeId: string;
  variantId: string;
  variant: VariantDetails;
  activeAlleleId: string | null;
};

const MainAccordion = (props: Props) => {
  const { genomeId, variantId, variant, activeAlleleId } = props;

  const preparedSummaryData = prepareVariantSummaryData(variant);

  const gbVariantUrl = urlFor.browser({
    genomeId: genomeId,
    focus: buildFocusIdForUrl({
      type: 'variant',
      objectId: variantId
    })
  });

  const disabledAccordionButtonClass = classNames(
    styles.entityViewerAccordionButton,
    {
      [styles.entityViewerAccordionButtonDisabled]: true
    }
  );

  const { caddScores, gerpScore } = preparedSummaryData;

  return (
    <div className={styles.accordionContainer}>
      <Accordion
        className={styles.entityViewerAccordion}
        allowMultipleExpanded={true}
        preExpanded={['alleles', 'in_this_region']}
      >
        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'alleles'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              Alleles
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <Alleles
              alleles={variant.alleles}
              activeAlleleId={activeAlleleId}
            />
          </AccordionItemPanel>
        </AccordionItem>

        <section>
          <ChangeTolerance caddScores={caddScores} gerpScore={gerpScore} />
        </section>

        <section>
          <div className={styles.sectionHead}>Location</div>
          <div className={styles.sectionContent}>
            <div>
              <VariantLocation variant={variant} />
              <span className={styles.featureDetails}>
                {getStrandDisplayName(Strand.FORWARD)}
              </span>
            </div>

            <div className={styles.labelValueWrapper}>
              <div className={styles.label}>VCF</div>
              <VariantVCF variant={variant} withCopy={true} />
            </div>
          </div>
        </section>

        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'in_this_region'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton className={styles.entityViewerAccordionButton}>
              In this region
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <section>
              <div>
                See other variants, structural variants, genes and regulatory
                features in their genomic context
              </div>
              <div className={styles.newRowGroup}>
                <ViewInApp links={{ genomeBrowser: { url: gbVariantUrl } }} />
              </div>
            </section>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'synonyms'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={disabledAccordionButtonClass}
              disabled={true}
            >
              Synonyms
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>No data available</div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

type ChangeToleranceProps = Pick<
  PreparedVariantSummaryData,
  'caddScores' | 'gerpScore'
>;

const ChangeTolerance = (props: ChangeToleranceProps) => {
  if (!props.caddScores.length && !props.gerpScore) {
    return null;
  } else {
    return (
      <>
        <div className={styles.sectionHead}>Change tolerance</div>
        <div className={styles.sectionContent}>
          {!!props.caddScores.length && (
            <div className={classNames(styles.row, styles.newRowGroup)}>
              <div className={styles.label}>CADD</div>
              <div className={styles.value}>
                <CADDScores data={props.caddScores} />
              </div>
            </div>
          )}

          {props.gerpScore && (
            <div className={classNames(styles.row, styles.labelValueWrapper)}>
              <div className={styles.label}>GERP</div>
              <div className={styles.value}>{props.gerpScore}</div>
            </div>
          )}
        </div>
      </>
    );
  }
};

type AllelesProps = {
  activeAlleleId: string | null;
  alleles: VariantDetails['alleles'];
};

const Alleles = (props: AllelesProps) => {
  const { alleles, activeAlleleId } = props;
  const { referenceAllele, alternativeAlleles } =
    getReferenceAndAltAlleles(alleles);

  return (
    <div>
      {referenceAllele && (
        <div className={styles.row}>
          <div className={styles.label}>Ref</div>
          <div>
            <Allele allele={referenceAllele} activeAlleleId={activeAlleleId} />
          </div>
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.label}>Alt</div>
        <div className={styles.altAlleles}>
          {alternativeAlleles.map((allele) => (
            <Allele
              key={allele.urlId}
              allele={allele}
              activeAlleleId={activeAlleleId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Allele = (props: {
  allele: VariantDetails['alleles'][number];
  activeAlleleId: string | null;
}) => {
  const { allele, activeAlleleId } = props;
  const formattedSequence = formatAlleleSequence(allele.allele_sequence);
  const urlLocation = useLocation();

  const urlPath = urlLocation.pathname;
  const urlSearchParams = new URLSearchParams(urlLocation.search);

  if (allele.urlId === activeAlleleId) {
    return <span>{formattedSequence}</span>;
  } else {
    urlSearchParams.set('allele', allele.urlId);
    const url = `${urlPath}?${urlSearchParams.toString()}`;

    return <Link to={url}>{formattedSequence}</Link>;
  }
};

export const formatAlleleSequence = (sequence: string) => {
  const maxCharacters = 18;

  return sequence.length > maxCharacters
    ? `${sequence.slice(0, maxCharacters - 1)}…`
    : sequence;
};

export default MainAccordion;
