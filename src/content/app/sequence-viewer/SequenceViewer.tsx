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

import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/query';

import { useAppSelector } from 'src/store';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import AppBar, { AppName } from 'src/shared/components/app-bar/AppBar';
import { CircleLoader } from 'src/shared/components/loader';
import { StandardAppLayout } from 'src/shared/components/layout';
import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import Input from 'src/shared/components/input/Input';
import { Toolbox, ToolboxPosition } from 'src/shared/components/toolbox';
import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import SpeciesManagerIndicator from 'src/shared/components/species-manager-indicator/SpeciesManagerIndicator';
import { SelectedSpecies } from 'src/shared/components/selected-species';
import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import {
  useRefgetSequenceQuery,
  type SequenceQueryParams
} from 'src/shared/state/api-slices/refgetSlice';
import {
  useGenomeSummaryByGenomeSlugQuery,
  isGenomeNotFoundError
} from 'src/shared/state/genome/genomeApiSlice';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';
import useGenomeRemoval from 'src/content/app/species-selector/hooks/useGenomeRemoval';
import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getReverseComplement } from 'src/shared/helpers/sequenceHelpers';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';

import type { Strand } from 'src/shared/types/core-api/strand';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import {
  useSequenceViewerGeneQuery,
  useSequenceViewerRegionQuery,
  useSequenceViewerOverlapRegionQuery
} from './state/api/sequenceViewerApiSlice';

import styles from './SequenceViewer.module.css';

type EntityType = 'gene' | 'transcript';

type Feature = {
  slice: {
    location: { start: number; end: number };
    region: { name: string; length: number; sequence: { checksum: string } };
    strand: { code: Strand };
  };
};

type SequenceRange = {
  start: number;
  end: number;
  type: 'exon' | 'intron' | 'cds' | 'utr' | 'flank';
};

type TranscriptBoundary = {
  featureType?: EntityType;
  label?: string | null;
  stable_id: string;
  unversioned_stable_id: string;
  metadata: {
    biotype: { label: string } | null;
  };
  slice: {
    location: { start: number; end: number; length: number };
    region: { name: string };
    strand: { code: Strand };
  };
};

type OverlapBoundaryFeature = {
  stable_id: string;
  symbol: string | null;
  name?: string | null;
  so_term: string | null;
  slice: TranscriptBoundary['slice'];
};

type TranscriptSequenceMarker = {
  featureType: EntityType;
  label: string | null;
  position: number;
  stableId: string;
  unversionedStableId: string;
  biotype: string | null;
  boundary: 'first' | 'last';
  transcript: TranscriptBoundary;
};

type SelectedSequence = {
  anchor: HTMLElement;
  region: string;
  sequence: string;
};

const SEQUENCE_LINE_LENGTH = 60;

type TranscriptWithExons = Feature & {
  spliced_exons: Array<{
    relative_location: { start: number; end: number };
    exon: {
      slice: {
        location: { start: number; end: number };
      };
    };
  }>;
  introns: Array<{
    slice: {
      location: { start: number; end: number };
    };
  }>;
  product_generating_contexts: Array<{
    cds: {
      relative_start: number;
      relative_end: number;
      sequence: { checksum: string };
    } | null;
  }>;
};

const SequenceViewer = () => {
  const { genomeId = '', entityId = '' } = useParams();
  const { search } = useLocation();
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const viewportWidth = useAppSelector(getBreakpointWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [areExonsHighlighted, setAreExonsHighlighted] = useState(false);
  const [areIntronsHighlighted, setAreIntronsHighlighted] = useState(false);
  const [isCdsHighlighted, setIsCdsHighlighted] = useState(false);
  const [areUtrsHighlighted, setAreUtrsHighlighted] = useState(false);
  const [areTranscriptBoundariesShown, setAreTranscriptBoundariesShown] =
    useState(false);
  const [areOverlappingGenesShown, setAreOverlappingGenesShown] =
    useState(true);
  const [areOverlappingTranscriptsShown, setAreOverlappingTranscriptsShown] =
    useState(true);
  const [isReverseComplement, setIsReverseComplement] = useState(false);
  const [fivePrimeFlankLength, setFivePrimeFlankLength] = useState(10);
  const [threePrimeFlankLength, setThreePrimeFlankLength] = useState(10);
  const entity = parseEntityId(entityId);
  const location = parseLocation(new URLSearchParams(search).get('location'));
  const savedGenome = committedSpecies.find(
    (species) =>
      species.genome_id === genomeId || species.genome_tag === genomeId
  );
  const shouldResolveGenome = !savedGenome && Boolean(genomeId);
  const {
    currentData: genomeSummary,
    error: genomeError,
    isFetching: isGenomeFetching
  } = useGenomeSummaryByGenomeSlugQuery(genomeId, {
    skip: !shouldResolveGenome
  });
  const resolvedGenomeId = savedGenome?.genome_id ?? genomeSummary?.genome_id;

  const featureQueryParams = {
    genomeId: resolvedGenomeId ?? '',
    featureId: entity?.objectId ?? ''
  };
  const shouldFetchFeature = Boolean(resolvedGenomeId && entity);
  const {
    currentData: gene,
    isFetching: isGeneFetching,
    error: geneError
  } = useSequenceViewerGeneQuery(featureQueryParams, {
    skip: !shouldFetchFeature || entity?.type !== 'gene'
  });
  const {
    currentData: transcriptResponse,
    isFetching: isTranscriptFetching,
    error: transcriptError
  } = useDefaultEntityViewerTranscriptQuery(
    {
      genomeId: resolvedGenomeId ?? '',
      transcriptId: entity?.objectId ?? ''
    },
    {
      skip: !shouldFetchFeature || entity?.type !== 'transcript'
    }
  );
  const transcript = transcriptResponse?.transcript;
  const {
    currentData: region,
    isFetching: isRegionFetching,
    error: regionError
  } = useSequenceViewerRegionQuery(
    {
      genomeId: resolvedGenomeId ?? '',
      regionName: location?.regionName ?? ''
    },
    { skip: !resolvedGenomeId || !location || Boolean(entity) }
  );
  const locationFeature =
    region && location
      ? {
          slice: {
            location: { start: location.start, end: location.end },
            region,
            strand: { code: 'forward' as const }
          }
        }
      : undefined;
  const { currentData: overlappingFeatures } =
    useSequenceViewerOverlapRegionQuery(
      {
        genomeId: resolvedGenomeId ?? '',
        regionName: location?.regionName ?? '',
        start: location?.start ?? 0,
        end: location?.end ?? 0
      },
      { skip: !resolvedGenomeId || !location || Boolean(entity) }
    );
  const feature = gene ?? transcript ?? locationFeature;
  const overlapBoundaries = getOverlapBoundaries(overlappingFeatures);
  const boundaryFeatures =
    gene?.transcripts ??
    overlapBoundaries.filter(
      (boundary) =>
        (boundary.featureType === 'gene' && areOverlappingGenesShown) ||
        (boundary.featureType === 'transcript' &&
          areOverlappingTranscriptsShown)
    );
  const areFeatureBoundariesShown =
    entity?.type === 'gene' ? areTranscriptBoundariesShown : Boolean(location);
  const exonRanges = transcript ? getExonRanges(transcript) : [];
  const intronRanges = transcript ? getIntronRanges(transcript) : [];
  const cdsRanges = transcript ? getCdsRanges(transcript) : [];
  const utrRanges = getUtrRanges(exonRanges, cdsRanges);
  const cds = transcript?.product_generating_contexts[0]?.cds;
  const sequenceRequest = feature
    ? {
        checksum: feature.slice.region.sequence.checksum,
        start: feature.slice.location.start,
        end: feature.slice.location.end,
        strand: feature.slice.strand.code
      }
    : null;
  const {
    currentData: sequence,
    isFetching: isSequenceFetching,
    error: sequenceError
  } = useRefgetSequenceQuery(sequenceRequest ?? skipToken);
  const fivePrimeFlankRequest = getFlankSequenceRequest({
    feature,
    length: fivePrimeFlankLength,
    position: 'five-prime'
  });
  const threePrimeFlankRequest = getFlankSequenceRequest({
    feature,
    length: threePrimeFlankLength,
    position: 'three-prime'
  });
  const { currentData: fivePrimeFlankSequence } = useRefgetSequenceQuery(
    fivePrimeFlankRequest ?? skipToken
  );
  const { currentData: threePrimeFlankSequence } = useRefgetSequenceQuery(
    threePrimeFlankRequest ?? skipToken
  );
  const { currentData: cdsSequence, isFetching: isCdsSequenceFetching } =
    useRefgetSequenceQuery(
      isCdsHighlighted && cds ? { checksum: cds.sequence.checksum } : skipToken
    );

  const isLoading =
    isGenomeFetching ||
    isGeneFetching ||
    isTranscriptFetching ||
    isRegionFetching ||
    isSequenceFetching;
  const error =
    genomeError || geneError || transcriptError || regionError || sequenceError;

  return (
    <div className={styles.sequenceViewer}>
      <SequenceViewerAppBar
        activeGenomeId={resolvedGenomeId}
        entityId={entityId}
        species={committedSpecies}
      />
      <StandardAppLayout
        topbarContent={<FeatureSummary feature={feature} entity={entity} />}
        mainContent={
          <SequenceContent
            feature={feature}
            entity={entity}
            isMissingGenome={isGenomeNotFoundError(genomeError)}
            error={error}
            isLoading={isLoading}
            sequence={sequence}
            exonRanges={exonRanges}
            intronRanges={intronRanges}
            cdsRanges={cdsRanges}
            utrRanges={utrRanges}
            areExonsHighlighted={areExonsHighlighted}
            areIntronsHighlighted={areIntronsHighlighted}
            isCdsHighlighted={isCdsHighlighted && Boolean(cdsSequence)}
            areUtrsHighlighted={areUtrsHighlighted}
            fivePrimeFlankSequence={fivePrimeFlankSequence}
            threePrimeFlankSequence={threePrimeFlankSequence}
            isReverseComplement={isReverseComplement}
            transcripts={boundaryFeatures}
            areTranscriptBoundariesShown={areFeatureBoundariesShown}
            genomeIdForUrl={genomeId}
          />
        }
        sidebarContent={
          <SequenceSidebar
            feature={feature}
            entity={entity}
            canHighlightExons={Boolean(transcript)}
            areExonsHighlighted={areExonsHighlighted}
            onExonHighlightChange={setAreExonsHighlighted}
            areIntronsHighlighted={areIntronsHighlighted}
            onIntronHighlightChange={setAreIntronsHighlighted}
            canHighlightCds={Boolean(cds)}
            isCdsHighlighted={isCdsHighlighted}
            isCdsSequenceFetching={isCdsSequenceFetching}
            onCdsHighlightChange={setIsCdsHighlighted}
            canHighlightUtrs={Boolean(utrRanges.length)}
            areUtrsHighlighted={areUtrsHighlighted}
            onUtrHighlightChange={setAreUtrsHighlighted}
            canShowTranscriptBoundaries={
              entity?.type === 'gene' && Boolean(gene?.transcripts.length)
            }
            areTranscriptBoundariesShown={areTranscriptBoundariesShown}
            onTranscriptBoundariesShownChange={setAreTranscriptBoundariesShown}
            canShowOverlappingFeatures={Boolean(location)}
            overlappingGenesCount={
              overlapBoundaries.filter(
                (boundary) => boundary.featureType === 'gene'
              ).length
            }
            areOverlappingGenesShown={areOverlappingGenesShown}
            onOverlappingGenesShownChange={setAreOverlappingGenesShown}
            overlappingTranscriptsCount={
              overlapBoundaries.filter(
                (boundary) => boundary.featureType === 'transcript'
              ).length
            }
            areOverlappingTranscriptsShown={areOverlappingTranscriptsShown}
            onOverlappingTranscriptsShownChange={
              setAreOverlappingTranscriptsShown
            }
            isReverseComplement={isReverseComplement}
            onReverseComplementChange={setIsReverseComplement}
            fivePrimeFlankLength={fivePrimeFlankLength}
            threePrimeFlankLength={threePrimeFlankLength}
            onFlankLengthsChange={({ fivePrime, threePrime }) => {
              setFivePrimeFlankLength(fivePrime);
              setThreePrimeFlankLength(threePrime);
            }}
          />
        }
        sidebarNavigation={null}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
        viewportWidth={viewportWidth}
      />
    </div>
  );
};

const SequenceViewerAppBar = (props: {
  activeGenomeId?: string;
  entityId: string;
  species: CommittedItem[];
}) => {
  const navigate = useNavigate();
  const { removeGenome } = useGenomeRemoval();

  const onSpeciesTabClick = (species: CommittedItem) => {
    const genomeId = species.genome_tag ?? species.genome_id;
    navigate(
      props.entityId
        ? urlFor.sequenceViewer({ genomeId, entityId: props.entityId })
        : '/sequence-viewer'
    );
  };

  const speciesTabs = props.species
    .filter((species) => species.isEnabled)
    .map((species) => (
      <SelectedSpecies
        key={species.genome_id}
        species={species}
        isActive={species.genome_id === props.activeGenomeId}
        onClick={onSpeciesTabClick}
        onRemove={removeGenome}
      />
    ));

  return (
    <AppBar
      topLeft={<AppName>Sequence viewer</AppName>}
      topRight={<SpeciesManagerIndicator />}
      mainContent={
        speciesTabs.length ? (
          <SpeciesTabsSlider>{speciesTabs}</SpeciesTabsSlider>
        ) : (
          'To start using this app...'
        )
      }
    />
  );
};

const FeatureSummary = (props: {
  feature: Feature | undefined;
  entity: { type: EntityType; objectId: string } | null;
}) => {
  if (!props.feature) {
    return null;
  }

  const { slice } = props.feature;

  return (
    <div className={styles.featureSummary}>
      <span>
        <span className={styles.featureSummaryLabel}>
          {props.entity?.type ?? 'region'}{' '}
        </span>
        <strong>{props.entity?.objectId ?? slice.region.name}</strong>
      </span>
      <span>{getStrandDisplayName(slice.strand.code)}</span>
      <span>
        {getFormattedLocation({
          chromosome: slice.region.name,
          start: slice.location.start,
          end: slice.location.end
        })}
      </span>
    </div>
  );
};

const SequenceContent = (props: {
  feature: Feature | undefined;
  entity: { type: EntityType; objectId: string } | null;
  isMissingGenome: boolean;
  error: unknown;
  isLoading: boolean;
  sequence?: string;
  exonRanges: SequenceRange[];
  intronRanges: SequenceRange[];
  cdsRanges: SequenceRange[];
  utrRanges: SequenceRange[];
  areExonsHighlighted: boolean;
  areIntronsHighlighted: boolean;
  isCdsHighlighted: boolean;
  areUtrsHighlighted: boolean;
  fivePrimeFlankSequence?: string;
  threePrimeFlankSequence?: string;
  isReverseComplement: boolean;
  transcripts: TranscriptBoundary[];
  areTranscriptBoundariesShown: boolean;
  genomeIdForUrl: string;
}) => {
  let content;

  if (!props.entity && !props.feature) {
    content = (
      <p>Open Sequence viewer from a gene or transcript in Feature explorer.</p>
    );
  } else if (props.isMissingGenome) {
    content = <p>Genome not found.</p>;
  } else if (props.error) {
    content = <p>Unable to load this feature sequence.</p>;
  } else if (props.isLoading || !props.sequence || !props.feature) {
    content = <CircleLoader />;
  } else {
    content = (
      <Sequence
        feature={props.feature}
        sequence={props.sequence}
        exonRanges={props.exonRanges}
        intronRanges={props.intronRanges}
        cdsRanges={props.cdsRanges}
        utrRanges={props.utrRanges}
        areExonsHighlighted={props.areExonsHighlighted}
        areIntronsHighlighted={props.areIntronsHighlighted}
        isCdsHighlighted={props.isCdsHighlighted}
        areUtrsHighlighted={props.areUtrsHighlighted}
        fivePrimeFlankSequence={props.fivePrimeFlankSequence}
        threePrimeFlankSequence={props.threePrimeFlankSequence}
        isReverseComplement={props.isReverseComplement}
        transcripts={props.transcripts}
        areTranscriptBoundariesShown={props.areTranscriptBoundariesShown}
        genomeIdForUrl={props.genomeIdForUrl}
      />
    );
  }

  return <main className={styles.content}>{content}</main>;
};

const SequenceSidebar = (props: {
  feature: Feature | undefined;
  entity: { type: EntityType; objectId: string } | null;
  canHighlightExons: boolean;
  areExonsHighlighted: boolean;
  onExonHighlightChange: (isHighlighted: boolean) => void;
  areIntronsHighlighted: boolean;
  onIntronHighlightChange: (isHighlighted: boolean) => void;
  canHighlightCds: boolean;
  isCdsHighlighted: boolean;
  isCdsSequenceFetching: boolean;
  onCdsHighlightChange: (isHighlighted: boolean) => void;
  canHighlightUtrs: boolean;
  areUtrsHighlighted: boolean;
  onUtrHighlightChange: (isHighlighted: boolean) => void;
  canShowTranscriptBoundaries: boolean;
  areTranscriptBoundariesShown: boolean;
  onTranscriptBoundariesShownChange: (isShown: boolean) => void;
  canShowOverlappingFeatures: boolean;
  overlappingGenesCount: number;
  areOverlappingGenesShown: boolean;
  onOverlappingGenesShownChange: (isShown: boolean) => void;
  overlappingTranscriptsCount: number;
  areOverlappingTranscriptsShown: boolean;
  onOverlappingTranscriptsShownChange: (isShown: boolean) => void;
  isReverseComplement: boolean;
  onReverseComplementChange: (isReverseComplement: boolean) => void;
  fivePrimeFlankLength: number;
  threePrimeFlankLength: number;
  onFlankLengthsChange: (lengths: {
    fivePrime: number;
    threePrime: number;
  }) => void;
}) => {
  if (!props.feature) {
    return <Sidebar>{null}</Sidebar>;
  }

  if (!props.entity) {
    return (
      <Sidebar>
        {props.canShowOverlappingFeatures && (
          <>
            <section className={styles.overlappingFeatures}>
              <h2 className={styles.sidebarHeading}>Overlapping features</h2>
              <ul className={styles.highlightsList}>
                <li>
                  <CheckboxWithLabel
                    checked={props.areOverlappingGenesShown}
                    label={`Genes (${props.overlappingGenesCount})`}
                    onChange={props.onOverlappingGenesShownChange}
                  />
                </li>
                <li>
                  <CheckboxWithLabel
                    checked={props.areOverlappingTranscriptsShown}
                    label={`Transcripts (${props.overlappingTranscriptsCount})`}
                    onChange={props.onOverlappingTranscriptsShownChange}
                  />
                </li>
              </ul>
            </section>
            <BoundaryKey />
            <FlankingSequenceControls
              fivePrimeFlankLength={props.fivePrimeFlankLength}
              threePrimeFlankLength={props.threePrimeFlankLength}
              onChange={props.onFlankLengthsChange}
            />
          </>
        )}
      </Sidebar>
    );
  }

  const { slice } = props.feature;
  const length = slice.location.end - slice.location.start + 1;

  return (
    <Sidebar>
      <h2 className={styles.sidebarHeading}>Feature</h2>
      <dl className={styles.featureDetails}>
        <div>
          <dt>Type</dt>
          <dd>{props.entity.type}</dd>
        </div>
        <div>
          <dt>ID</dt>
          <dd>{props.entity.objectId}</dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>{length.toLocaleString()} bp</dd>
        </div>
        <div>
          <dt>Strand</dt>
          <dd>{getStrandDisplayName(slice.strand.code)}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>
            {getFormattedLocation({
              chromosome: slice.region.name,
              start: slice.location.start,
              end: slice.location.end
            })}
          </dd>
        </div>
      </dl>
      <section className={styles.orientation}>
        <h2 className={styles.sidebarHeading}>Orientation</h2>
        <CheckboxWithLabel
          checked={props.isReverseComplement}
          label="Reverse complement"
          onChange={props.onReverseComplementChange}
        />
      </section>
      {props.canShowTranscriptBoundaries && (
        <>
          <section className={styles.transcriptBoundaries}>
            <h2 className={styles.sidebarHeading}>Transcripts</h2>
            <CheckboxWithLabel
              checked={props.areTranscriptBoundariesShown}
              label="Transcript boundaries"
              onChange={props.onTranscriptBoundariesShownChange}
            />
          </section>
          <BoundaryKey showGenes={false} />
        </>
      )}
      {props.canHighlightExons && (
        <section className={styles.highlights}>
          <h2 className={styles.sidebarHeading}>Highlights</h2>
          <ul className={styles.highlightsList}>
            <li>
              <CheckboxWithLabel
                checked={props.areExonsHighlighted}
                label={<HighlightLabel type="exon" />}
                onChange={props.onExonHighlightChange}
              />
            </li>
            <li>
              <CheckboxWithLabel
                checked={props.areIntronsHighlighted}
                label={<HighlightLabel type="intron" />}
                onChange={props.onIntronHighlightChange}
              />
            </li>
            {props.canHighlightCds && (
              <li>
                <CheckboxWithLabel
                  checked={props.isCdsHighlighted}
                  disabled={props.isCdsSequenceFetching}
                  label={<HighlightLabel type="cds" />}
                  onChange={props.onCdsHighlightChange}
                />
              </li>
            )}
            {props.canHighlightUtrs && (
              <li>
                <CheckboxWithLabel
                  checked={props.areUtrsHighlighted}
                  label={<HighlightLabel type="utr" />}
                  onChange={props.onUtrHighlightChange}
                />
              </li>
            )}
          </ul>
        </section>
      )}
      <FlankingSequenceControls
        fivePrimeFlankLength={props.fivePrimeFlankLength}
        threePrimeFlankLength={props.threePrimeFlankLength}
        onChange={props.onFlankLengthsChange}
      />
    </Sidebar>
  );
};

const HighlightLabel = (props: { type: SequenceRange['type'] }) => {
  const label =
    props.type === 'exon'
      ? 'Exons'
      : props.type === 'intron'
        ? 'Introns'
        : props.type === 'cds'
          ? 'CDS'
          : 'UTRs';
  const swatchClassName =
    props.type === 'exon'
      ? styles.exonSwatch
      : props.type === 'intron'
        ? styles.intronSwatch
        : props.type === 'cds'
          ? styles.cdsSwatch
          : styles.utrSwatch;

  return (
    <span className={styles.highlightLabel}>
      {label}
      <span className={swatchClassName} />
    </span>
  );
};

const BoundaryKey = (props: { showGenes?: boolean }) => (
  <section className={styles.boundaryKey}>
    <h2 className={styles.sidebarHeading}>
      {props.showGenes === false
        ? 'Transcript boundary key'
        : 'Feature boundary key'}
    </h2>
    <ul className={styles.highlightsList}>
      {props.showGenes !== false && (
        <>
          <li>
            <BoundaryKeyItem
              className={styles.geneStartBoundarySwatch}
              label="Gene start"
            />
          </li>
          <li>
            <BoundaryKeyItem
              className={styles.geneEndBoundarySwatch}
              label="Gene end"
            />
          </li>
        </>
      )}
      <li>
        <BoundaryKeyItem
          className={styles.transcriptStartBoundarySwatch}
          label="Transcript start"
        />
      </li>
      <li>
        <BoundaryKeyItem
          className={styles.transcriptEndBoundarySwatch}
          label="Transcript end"
        />
      </li>
    </ul>
  </section>
);

const BoundaryKeyItem = (props: { className: string; label: string }) => (
  <span className={styles.boundaryKeyItem}>
    <span className={props.className} />
    {props.label}
  </span>
);

const FlankingSequenceControls = (props: {
  fivePrimeFlankLength: number;
  threePrimeFlankLength: number;
  onChange: (lengths: { fivePrime: number; threePrime: number }) => void;
}) => {
  const [fivePrime, setFivePrime] = useState(
    String(props.fivePrimeFlankLength)
  );
  const [threePrime, setThreePrime] = useState(
    String(props.threePrimeFlankLength)
  );

  const applyFlanks = () => {
    props.onChange({
      fivePrime: parseFlankLength(fivePrime),
      threePrime: parseFlankLength(threePrime)
    });
  };

  return (
    <section className={styles.flankingSequence}>
      <h2 className={styles.sidebarHeading}>Flanking sequence</h2>
      <label className={styles.flankInputLabel}>
        5&apos; flank (bp)
        <Input
          className={styles.flankInput}
          min="0"
          type="number"
          value={fivePrime}
          onChange={(event) => setFivePrime(event.target.value)}
        />
      </label>
      <label className={styles.flankInputLabel}>
        3&apos; flank (bp)
        <Input
          className={styles.flankInput}
          min="0"
          type="number"
          value={threePrime}
          onChange={(event) => setThreePrime(event.target.value)}
        />
      </label>
      <button className={styles.applyFlanksButton} onClick={applyFlanks}>
        Apply
      </button>
    </section>
  );
};

const Sequence = (props: {
  feature: Feature;
  sequence: string;
  exonRanges: SequenceRange[];
  intronRanges: SequenceRange[];
  cdsRanges: SequenceRange[];
  utrRanges: SequenceRange[];
  areExonsHighlighted: boolean;
  areIntronsHighlighted: boolean;
  isCdsHighlighted: boolean;
  areUtrsHighlighted: boolean;
  fivePrimeFlankSequence?: string;
  threePrimeFlankSequence?: string;
  isReverseComplement: boolean;
  transcripts: TranscriptBoundary[];
  areTranscriptBoundariesShown: boolean;
  genomeIdForUrl: string;
}) => {
  const [selectedMarkerPosition, setSelectedMarkerPosition] = useState<
    number | null
  >(null);
  const [selectedSequence, setSelectedSequence] =
    useState<SelectedSequence | null>(null);
  const featureSequence = props.isReverseComplement
    ? getReverseComplement(props.sequence)
    : props.sequence;
  const fivePrimeFlankSequence = props.isReverseComplement
    ? getReverseComplement(props.threePrimeFlankSequence ?? '')
    : props.fivePrimeFlankSequence;
  const threePrimeFlankSequence = props.isReverseComplement
    ? getReverseComplement(props.fivePrimeFlankSequence ?? '')
    : props.threePrimeFlankSequence;
  const displayedSequence = [
    fivePrimeFlankSequence ?? '',
    featureSequence,
    threePrimeFlankSequence ?? ''
  ].join('');
  const defaultCoordinateStep =
    props.feature.slice.strand.code === 'forward' ? 1 : -1;
  const defaultStartCoordinate =
    props.feature.slice.strand.code === 'forward'
      ? props.feature.slice.location.start -
        (fivePrimeFlankSequence?.length ?? 0)
      : props.feature.slice.location.end +
        (fivePrimeFlankSequence?.length ?? 0);
  const coordinateStep = props.isReverseComplement
    ? -defaultCoordinateStep
    : defaultCoordinateStep;
  const firstCoordinate = props.isReverseComplement
    ? defaultStartCoordinate +
      defaultCoordinateStep * (displayedSequence.length - 1)
    : defaultStartCoordinate;
  const transcriptMarkers = props.areTranscriptBoundariesShown
    ? getTranscriptMarkers({
        feature: props.feature,
        transcripts: props.transcripts,
        fivePrimeFlankLength: fivePrimeFlankSequence?.length ?? 0,
        isReverseComplement: props.isReverseComplement
      })
    : [];
  const featureRanges = [
    ...(props.areExonsHighlighted ? props.exonRanges : []),
    ...(props.areIntronsHighlighted ? props.intronRanges : []),
    ...(props.isCdsHighlighted ? props.cdsRanges : []),
    ...(props.areUtrsHighlighted ? props.utrRanges : [])
  ]
    .map((range) =>
      props.isReverseComplement
        ? getReverseComplementRange(range, props.sequence.length)
        : range
    )
    .map((range) => ({
      ...range,
      start: range.start + (fivePrimeFlankSequence?.length ?? 0),
      end: range.end + (fivePrimeFlankSequence?.length ?? 0)
    }))
    .toSorted((range1, range2) => range1.start - range2.start);
  const flankRanges = [
    fivePrimeFlankSequence
      ? {
          start: 0,
          end: fivePrimeFlankSequence.length,
          type: 'flank' as const
        }
      : null,
    threePrimeFlankSequence
      ? {
          start: displayedSequence.length - threePrimeFlankSequence.length,
          end: displayedSequence.length,
          type: 'flank' as const
        }
      : null
  ].filter((range): range is SequenceRange => Boolean(range));
  const segments = getSequenceSegments(
    displayedSequence,
    [...flankRanges, ...featureRanges],
    transcriptMarkers.flatMap((marker) => [
      marker.position,
      marker.position + 1
    ])
  );
  const lines = getSequenceLines(segments);

  return (
    <div
      className={styles.sequence}
      onMouseUp={(event) => {
        const selectionContainer = event.currentTarget;

        // Native selection state is finalised after mouseup handlers run.
        requestAnimationFrame(() => {
          setSelectedSequence(
            getSelectedSequence({
              displayedSequence,
              regionName: props.feature.slice.region.name,
              firstCoordinate,
              coordinateStep,
              selectionContainer
            })
          );
        });
      }}
    >
      {lines.map((line, index) => (
        <div className={styles.sequenceLine} key={index}>
          <span className={styles.sequenceCoordinates}>
            {getCoordinateLabel(line, firstCoordinate, coordinateStep)}
          </span>
          <span className={styles.sequenceBases}>
            {line.segments.map((segment, segmentIndex) => (
              <span
                data-sequence-start={segment.start}
                className={getSegmentClassName(segment.types)}
                key={segmentIndex}
              >
                {getMarkersAtPosition(transcriptMarkers, segment.start)
                  .length ? (
                  <TranscriptBoundaryBase
                    base={segment.sequence}
                    genomeIdForUrl={props.genomeIdForUrl}
                    isExpanded={selectedMarkerPosition === segment.start}
                    markers={getMarkersAtPosition(
                      transcriptMarkers,
                      segment.start
                    )}
                    onClose={() => setSelectedMarkerPosition(null)}
                    onClick={() =>
                      setSelectedMarkerPosition((selectedPosition) =>
                        selectedPosition === segment.start
                          ? null
                          : segment.start
                      )
                    }
                  />
                ) : (
                  segment.sequence
                )}
              </span>
            ))}
          </span>
        </div>
      ))}
      {selectedSequence && (
        <SelectedSequenceMenu
          anchor={selectedSequence.anchor}
          genomeIdForUrl={props.genomeIdForUrl}
          onClose={() => setSelectedSequence(null)}
          region={selectedSequence.region}
          sequence={selectedSequence.sequence}
        />
      )}
    </div>
  );
};

const parseFlankLength = (value: string) => {
  const length = Number.parseInt(value, 10);
  return Number.isFinite(length) ? Math.max(length, 0) : 0;
};

const getReverseComplementRange = (
  range: SequenceRange,
  sequenceLength: number
): SequenceRange => ({
  ...range,
  start: sequenceLength - range.end,
  end: sequenceLength - range.start
});

const getExonRanges = (transcript: TranscriptWithExons): SequenceRange[] => {
  return transcript.spliced_exons.map(({ exon }) =>
    getSequenceRange(transcript, exon.slice.location, 'exon')
  );
};

const getIntronRanges = (transcript: TranscriptWithExons): SequenceRange[] => {
  return transcript.introns.map((intron) =>
    getSequenceRange(transcript, intron.slice.location, 'intron')
  );
};

const getCdsRanges = (transcript: TranscriptWithExons): SequenceRange[] => {
  const cds = transcript.product_generating_contexts[0]?.cds;
  if (!cds) {
    return [];
  }

  return transcript.spliced_exons.flatMap((splicedExon) => {
    const { relative_location, exon } = splicedExon;
    const start = Math.max(relative_location.start, cds.relative_start);
    const end = Math.min(relative_location.end, cds.relative_end);

    if (start > end) {
      return [];
    }

    const offsetStart = start - relative_location.start;
    const offsetEnd = end - relative_location.start + 1;
    const location =
      transcript.slice.strand.code === 'reverse'
        ? {
            start: exon.slice.location.end - offsetEnd + 1,
            end: exon.slice.location.end - offsetStart
          }
        : {
            start: exon.slice.location.start + offsetStart,
            end: exon.slice.location.start + offsetEnd - 1
          };

    return getSequenceRange(transcript, location, 'cds');
  });
};

const getUtrRanges = (
  exonRanges: SequenceRange[],
  cdsRanges: SequenceRange[]
): SequenceRange[] => {
  return exonRanges.flatMap((exonRange) => {
    const overlappingCdsRanges = cdsRanges
      .filter(
        (cdsRange) =>
          cdsRange.start < exonRange.end && cdsRange.end > exonRange.start
      )
      .toSorted((range1, range2) => range1.start - range2.start);
    const utrRanges: SequenceRange[] = [];
    let currentPosition = exonRange.start;

    for (const cdsRange of overlappingCdsRanges) {
      if (cdsRange.start > currentPosition) {
        utrRanges.push({
          start: currentPosition,
          end: cdsRange.start,
          type: 'utr'
        });
      }
      currentPosition = Math.max(currentPosition, cdsRange.end);
    }

    if (currentPosition < exonRange.end) {
      utrRanges.push({
        start: currentPosition,
        end: exonRange.end,
        type: 'utr'
      });
    }

    return utrRanges;
  });
};

const getFlankSequenceRequest = (params: {
  feature: Feature | undefined;
  length: number;
  position: 'five-prime' | 'three-prime';
}): SequenceQueryParams | null => {
  const { feature, length, position } = params;
  if (!feature || !length) {
    return null;
  }

  const { slice } = feature;
  const isReverseStrand = slice.strand.code === 'reverse';
  const isFivePrime = position === 'five-prime';
  const isBeforeFeature = isFivePrime !== isReverseStrand;

  const start = isBeforeFeature
    ? Math.max(1, slice.location.start - length)
    : slice.location.end + 1;
  const end = isBeforeFeature
    ? slice.location.start - 1
    : Math.min(slice.region.length, slice.location.end + length);

  return start <= end
    ? {
        checksum: slice.region.sequence.checksum,
        start,
        end,
        strand: slice.strand.code
      }
    : null;
};

const getSequenceRange = (
  transcript: TranscriptWithExons,
  location: { start: number; end: number },
  type: SequenceRange['type']
): SequenceRange => {
  const transcriptStart = transcript.slice.location.start;
  const transcriptEnd = transcript.slice.location.end;
  const isReverseStrand = transcript.slice.strand.code === 'reverse';

  return isReverseStrand
    ? {
        start: transcriptEnd - location.end,
        end: transcriptEnd - location.start + 1,
        type
      }
    : {
        start: location.start - transcriptStart,
        end: location.end - transcriptStart + 1,
        type
      };
};

const getSequenceSegments = (
  sequence: string,
  ranges: SequenceRange[],
  markerPositions: number[] = []
) => {
  const segments: Array<{
    start: number;
    end: number;
    sequence: string;
    types: SequenceRange['type'][];
  }> = [];
  const lineBreakPositions = Array.from(
    { length: Math.floor((sequence.length - 1) / SEQUENCE_LINE_LENGTH) },
    (_, index) => (index + 1) * SEQUENCE_LINE_LENGTH
  );
  const boundaries = Array.from(
    new Set([
      0,
      sequence.length,
      ...lineBreakPositions,
      ...markerPositions,
      ...ranges.flatMap(({ start, end }) => [start, end])
    ])
  ).toSorted((position1, position2) => position1 - position2);

  for (let index = 0; index < boundaries.length - 1; index++) {
    const start = boundaries[index];
    const end = boundaries[index + 1];
    segments.push({
      start,
      end,
      sequence: sequence.slice(start, end),
      types: ranges
        .filter((range) => range.start <= start && range.end > start)
        .map((range) => range.type)
    });
  }

  return segments;
};

const getSequenceLines = (segments: ReturnType<typeof getSequenceSegments>) => {
  const lines: Array<{
    start: number;
    end: number;
    segments: ReturnType<typeof getSequenceSegments>;
  }> = [];
  let lineSegments: ReturnType<typeof getSequenceSegments> = [];

  for (const [index, segment] of segments.entries()) {
    lineSegments.push(segment);
    if (
      segment.end % SEQUENCE_LINE_LENGTH === 0 ||
      index === segments.length - 1
    ) {
      const firstSegment = lineSegments[0];
      if (!firstSegment) {
        continue;
      }
      lines.push({
        start: firstSegment.start,
        end: segment.end,
        segments: lineSegments
      });
      lineSegments = [];
    }
  }

  return lines;
};

const getCoordinateLabel = (
  line: { start: number; end: number },
  firstCoordinate: number,
  coordinateStep: number
) => {
  const start = firstCoordinate + coordinateStep * line.start;
  const end = firstCoordinate + coordinateStep * (line.end - 1);
  return `${start.toLocaleString()} - ${end.toLocaleString()}`;
};

const getSelectedSequence = (params: {
  displayedSequence: string;
  regionName: string;
  firstCoordinate: number;
  coordinateStep: number;
  selectionContainer: HTMLElement;
}): SelectedSequence | null => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const start = getSequenceSelectionPoint({
    node: range.startContainer,
    offset: range.startOffset,
    selectionContainer: params.selectionContainer,
    edge: 'start'
  });
  const end = getSequenceSelectionPoint({
    node: range.endContainer,
    offset: range.endOffset,
    selectionContainer: params.selectionContainer,
    edge: 'end'
  });
  const focus = selection.focusNode
    ? getSequenceSelectionPoint({
        node: selection.focusNode,
        offset: selection.focusOffset,
        selectionContainer: params.selectionContainer,
        edge: 'end'
      })
    : null;

  if (!start || !end || start.position >= end.position) {
    return null;
  }

  const firstSelectedCoordinate =
    params.firstCoordinate + params.coordinateStep * start.position;
  const lastSelectedCoordinate =
    params.firstCoordinate + params.coordinateStep * (end.position - 1);
  const regionStart = Math.min(firstSelectedCoordinate, lastSelectedCoordinate);
  const regionEnd = Math.max(firstSelectedCoordinate, lastSelectedCoordinate);

  return {
    anchor: focus?.anchor ?? end.anchor,
    region: `${params.regionName}:${regionStart}-${regionEnd}`,
    sequence: params.displayedSequence.slice(start.position, end.position)
  };
};

const getSequenceSelectionPoint = (params: {
  node: Node;
  offset: number;
  selectionContainer: HTMLElement;
  edge: 'start' | 'end';
}): { position: number; anchor: HTMLElement } | null => {
  let element =
    params.node.nodeType === Node.ELEMENT_NODE
      ? (params.node as Element)
      : params.node.parentElement;
  let segment = element?.closest<HTMLElement>('[data-sequence-start]');
  let usedBoundaryFallback = false;

  // At a line boundary, browsers can report the sequence-bases element rather
  // than a text node in a sequence segment.
  if (!segment && params.node.nodeType === Node.ELEMENT_NODE) {
    usedBoundaryFallback = true;
    const childIndex =
      params.edge === 'start' ? params.offset : params.offset - 1;
    const child = params.node.childNodes.item(childIndex);
    element =
      child?.nodeType === Node.ELEMENT_NODE
        ? (child as Element)
        : (child?.parentElement ?? null);
    segment = element?.closest<HTMLElement>('[data-sequence-start]');
  }

  const sequenceStart = segment?.dataset.sequenceStart;

  if (
    !segment ||
    !sequenceStart ||
    !params.selectionContainer.contains(segment)
  ) {
    return null;
  }

  const range = document.createRange();
  range.selectNodeContents(segment);
  if (usedBoundaryFallback) {
    range.setEnd(
      segment,
      params.edge === 'start' ? 0 : segment.childNodes.length
    );
  } else {
    range.setEnd(params.node, params.offset);
  }

  return {
    anchor: segment,
    position: Number(sequenceStart) + range.toString().length
  };
};

const SelectedSequenceMenu = (props: {
  anchor: HTMLElement;
  genomeIdForUrl: string;
  onClose: () => void;
  region: string;
  sequence: string;
}) => {
  const navigate = useNavigate();

  return (
    <PointerBox
      anchor={props.anchor}
      autoAdjust={true}
      className={styles.selectedSequenceToolbox}
      onOutsideClick={props.onClose}
      position={PointerBoxPosition.BOTTOM_RIGHT}
      renderInsideAnchor={true}
    >
      <section className={styles.selectedSequenceMenu}>
        <span>Selected region</span>
        <strong>{props.region}</strong>
        <span>{props.sequence.length.toLocaleString()} bp</span>
        <div className={styles.selectedSequenceMenuActions}>
          <SelectionCopyButton label="Copy region" value={props.region} />
          <SelectionCopyButton label="Copy sequence" value={props.sequence} />
          <button
            className={styles.selectedSequenceMenuAction}
            onClick={() =>
              navigate(
                urlFor.browser({
                  genomeId: props.genomeIdForUrl,
                  focus: `location:${props.region}`,
                  location: props.region
                })
              )
            }
            type="button"
          >
            View in Genome Browser
          </button>
        </div>
      </section>
    </PointerBox>
  );
};

const SelectionCopyButton = (props: { label: string; value: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard?.writeText(props.value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      className={styles.selectedSequenceMenuAction}
      onClick={onClick}
      type="button"
    >
      {isCopied ? 'Copied' : props.label}
    </button>
  );
};

const getTranscriptMarkers = (params: {
  feature: Feature;
  transcripts: TranscriptBoundary[];
  fivePrimeFlankLength: number;
  isReverseComplement: boolean;
}): TranscriptSequenceMarker[] => {
  const { feature, transcripts, fivePrimeFlankLength, isReverseComplement } =
    params;
  const isReverseStrand = feature.slice.strand.code === 'reverse';
  const featureLength =
    feature.slice.location.end - feature.slice.location.start + 1;

  return transcripts
    .flatMap((transcript) => {
      const getSequencePosition = (coordinate: number) => {
        const positionInFeature = isReverseStrand
          ? feature.slice.location.end - coordinate
          : coordinate - feature.slice.location.start;
        const positionInDisplayedSequence = isReverseComplement
          ? featureLength - positionInFeature - 1
          : positionInFeature;

        return positionInDisplayedSequence + fivePrimeFlankLength;
      };

      const firstTranscriptBase = isReverseStrand
        ? transcript.slice.location.end
        : transcript.slice.location.start;
      const lastTranscriptBase = isReverseStrand
        ? transcript.slice.location.start
        : transcript.slice.location.end;

      return [
        {
          stableId: transcript.stable_id,
          unversionedStableId: transcript.unversioned_stable_id,
          biotype: transcript.metadata.biotype?.label ?? null,
          featureType: transcript.featureType ?? 'transcript',
          label: transcript.label ?? null,
          position: getSequencePosition(firstTranscriptBase),
          boundary: 'first' as const,
          transcript
        },
        {
          stableId: transcript.stable_id,
          unversionedStableId: transcript.unversioned_stable_id,
          biotype: transcript.metadata.biotype?.label ?? null,
          featureType: transcript.featureType ?? 'transcript',
          label: transcript.label ?? null,
          position: getSequencePosition(lastTranscriptBase),
          boundary: 'last' as const,
          transcript
        }
      ];
    })
    .filter(
      (marker) =>
        marker.position >= fivePrimeFlankLength &&
        marker.position < fivePrimeFlankLength + featureLength
    );
};

const getOverlapBoundaries = (overlap?: {
  genes: OverlapBoundaryFeature[];
  transcripts: OverlapBoundaryFeature[];
}): TranscriptBoundary[] => {
  if (!overlap) {
    return [];
  }

  const toBoundary = (
    feature: OverlapBoundaryFeature,
    featureType: EntityType
  ): TranscriptBoundary => ({
    featureType,
    label: feature.symbol ?? feature.name ?? null,
    stable_id: feature.stable_id,
    unversioned_stable_id: feature.stable_id,
    metadata: {
      biotype: feature.so_term ? { label: feature.so_term } : null
    },
    slice: feature.slice
  });

  return [
    ...overlap.genes.map((feature) => toBoundary(feature, 'gene')),
    ...overlap.transcripts.map((feature) => toBoundary(feature, 'transcript'))
  ];
};

const getMarkersAtPosition = (
  markers: TranscriptSequenceMarker[],
  position: number
) => markers.filter((marker) => marker.position === position);

const TranscriptBoundaryBase = (props: {
  base: string;
  genomeIdForUrl: string;
  markers: TranscriptSequenceMarker[];
  isExpanded: boolean;
  onClick: () => void;
  onClose: () => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null);
  const markerTypes = new Set(
    props.markers.map((marker) => marker.featureType)
  );
  const markerBoundaries = new Set(
    props.markers.map((marker) => marker.boundary)
  );
  const isStart = markerBoundaries.size === 1 && markerBoundaries.has('first');
  const boundaryClassName =
    markerTypes.size > 1
      ? styles.mixedBoundaryBaseButton
      : markerTypes.has('gene')
        ? isStart
          ? styles.geneStartBoundaryBaseButton
          : styles.geneEndBoundaryBaseButton
        : isStart
          ? styles.transcriptStartBoundaryBaseButton
          : styles.transcriptEndBoundaryBaseButton;

  return (
    <span className={styles.transcriptBoundaryBase} ref={setAnchor}>
      <button
        aria-expanded={props.isExpanded}
        aria-label="Show features starting or ending at this base"
        className={boundaryClassName}
        onClick={props.onClick}
        type="button"
      >
        {props.base}
      </button>
      {props.isExpanded && anchor && (
        <Toolbox
          anchor={anchor}
          className={styles.transcriptBoundaryToolbox}
          onOutsideClick={props.onClose}
          position={ToolboxPosition.RIGHT}
        >
          {props.markers.map((marker) => (
            <TranscriptBoundaryMenuItem
              genomeIdForUrl={props.genomeIdForUrl}
              key={`${marker.stableId}-${marker.boundary}`}
              marker={marker}
              onNavigate={props.onClose}
            />
          ))}
        </Toolbox>
      )}
    </span>
  );
};

const TranscriptBoundaryMenuItem = (props: {
  genomeIdForUrl: string;
  marker: TranscriptSequenceMarker;
  onNavigate: () => void;
}) => {
  const { marker } = props;
  const { transcript } = marker;
  const entityId = buildFocusIdForUrl({
    type: marker.featureType,
    objectId: marker.unversionedStableId
  });
  const location = getFormattedLocation({
    chromosome: transcript.slice.region.name,
    start: transcript.slice.location.start,
    end: transcript.slice.location.end
  });

  return (
    <section className={styles.transcriptBoundaryMenuItem}>
      <div className={styles.transcriptBoundaryMenuContent}>
        <div>
          <span>{marker.featureType === 'gene' ? 'Gene' : 'Transcript'}</span>
          <strong>{marker.stableId}</strong>
        </div>
        {marker.label && <div>{marker.label}</div>}
        <div>
          <span>{marker.featureType === 'gene' ? 'SO term' : 'Biotype'}</span>
          <span>{marker.biotype ?? 'Unavailable'}</span>
        </div>
        <div>{getStrandDisplayName(transcript.slice.strand.code)}</div>
        <div>{location}</div>
      </div>
      <div className={styles.transcriptBoundaryMenuLinks}>
        <ViewInApp
          links={{
            genomeBrowser: {
              url: urlFor.browser({
                genomeId: props.genomeIdForUrl,
                focus: entityId
              })
            },
            entityViewer: {
              url: urlFor.entityViewer({
                genomeId: props.genomeIdForUrl,
                entityId
              })
            },
            sequenceViewer: {
              url: urlFor.sequenceViewer({
                genomeId: props.genomeIdForUrl,
                entityId
              })
            }
          }}
          onAnyAppClick={props.onNavigate}
          theme="dark"
        />
      </div>
    </section>
  );
};

const getSegmentClassName = (types: SequenceRange['type'][]) => {
  return [
    types.includes('exon') ? styles.exonHighlight : null,
    types.includes('intron') ? styles.intronHighlight : null,
    types.includes('cds') ? styles.cdsHighlight : null,
    types.includes('utr') ? styles.utrHighlight : null,
    types.includes('flank') ? styles.flankSequence : null
  ]
    .filter(Boolean)
    .join(' ');
};

const parseEntityId = (
  entityId: string
): { type: EntityType; objectId: string } | null => {
  const match = entityId.match(/^(gene|transcript):(.+)$/);
  return match ? { type: match[1] as EntityType, objectId: match[2] } : null;
};

const parseLocation = (location: string | null) => {
  const match = location?.match(/^(.+):(\d+)-(\d+)$/);
  if (!match) {
    return null;
  }

  const [, regionName, start, end] = match;
  const startNumber = Number(start);
  const endNumber = Number(end);

  return startNumber <= endNumber
    ? { regionName, start: startNumber, end: endNumber }
    : null;
};

export default SequenceViewer;
