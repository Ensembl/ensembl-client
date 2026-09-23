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

import { useEffect, useRef, useState } from 'react';
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
import UnsplicedTranscript from 'src/content/app/entity-viewer/gene-view/components/unspliced-transcript/UnsplicedTranscript';
import { SequenceViewerIcon } from 'src/shared/components/app-icon';

import type { Strand } from 'src/shared/types/core-api/strand';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import {
  useSequenceViewerGeneQuery,
  useSequenceViewerRegionQuery,
  useSequenceViewerOverlapRegionQuery
} from './state/api/sequenceViewerApiSlice';

import styles from './SequenceViewer.module.css';

type EntityType = 'gene' | 'transcript';
type SequenceViewMode = 'genomic' | 'transcript' | 'cds' | 'protein';

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
  type: 'gene' | 'transcript' | 'exon' | 'intron' | 'cds' | 'utr' | 'flank';
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

type TranscriptStructure = TranscriptBoundary & {
  spliced_exons: Array<{
    relative_location: { start: number; end: number };
    exon: {
      slice: {
        location: { start: number; end: number };
      };
    };
  }>;
  product_generating_contexts: Array<{
    cds: {
      relative_start: number;
      relative_end: number;
    } | null;
  }>;
};

type GeneStructure = Feature & {
  transcripts: TranscriptStructure[];
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
  end: number;
  region: string;
  regionName: string;
  sequence: string;
  start: number;
};

type SelectedBase = {
  anchor: HTMLElement;
  coordinate: number;
};

type SequenceBlock = {
  index: number;
  start: number;
  end: number;
  request: SequenceQueryParams;
};

const SEQUENCE_LINE_LENGTH = 60;
const SEQUENCE_BLOCK_LENGTH = 4000;
const SEQUENCE_LINE_HEIGHT = 17.55;

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
  const [sequenceViewMode, setSequenceViewMode] =
    useState<SequenceViewMode>('genomic');
  const [isProteinSequenceShown, setIsProteinSequenceShown] = useState(false);
  const [areCodonsHighlighted, setAreCodonsHighlighted] = useState(false);
  const [areUtrsHighlighted, setAreUtrsHighlighted] = useState(false);
  const [areTranscriptBoundariesShown, setAreTranscriptBoundariesShown] =
    useState(false);
  const [areOverlappingTranscriptsShown, setAreOverlappingTranscriptsShown] =
    useState(true);
  const [isReverseComplement, setIsReverseComplement] = useState(false);
  const [fivePrimeFlankLength, setFivePrimeFlankLength] = useState(10);
  const [threePrimeFlankLength, setThreePrimeFlankLength] = useState(10);
  const [activeSequenceBlockIndex, setActiveSequenceBlockIndex] = useState(0);
  const [disabledGeneHighlightIds, setDisabledGeneHighlightIds] = useState<
    string[]
  >([]);
  const [selectedTranscriptIds, setSelectedTranscriptIds] = useState<string[]>(
    []
  );
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
  const viewedLocation = getLocationBlock(location, activeSequenceBlockIndex);
  const { currentData: overlappingFeatures } =
    useSequenceViewerOverlapRegionQuery(
      {
        genomeId: resolvedGenomeId ?? '',
        regionName: viewedLocation?.regionName ?? '',
        start: viewedLocation?.start ?? 0,
        end: viewedLocation?.end ?? 0
      },
      { skip: !resolvedGenomeId || !viewedLocation || Boolean(entity) }
    );
  const feature = gene ?? transcript ?? locationFeature;
  const overlappingGenes = getGenesForLocationView({
    genes: overlappingFeatures?.genes ?? [],
    location: viewedLocation
  });
  const geneRanges = locationFeature
    ? getGeneRanges({
        locationFeature,
        genes: overlappingGenes,
        disabledGeneHighlightIds
      })
    : [];
  const onGeneHighlightChange = (geneId: string, isHighlighted: boolean) => {
    setDisabledGeneHighlightIds((ids) =>
      isHighlighted
        ? ids.filter((id) => id !== geneId)
        : [...new Set([...ids, geneId])]
    );
  };
  const onTranscriptSelectionChange = (
    transcriptId: string,
    isSelected: boolean
  ) => {
    setSelectedTranscriptIds((ids) =>
      isSelected
        ? ids.length < 5
          ? [...ids, transcriptId]
          : ids
        : ids.filter((id) => id !== transcriptId)
    );
  };
  const overlapBoundaries = getOverlapBoundaries(overlappingFeatures);
  const boundaryFeatures =
    gene?.transcripts ??
    overlapBoundaries.filter(
      (boundary) =>
        boundary.featureType === 'transcript' && areOverlappingTranscriptsShown
    );
  const areFeatureBoundariesShown =
    entity?.type === 'gene' ? areTranscriptBoundariesShown : Boolean(location);
  const exonRanges = transcript ? getExonRanges(transcript) : [];
  const intronRanges = transcript ? getIntronRanges(transcript) : [];
  const cdsRanges = transcript ? getCdsRanges(transcript) : [];
  const utrRanges = getUtrRanges(exonRanges, cdsRanges);
  const cds = transcript?.product_generating_contexts[0]?.cds;
  const cdna = transcript?.product_generating_contexts[0]?.cdna;
  const proteinChecksum =
    transcript?.product_generating_contexts[0]?.product?.sequence.checksum;
  const activeSequenceBlockIndexForFeature = feature
    ? Math.min(
        activeSequenceBlockIndex,
        Math.ceil(getFeatureLength(feature) / SEQUENCE_BLOCK_LENGTH) - 1
      )
    : 0;
  const sequenceBlocks = getSequenceBlocks(
    feature,
    activeSequenceBlockIndexForFeature
  );
  const firstSequenceBlock = useRefgetSequenceQuery(
    sequenceBlocks[0]?.request ?? skipToken
  );
  const secondSequenceBlock = useRefgetSequenceQuery(
    sequenceBlocks[1]?.request ?? skipToken
  );
  const thirdSequenceBlock = useRefgetSequenceQuery(
    sequenceBlocks[2]?.request ?? skipToken
  );
  const sequenceBlockResponses = [
    firstSequenceBlock.currentData,
    secondSequenceBlock.currentData,
    thirdSequenceBlock.currentData
  ];
  const activeSequenceBlockResponseIndex = sequenceBlocks.findIndex(
    (block) => block.index === activeSequenceBlockIndexForFeature
  );
  const activeSequence =
    sequenceBlockResponses[activeSequenceBlockResponseIndex];
  const isSequenceFetching =
    [
      firstSequenceBlock.isFetching,
      secondSequenceBlock.isFetching,
      thirdSequenceBlock.isFetching
    ][activeSequenceBlockResponseIndex] ?? false;
  const sequenceError = [
    firstSequenceBlock.error,
    secondSequenceBlock.error,
    thirdSequenceBlock.error
  ][activeSequenceBlockResponseIndex];
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
      (isCdsHighlighted || sequenceViewMode === 'cds') && cds
        ? { checksum: cds.sequence.checksum }
        : skipToken
    );
  const { currentData: proteinSequence } = useRefgetSequenceQuery(
    (sequenceViewMode === 'cds' ||
      sequenceViewMode === 'protein' ||
      isProteinSequenceShown) &&
      proteinChecksum
      ? { checksum: proteinChecksum }
      : skipToken
  );
  const { currentData: cdnaSequence } = useRefgetSequenceQuery(
    sequenceViewMode === 'transcript' && cdna
      ? { checksum: cdna.sequence.checksum }
      : skipToken
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
            activeSequenceBlockIndex={activeSequenceBlockIndexForFeature}
            activeSequence={activeSequence}
            cdsSequence={cdsSequence}
            cdsRelativeStart={cds?.relative_start}
            cdnaSequence={cdnaSequence}
            proteinSequence={proteinSequence}
            sequenceViewMode={sequenceViewMode}
            isProteinSequenceShown={isProteinSequenceShown}
            areCodonsHighlighted={areCodonsHighlighted}
            onSequenceViewModeChange={setSequenceViewMode}
            sequenceBlocks={sequenceBlocks.map((block, index) => ({
              ...block,
              sequence: sequenceBlockResponses[index]
            }))}
            onActiveSequenceBlockIndexChange={setActiveSequenceBlockIndex}
            geneRanges={geneRanges}
            selectedTranscripts={
              gene?.transcripts.filter((transcript) =>
                selectedTranscriptIds.includes(transcript.stable_id)
              ) ?? []
            }
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
            genomeIdForApi={resolvedGenomeId ?? ''}
            structureFeature={entity?.type === 'gene' ? gene : transcript}
          />
        }
        sidebarContent={
          <SequenceSidebar
            feature={feature}
            entity={entity}
            genomeIdForUrl={genomeId}
            parentGene={
              transcript?.gene
                ? {
                    symbol: transcript.gene.symbol,
                    stableId: transcript.gene.stable_id
                  }
                : undefined
            }
            canHighlightExons={Boolean(transcript)}
            areExonsHighlighted={areExonsHighlighted}
            onExonHighlightChange={setAreExonsHighlighted}
            areIntronsHighlighted={areIntronsHighlighted}
            onIntronHighlightChange={setAreIntronsHighlighted}
            canHighlightCds={Boolean(cds)}
            canViewCds={Boolean(transcript && cds)}
            canShowProteinSequence={Boolean(transcript && proteinChecksum)}
            areCodonsHighlighted={areCodonsHighlighted}
            onCodonHighlightChange={setAreCodonsHighlighted}
            isCdsHighlighted={isCdsHighlighted}
            isCdsSequenceFetching={isCdsSequenceFetching}
            onCdsHighlightChange={setIsCdsHighlighted}
            sequenceViewMode={sequenceViewMode}
            onSequenceViewModeChange={(mode) =>
              setSequenceViewMode(mode as SequenceViewMode)
            }
            isProteinSequenceShown={isProteinSequenceShown}
            onProteinSequenceVisibilityChange={setIsProteinSequenceShown}
            canHighlightUtrs={Boolean(utrRanges.length)}
            areUtrsHighlighted={areUtrsHighlighted}
            onUtrHighlightChange={setAreUtrsHighlighted}
            canShowTranscriptBoundaries={
              entity?.type === 'gene' && Boolean(gene?.transcripts.length)
            }
            areTranscriptBoundariesShown={areTranscriptBoundariesShown}
            onTranscriptBoundariesShownChange={setAreTranscriptBoundariesShown}
            canShowOverlappingFeatures={Boolean(location)}
            overlappingGenes={overlappingGenes}
            disabledGeneHighlightIds={disabledGeneHighlightIds}
            onGeneHighlightChange={onGeneHighlightChange}
            totalOverlappingGenesCount={overlappingFeatures?.genes.length ?? 0}
            geneTranscripts={gene?.transcripts ?? []}
            selectedTranscriptIds={selectedTranscriptIds}
            onTranscriptSelectionChange={onTranscriptSelectionChange}
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
  activeSequence?: string;
  cdsSequence?: string;
  cdsRelativeStart?: number;
  cdnaSequence?: string;
  proteinSequence?: string;
  isProteinSequenceShown: boolean;
  areCodonsHighlighted: boolean;
  sequenceViewMode: SequenceViewMode;
  onSequenceViewModeChange: (mode: SequenceViewMode) => void;
  activeSequenceBlockIndex: number;
  sequenceBlocks: Array<SequenceBlock & { sequence?: string }>;
  onActiveSequenceBlockIndexChange: (index: number) => void;
  geneRanges: SequenceRange[];
  selectedTranscripts: TranscriptStructure[];
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
  genomeIdForApi: string;
  structureFeature: GeneStructure | TranscriptStructure | undefined;
}) => {
  const contentRef = useRef<HTMLElement>(null);
  const [sequencePosition, setSequencePosition] = useState(0);
  const { feature, isReverseComplement, onActiveSequenceBlockIndexChange } =
    props;

  useEffect(() => {
    const scrollContainer = contentRef.current?.parentElement;
    if (!scrollContainer) {
      return;
    }

    const updateSequencePosition = () => {
      const maximumScrollTop =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const position =
        maximumScrollTop > 0 ? scrollContainer.scrollTop / maximumScrollTop : 0;
      setSequencePosition(position);
      if (feature) {
        const featureLength = getFeatureLength(feature);
        const featurePosition = isReverseComplement ? 1 - position : position;
        const blockIndex = Math.min(
          Math.floor((featurePosition * featureLength) / SEQUENCE_BLOCK_LENGTH),
          Math.ceil(featureLength / SEQUENCE_BLOCK_LENGTH) - 1
        );
        onActiveSequenceBlockIndexChange(blockIndex);
      }
    };

    updateSequencePosition();
    scrollContainer.addEventListener('scroll', updateSequencePosition, {
      passive: true
    });

    return () =>
      scrollContainer.removeEventListener('scroll', updateSequencePosition);
  }, [feature, isReverseComplement, onActiveSequenceBlockIndexChange]);

  const scrollToSequencePosition = (sequencePosition: number) => {
    const scrollContainer = contentRef.current?.parentElement;
    const contentElement = contentRef.current;
    if (!scrollContainer || !contentElement || !props.feature) {
      return;
    }
    const maximumScrollTop =
      scrollContainer.scrollHeight - scrollContainer.clientHeight;
    scrollContainer.scrollTo({
      top: maximumScrollTop * sequencePosition,
      behavior: 'smooth'
    });
  };
  const sequenceModeBar =
    props.entity?.type === 'transcript' ? (
      <TranscriptSequenceModeBar
        activeMode={props.sequenceViewMode}
        onChange={props.onSequenceViewModeChange}
      />
    ) : null;

  let content;

  if (!props.entity && !props.feature) {
    content = (
      <p>Open Sequence viewer from a gene or transcript in Feature explorer.</p>
    );
  } else if (props.isMissingGenome) {
    content = <p>Genome not found.</p>;
  } else if (props.error) {
    content = <p>Unable to load this feature sequence.</p>;
  } else if (
    props.sequenceViewMode === 'transcript' &&
    props.entity?.type === 'transcript' &&
    props.feature
  ) {
    content = props.cdnaSequence ? (
      <>
        <SequenceOverviewDiagram
          entity={props.entity}
          feature={props.feature}
          structureFeature={props.structureFeature}
          isReverseComplement={props.isReverseComplement}
          onSequencePositionClick={scrollToSequencePosition}
          sequencePosition={sequencePosition}
        />
        {sequenceModeBar}
        <LinearSequence
          areCodonsHighlighted={props.areCodonsHighlighted}
          cdsRelativeStart={props.cdsRelativeStart}
          proteinSequence={
            props.isProteinSequenceShown ? props.proteinSequence : undefined
          }
          sequence={props.cdnaSequence}
        />
      </>
    ) : (
      <CircleLoader />
    );
  } else if (
    props.sequenceViewMode === 'protein' &&
    props.entity?.type === 'transcript' &&
    props.feature
  ) {
    content = props.proteinSequence ? (
      <>
        <SequenceOverviewDiagram
          entity={props.entity}
          feature={props.feature}
          structureFeature={props.structureFeature}
          isReverseComplement={props.isReverseComplement}
          onSequencePositionClick={scrollToSequencePosition}
          sequencePosition={sequencePosition}
        />
        {sequenceModeBar}
        <LinearSequence sequence={props.proteinSequence} />
      </>
    ) : (
      <CircleLoader />
    );
  } else if (
    props.sequenceViewMode === 'cds' &&
    props.entity?.type === 'transcript' &&
    props.feature
  ) {
    content = props.cdsSequence ? (
      <>
        <SequenceOverviewDiagram
          entity={props.entity}
          feature={props.feature}
          structureFeature={props.structureFeature}
          isReverseComplement={props.isReverseComplement}
          onSequencePositionClick={scrollToSequencePosition}
          sequencePosition={sequencePosition}
        />
        {sequenceModeBar}
        <CdsSequence
          areCodonsHighlighted={props.areCodonsHighlighted}
          proteinSequence={props.proteinSequence}
          sequence={props.cdsSequence}
        />
      </>
    ) : (
      <CircleLoader />
    );
  } else if (props.isLoading || !props.activeSequence || !props.feature) {
    content = <CircleLoader />;
  } else {
    content = (
      <>
        <SequenceOverviewDiagram
          entity={props.entity}
          feature={props.feature}
          structureFeature={props.structureFeature}
          isReverseComplement={props.isReverseComplement}
          onSequencePositionClick={scrollToSequencePosition}
          sequencePosition={sequencePosition}
        />
        {sequenceModeBar}
        <div
          className={styles.sequenceViewport}
          style={{
            height: `${
              getSequenceDisplayLineCount({
                feature: props.feature,
                selectedTranscripts: props.selectedTranscripts,
                cdsRanges: props.cdsRanges,
                isProteinSequenceShown: props.isProteinSequenceShown,
                proteinSequence: props.proteinSequence,
                isReverseComplement: props.isReverseComplement
              }) * SEQUENCE_LINE_HEIGHT
            }px`
          }}
        >
          <Sequence
            feature={props.feature}
            sequenceBlocks={props.sequenceBlocks}
            activeSequenceBlockIndex={props.activeSequenceBlockIndex}
            geneRanges={props.geneRanges}
            selectedTranscripts={props.selectedTranscripts}
            exonRanges={props.exonRanges}
            intronRanges={props.intronRanges}
            cdsRanges={props.cdsRanges}
            utrRanges={props.utrRanges}
            areExonsHighlighted={props.areExonsHighlighted}
            areIntronsHighlighted={props.areIntronsHighlighted}
            isCdsHighlighted={props.isCdsHighlighted}
            areUtrsHighlighted={props.areUtrsHighlighted}
            isProteinSequenceShown={props.isProteinSequenceShown}
            areCodonsHighlighted={props.areCodonsHighlighted}
            proteinSequence={props.proteinSequence}
            fivePrimeFlankSequence={props.fivePrimeFlankSequence}
            threePrimeFlankSequence={props.threePrimeFlankSequence}
            isReverseComplement={props.isReverseComplement}
            transcripts={props.transcripts}
            areTranscriptBoundariesShown={props.areTranscriptBoundariesShown}
            genomeIdForUrl={props.genomeIdForUrl}
            genomeIdForApi={props.genomeIdForApi}
          />
        </div>
      </>
    );
  }

  return (
    <main className={styles.content} ref={contentRef}>
      {content}
    </main>
  );
};

const SequenceOverviewDiagram = (props: {
  entity: { type: EntityType; objectId: string } | null;
  feature: Feature;
  structureFeature: GeneStructure | TranscriptStructure | undefined;
  isReverseComplement: boolean;
  onSequencePositionClick: (sequencePosition: number) => void;
  sequencePosition: number;
}) => {
  if (props.structureFeature) {
    return (
      <FeatureStructureDiagram {...props} feature={props.structureFeature} />
    );
  }

  return props.entity ? null : <LocationStructureDiagram {...props} />;
};

const FeatureStructureDiagram = (props: {
  feature: GeneStructure | TranscriptStructure | undefined;
  isReverseComplement: boolean;
  onSequencePositionClick: (sequencePosition: number) => void;
  sequencePosition: number;
}) => {
  if (!props.feature) {
    return null;
  }

  const { feature } = props;
  const transcripts =
    'transcripts' in feature ? feature.transcripts : [feature];
  const { start: featureStart, end: featureEnd } = feature.slice.location;
  const featureLength = featureEnd - featureStart + 1;
  const width = 1000;
  const height = 32;
  const scale = (position: number) =>
    ((position - featureStart) / featureLength) * width;
  const isSequencePositionReversed =
    (feature.slice.strand.code === 'reverse') !== props.isReverseComplement;
  const markerX =
    (isSequencePositionReversed
      ? 1 - props.sequencePosition
      : props.sequencePosition) * width;

  return (
    <section
      className={styles.featureStructure}
      aria-label="Exon and intron structure"
    >
      <div className={styles.featureStructureLabels} aria-hidden="true">
        <span>5'</span>
        <span>3'</span>
      </div>
      <svg
        className={styles.featureStructureDiagram}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Exons shown as blocks and introns as connecting lines"
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const visualPosition = Math.min(
            Math.max((event.clientX - bounds.left) / bounds.width, 0),
            1
          );
          const sequencePosition = isSequencePositionReversed
            ? 1 - visualPosition
            : visualPosition;
          props.onSequencePositionClick(sequencePosition);
        }}
      >
        {transcripts.map((transcript) => {
          const transcriptStart = scale(transcript.slice.location.start);
          const transcriptEnd = scale(transcript.slice.location.end + 1);

          return (
            <g
              key={transcript.stable_id}
              transform={`translate(${transcriptStart} 12)`}
            >
              <UnsplicedTranscript
                transcript={transcript}
                width={Math.max(transcriptEnd - transcriptStart, 1)}
                classNames={{
                  transcript: styles.featureStructureTranscript,
                  backbone: styles.featureStructureIntron
                }}
              />
            </g>
          );
        })}
        <line
          className={styles.featureStructurePosition}
          x1={markerX}
          x2={markerX}
          y1="2"
          y2={height - 2}
        />
      </svg>
    </section>
  );
};

const LocationStructureDiagram = (props: {
  feature: Feature;
  isReverseComplement: boolean;
  onSequencePositionClick: (sequencePosition: number) => void;
  sequencePosition: number;
}) => {
  const width = 1000;
  const height = 32;
  const markerX =
    (props.isReverseComplement
      ? 1 - props.sequencePosition
      : props.sequencePosition) * width;

  return (
    <section className={styles.featureStructure} aria-label="Location overview">
      <div className={styles.featureStructureLabels} aria-hidden="true">
        <span>5'</span>
        <span>3'</span>
      </div>
      <svg
        className={styles.featureStructureDiagram}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Displayed location and current sequence position"
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const visualPosition = Math.min(
            Math.max((event.clientX - bounds.left) / bounds.width, 0),
            1
          );
          props.onSequencePositionClick(
            props.isReverseComplement ? 1 - visualPosition : visualPosition
          );
        }}
      >
        <rect
          className={styles.locationStructureBlock}
          x="0"
          y="12"
          width={width}
          height="7"
        />
        <line
          className={styles.featureStructurePosition}
          x1={markerX}
          x2={markerX}
          y1="2"
          y2={height - 2}
        />
      </svg>
    </section>
  );
};

const SequenceSidebar = (props: {
  feature: Feature | undefined;
  entity: { type: EntityType; objectId: string } | null;
  genomeIdForUrl: string;
  genomeIdForApi: string;
  parentGene?: { symbol: string | null; stableId: string };
  canHighlightExons: boolean;
  areExonsHighlighted: boolean;
  onExonHighlightChange: (isHighlighted: boolean) => void;
  areIntronsHighlighted: boolean;
  onIntronHighlightChange: (isHighlighted: boolean) => void;
  canHighlightCds: boolean;
  canViewCds: boolean;
  canShowProteinSequence: boolean;
  areCodonsHighlighted: boolean;
  onCodonHighlightChange: (isHighlighted: boolean) => void;
  isCdsHighlighted: boolean;
  isCdsSequenceFetching: boolean;
  onCdsHighlightChange: (isHighlighted: boolean) => void;
  sequenceViewMode: SequenceViewMode;
  onSequenceViewModeChange: (mode: SequenceViewMode) => void;
  isProteinSequenceShown: boolean;
  onProteinSequenceVisibilityChange: (isShown: boolean) => void;
  canHighlightUtrs: boolean;
  areUtrsHighlighted: boolean;
  onUtrHighlightChange: (isHighlighted: boolean) => void;
  canShowTranscriptBoundaries: boolean;
  areTranscriptBoundariesShown: boolean;
  onTranscriptBoundariesShownChange: (isShown: boolean) => void;
  canShowOverlappingFeatures: boolean;
  overlappingGenes: OverlapBoundaryFeature[];
  disabledGeneHighlightIds: string[];
  onGeneHighlightChange: (geneId: string, isHighlighted: boolean) => void;
  totalOverlappingGenesCount: number;
  geneTranscripts: TranscriptStructure[];
  selectedTranscriptIds: string[];
  onTranscriptSelectionChange: (
    transcriptId: string,
    isSelected: boolean
  ) => void;
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
              <h2 className={styles.sidebarHeading}>Overlapping transcripts</h2>
              <ul className={styles.highlightsList}>
                <li>
                  <CheckboxWithLabel
                    checked={props.areOverlappingTranscriptsShown}
                    label={`Transcripts (${props.overlappingTranscriptsCount})`}
                    onChange={props.onOverlappingTranscriptsShownChange}
                  />
                </li>
              </ul>
            </section>
            <OverlappingGenes
              genes={props.overlappingGenes}
              disabledGeneHighlightIds={props.disabledGeneHighlightIds}
              genomeIdForUrl={props.genomeIdForUrl}
              onGeneHighlightChange={props.onGeneHighlightChange}
              totalGenesCount={props.totalOverlappingGenesCount}
            />
            <BoundaryKey showGenes={false} />
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
        {props.entity.type === 'transcript' && props.parentGene && (
          <div>
            <dt>Gene</dt>
            <dd>
              {props.parentGene.symbol ?? 'No symbol'}{' '}
              <strong>{props.parentGene.stableId}</strong>
            </dd>
          </div>
        )}
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
            <h2 className={styles.sidebarHeading}>Transcript boundaries</h2>
            <CheckboxWithLabel
              checked={props.areTranscriptBoundariesShown}
              label="Transcript boundaries"
              onChange={props.onTranscriptBoundariesShownChange}
            />
          </section>
          <GeneTranscripts
            transcripts={props.geneTranscripts}
            selectedTranscriptIds={props.selectedTranscriptIds}
            genomeIdForUrl={props.genomeIdForUrl}
            onTranscriptSelectionChange={props.onTranscriptSelectionChange}
          />
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
            {props.canShowProteinSequence && (
              <li>
                <CheckboxWithLabel
                  checked={props.isProteinSequenceShown}
                  label="Protein"
                  onChange={props.onProteinSequenceVisibilityChange}
                />
              </li>
            )}
            {props.canHighlightCds && (
              <li>
                <CheckboxWithLabel
                  checked={props.areCodonsHighlighted}
                  label="Codons"
                  onChange={props.onCodonHighlightChange}
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

const OverlappingGenes = (props: {
  genes: OverlapBoundaryFeature[];
  disabledGeneHighlightIds: string[];
  genomeIdForUrl: string;
  onGeneHighlightChange: (geneId: string, isHighlighted: boolean) => void;
  totalGenesCount: number;
}) => {
  if (!props.genes.length) {
    return null;
  }

  const isTruncated = props.genes.length < props.totalGenesCount;
  const heading = isTruncated
    ? `Closest ${props.genes.length} genes`
    : 'Overlapping genes';

  return (
    <section className={styles.overlappingGenes}>
      <h2 className={styles.sidebarHeading}>{heading}</h2>
      <ul className={styles.overlappingGeneList}>
        {props.genes.map((gene) => (
          <li key={gene.stable_id} className={styles.overlappingGeneItem}>
            <CheckboxWithLabel
              checked={!props.disabledGeneHighlightIds.includes(gene.stable_id)}
              className={styles.overlappingGene}
              label={
                <>
                  <span>{gene.symbol ?? 'No symbol'}</span>
                  <strong>{gene.stable_id}</strong>
                </>
              }
              onChange={(isHighlighted) =>
                props.onGeneHighlightChange(gene.stable_id, isHighlighted)
              }
            />
            <a
              className={styles.overlappingGeneLink}
              href={urlFor.sequenceViewer({
                genomeId: props.genomeIdForUrl,
                entityId: buildFocusIdForUrl({
                  type: 'gene',
                  objectId: gene.stable_id
                })
              })}
              aria-label={`Open ${gene.stable_id} in Sequence viewer`}
              title="Open in Sequence viewer"
            >
              <SequenceViewerIcon />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

const GeneTranscripts = (props: {
  transcripts: TranscriptStructure[];
  selectedTranscriptIds: string[];
  genomeIdForUrl: string;
  onTranscriptSelectionChange: (
    transcriptId: string,
    isSelected: boolean
  ) => void;
}) => {
  if (!props.transcripts.length) {
    return null;
  }

  return (
    <section className={styles.overlappingGenes}>
      <h2 className={styles.sidebarHeading}>Transcripts</h2>
      <ul className={styles.overlappingGeneList}>
        {props.transcripts.map((transcript) => (
          <li key={transcript.stable_id} className={styles.overlappingGeneItem}>
            <CheckboxWithLabel
              checked={props.selectedTranscriptIds.includes(
                transcript.stable_id
              )}
              className={styles.overlappingGene}
              disabled={
                props.selectedTranscriptIds.length >= 5 &&
                !props.selectedTranscriptIds.includes(transcript.stable_id)
              }
              label={<strong>{transcript.stable_id}</strong>}
              onChange={(isSelected) =>
                props.onTranscriptSelectionChange(
                  transcript.stable_id,
                  isSelected
                )
              }
            />
            <a
              className={styles.overlappingGeneLink}
              href={urlFor.sequenceViewer({
                genomeId: props.genomeIdForUrl,
                entityId: buildFocusIdForUrl({
                  type: 'transcript',
                  objectId: transcript.unversioned_stable_id
                })
              })}
              aria-label={`Open ${transcript.stable_id} in Sequence viewer`}
              title="Open in Sequence viewer"
            >
              <SequenceViewerIcon />
            </a>
          </li>
        ))}
      </ul>
    </section>
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

const CdsSequence = (props: {
  sequence: string;
  proteinSequence?: string;
  areCodonsHighlighted: boolean;
}) => {
  const lines = Array.from(
    { length: Math.ceil(props.sequence.length / SEQUENCE_LINE_LENGTH) },
    (_, index) => {
      const start = index * SEQUENCE_LINE_LENGTH;
      const sequence = props.sequence.slice(
        start,
        start + SEQUENCE_LINE_LENGTH
      );

      return { start, end: start + sequence.length, sequence };
    }
  );

  return (
    <div className={styles.cdsSequence}>
      {lines.map((line) => (
        <div className={styles.sequenceLine} key={line.start}>
          <span
            className={`${styles.sequenceCoordinates} ${styles.sequenceStartCoordinate}`}
          >
            {(line.start + 1).toLocaleString()}
          </span>
          <span className={styles.sequenceBases}>
            {getCodons(line.sequence, line.start).map((codon) => (
              <span
                className={
                  props.areCodonsHighlighted
                    ? getCodonClassName(codon.index)
                    : undefined
                }
                key={codon.index}
              >
                {codon.sequence}
              </span>
            ))}
          </span>
          <span
            className={`${styles.sequenceCoordinates} ${styles.sequenceEndCoordinate}`}
          >
            {line.end.toLocaleString()}
          </span>
          {props.proteinSequence && (
            <div className={styles.cdsProteinRow}>
              <span className={styles.cdsProteinLabel}>Protein</span>
              <span className={styles.cdsProteinSequence}>
                {getProteinCodons({
                  proteinSequence: props.proteinSequence,
                  start: line.start,
                  end: line.end
                }).map((codon) => (
                  <span
                    className={
                      props.areCodonsHighlighted
                        ? getCodonClassName(codon.index)
                        : undefined
                    }
                    key={codon.index}
                  >
                    {` ${codon.aminoAcid} `}
                  </span>
                ))}
              </span>
              <span aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const getCodons = (sequence: string, start: number) =>
  Array.from({ length: Math.ceil(sequence.length / 3) }, (_, index) => ({
    index: start / 3 + index,
    sequence: sequence.slice(index * 3, index * 3 + 3)
  }));

const getProteinCodons = (params: {
  proteinSequence: string;
  start: number;
  end: number;
}) => {
  const firstProteinPosition = params.start / 3;
  const proteinLength = Math.ceil((params.end - params.start) / 3);

  return params.proteinSequence
    .slice(firstProteinPosition, firstProteinPosition + proteinLength)
    .split('')
    .map((aminoAcid, index) => ({
      aminoAcid,
      index: firstProteinPosition + index
    }));
};

const getCodonClassName = (codonIndex: number) =>
  codonIndex % 2 ? styles.cdsCodonOdd : styles.cdsCodonEven;

const getCodonHighlightClassName = (codonIndex: number | undefined) =>
  codonIndex === undefined ? '' : getCodonClassName(codonIndex);

const LinearSequence = (props: {
  sequence: string;
  proteinSequence?: string;
  cdsRelativeStart?: number;
  areCodonsHighlighted?: boolean;
}) => {
  const lines = Array.from(
    { length: Math.ceil(props.sequence.length / SEQUENCE_LINE_LENGTH) },
    (_, index) => {
      const start = index * SEQUENCE_LINE_LENGTH;
      const sequence = props.sequence.slice(
        start,
        start + SEQUENCE_LINE_LENGTH
      );
      return { start, end: start + sequence.length, sequence };
    }
  );
  const proteinLine =
    props.proteinSequence && props.cdsRelativeStart
      ? getTranscriptProteinLine({
          sequenceLength: props.sequence.length,
          proteinSequence: props.proteinSequence,
          cdsRelativeStart: props.cdsRelativeStart
        })
      : null;
  const codonIndexes =
    props.areCodonsHighlighted && props.cdsRelativeStart
      ? getTranscriptCodonIndexes({
          sequenceLength: props.sequence.length,
          cdsRelativeStart: props.cdsRelativeStart
        })
      : new Map<number, number>();

  return (
    <div className={styles.cdsSequence}>
      {lines.map((line) => (
        <div className={styles.sequenceLine} key={line.start}>
          <span
            className={`${styles.sequenceCoordinates} ${styles.sequenceStartCoordinate}`}
          >
            {(line.start + 1).toLocaleString()}
          </span>
          <span className={styles.sequenceBases}>
            {line.sequence.split('').map((base, index) => {
              const codonIndex = codonIndexes.get(line.start + index);
              return (
                <span
                  className={getCodonHighlightClassName(codonIndex)}
                  key={line.start + index}
                >
                  {base}
                </span>
              );
            })}
          </span>
          <span
            className={`${styles.sequenceCoordinates} ${styles.sequenceEndCoordinate}`}
          >
            {line.end.toLocaleString()}
          </span>
          {proteinLine && proteinLine.slice(line.start, line.end).trim() && (
            <div className={styles.sequenceProteinRow}>
              <span className={styles.sequenceProteinLabel}>Protein</span>
              <span className={styles.sequenceProteinBases}>
                {proteinLine.slice(line.start, line.end)}
              </span>
              <span aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const getTranscriptProteinLine = (params: {
  sequenceLength: number;
  proteinSequence: string;
  cdsRelativeStart: number;
}) => {
  const line = Array.from({ length: params.sequenceLength }, () => ' ');
  const firstCdsPosition = params.cdsRelativeStart - 1;

  for (const [index, aminoAcid] of params.proteinSequence.split('').entries()) {
    const position = firstCdsPosition + index * 3 + 1;
    if (position < line.length) {
      line[position] = aminoAcid;
    }
  }

  return line.join('');
};

const getTranscriptCodonIndexes = (params: {
  sequenceLength: number;
  cdsRelativeStart: number;
}) => {
  const codonIndexes = new Map<number, number>();
  const firstCdsPosition = params.cdsRelativeStart - 1;

  for (
    let position = firstCdsPosition;
    position < params.sequenceLength;
    position++
  ) {
    codonIndexes.set(position, Math.floor((position - firstCdsPosition) / 3));
  }

  return codonIndexes;
};

const TranscriptSequenceModeBar = (props: {
  activeMode: SequenceViewMode;
  onChange: (mode: SequenceViewMode) => void;
}) => {
  const modes: Array<{ mode: SequenceViewMode; label: string }> = [
    { mode: 'genomic', label: 'Genomic' },
    { mode: 'transcript', label: 'Transcript' },
    { mode: 'cds', label: 'CDS' },
    { mode: 'protein', label: 'Protein' }
  ];

  return (
    <nav className={styles.transcriptSequenceModes} aria-label="Sequence view">
      {modes.map(({ mode, label }) => (
        <button
          className={
            mode === props.activeMode
              ? styles.transcriptSequenceModeActive
              : styles.transcriptSequenceMode
          }
          key={mode}
          onClick={() => props.onChange(mode)}
          type="button"
        >
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

const Sequence = (props: {
  feature: Feature;
  sequenceBlocks: Array<SequenceBlock & { sequence?: string }>;
  activeSequenceBlockIndex: number;
  geneRanges: SequenceRange[];
  selectedTranscripts: TranscriptStructure[];
  exonRanges: SequenceRange[];
  intronRanges: SequenceRange[];
  cdsRanges: SequenceRange[];
  utrRanges: SequenceRange[];
  areExonsHighlighted: boolean;
  areIntronsHighlighted: boolean;
  isCdsHighlighted: boolean;
  isProteinSequenceShown: boolean;
  areCodonsHighlighted: boolean;
  proteinSequence?: string;
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
  const [selectedBase, setSelectedBase] = useState<SelectedBase | null>(null);
  const activeBlock = props.sequenceBlocks.find(
    (block) => block.index === props.activeSequenceBlockIndex
  );
  const loadedBlocks = props.sequenceBlocks.filter(
    (block): block is SequenceBlock & { sequence: string } =>
      Boolean(block.sequence)
  );
  const firstLoadedBlock = loadedBlocks[0] ?? activeBlock;
  const rawSequenceOffset = firstLoadedBlock?.start ?? 0;
  const rawFeatureSequence = loadedBlocks
    .map((block) => block.sequence)
    .join('');
  const featureLength = getFeatureLength(props.feature);
  const sequenceOffset = props.isReverseComplement
    ? featureLength - rawSequenceOffset - rawFeatureSequence.length
    : rawSequenceOffset;
  const featureSequence = props.isReverseComplement
    ? getReverseComplement(rawFeatureSequence)
    : rawFeatureSequence;
  const fivePrimeFlankSequence = props.isReverseComplement
    ? getReverseComplement(props.threePrimeFlankSequence ?? '')
    : props.fivePrimeFlankSequence;
  const threePrimeFlankSequence = props.isReverseComplement
    ? getReverseComplement(props.fivePrimeFlankSequence ?? '')
    : props.threePrimeFlankSequence;
  const isFirstSequenceBlock = sequenceOffset === 0;
  const sequenceEnd = sequenceOffset + featureSequence.length;
  const isLastSequenceBlock = sequenceEnd === featureLength;
  const displayedSequence = [
    isFirstSequenceBlock ? (fivePrimeFlankSequence ?? '') : '',
    featureSequence,
    isLastSequenceBlock ? (threePrimeFlankSequence ?? '') : ''
  ].join('');
  const displayedSequenceOffset =
    sequenceOffset -
    (isFirstSequenceBlock ? (fivePrimeFlankSequence?.length ?? 0) : 0);
  const defaultCoordinateStep =
    props.feature.slice.strand.code === 'forward' ? 1 : -1;
  const defaultStartCoordinate =
    props.feature.slice.strand.code === 'forward'
      ? props.feature.slice.location.start +
        sequenceOffset -
        (isFirstSequenceBlock ? (fivePrimeFlankSequence?.length ?? 0) : 0)
      : props.feature.slice.location.end +
        -sequenceOffset +
        (isFirstSequenceBlock ? (fivePrimeFlankSequence?.length ?? 0) : 0);
  const coordinateStep = props.isReverseComplement
    ? -defaultCoordinateStep
    : defaultCoordinateStep;
  const firstCoordinate = props.isReverseComplement
    ? defaultStartCoordinate +
      defaultCoordinateStep * (displayedSequence.length - 1)
    : defaultStartCoordinate;
  const transcriptMarkers = (
    props.areTranscriptBoundariesShown
      ? getTranscriptMarkers({
          feature: props.feature,
          transcripts: props.transcripts,
          fivePrimeFlankLength: isFirstSequenceBlock
            ? (fivePrimeFlankSequence?.length ?? 0)
            : 0,
          isReverseComplement: props.isReverseComplement
        })
      : []
  )
    .filter(
      (marker) =>
        marker.position >= displayedSequenceOffset &&
        marker.position < displayedSequenceOffset + displayedSequence.length
    )
    .map((marker) => ({
      ...marker,
      position: marker.position - displayedSequenceOffset
    }));
  const featureRanges = [
    ...props.geneRanges,
    ...(props.areExonsHighlighted ? props.exonRanges : []),
    ...(props.areIntronsHighlighted ? props.intronRanges : []),
    ...(props.isCdsHighlighted ? props.cdsRanges : []),
    ...(props.areUtrsHighlighted ? props.utrRanges : [])
  ]
    .map((range) =>
      props.isReverseComplement
        ? getReverseComplementRange(range, featureLength)
        : range
    )
    .map((range) => ({
      ...range,
      start: range.start - displayedSequenceOffset,
      end: range.end - displayedSequenceOffset
    }))
    .filter((range) => range.end > 0 && range.start < displayedSequence.length)
    .map((range) => ({
      ...range,
      start: Math.max(range.start, 0),
      end: Math.min(range.end, displayedSequence.length)
    }))
    .toSorted((range1, range2) => range1.start - range2.start);
  type FlankRange = Pick<SequenceRange, 'start' | 'end'> & {
    type: 'flank';
  };
  const flankRanges = [
    isFirstSequenceBlock && fivePrimeFlankSequence
      ? {
          start: 0,
          end: fivePrimeFlankSequence.length,
          type: 'flank' as const
        }
      : null,
    isLastSequenceBlock && threePrimeFlankSequence
      ? {
          start: displayedSequence.length - threePrimeFlankSequence.length,
          end: displayedSequence.length,
          type: 'flank' as const
        }
      : null
  ].filter((range): range is FlankRange => Boolean(range));
  const segments = getSequenceSegments(
    displayedSequence,
    [...flankRanges, ...featureRanges],
    transcriptMarkers.flatMap((marker) => [
      marker.position,
      marker.position + 1
    ])
  );
  const lines = getSequenceLines(segments);
  const cdsCodonIndexes = props.areCodonsHighlighted
    ? getDisplayedCdsCodonIndexes({
        cdsRanges: props.cdsRanges,
        displayedSequenceOffset,
        featureLength,
        isReverseComplement: props.isReverseComplement
      })
    : new Map<number, number>();
  const transcriptSequenceRows = props.selectedTranscripts.map(
    (transcript) => ({
      stableId: transcript.stable_id,
      sequence: getDisplayedTranscriptSequence({
        displayedSequence,
        displayedSequenceOffset,
        feature: props.feature,
        isReverseComplement: props.isReverseComplement,
        transcript
      })
    })
  );
  const genomicProteinSequence =
    props.isProteinSequenceShown && props.proteinSequence
      ? getGenomicProteinSequence({
          cdsRanges: props.cdsRanges,
          displayedSequenceLength: displayedSequence.length,
          displayedSequenceOffset,
          featureLength,
          isReverseComplement: props.isReverseComplement,
          proteinSequence: props.proteinSequence
        })
      : null;

  return (
    <div
      className={styles.sequence}
      style={{
        top: `${
          getSequenceDisplayLineCount({
            feature: props.feature,
            selectedTranscripts: props.selectedTranscripts,
            cdsRanges: props.cdsRanges,
            isProteinSequenceShown: props.isProteinSequenceShown,
            proteinSequence: props.proteinSequence,
            isReverseComplement: props.isReverseComplement,
            untilLine: Math.floor(sequenceOffset / SEQUENCE_LINE_LENGTH)
          }) * SEQUENCE_LINE_HEIGHT
        }px`
      }}
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
          <span
            className={`${styles.sequenceCoordinates} ${styles.sequenceStartCoordinate}`}
          >
            {getLineCoordinates(line, firstCoordinate, coordinateStep).start}
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
                    coordinate={
                      firstCoordinate + coordinateStep * segment.start
                    }
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
                    regionName={props.feature.slice.region.name}
                  />
                ) : (
                  segment.sequence.split('').map((base, baseIndex) => {
                    const position = segment.start + baseIndex;
                    const coordinate =
                      firstCoordinate + coordinateStep * position;

                    return (
                      <span
                        aria-haspopup="dialog"
                        className={`${styles.sequenceBase} ${getCodonHighlightClassName(
                          cdsCodonIndexes.get(position)
                        )}`}
                        data-sequence-position={position}
                        key={position}
                        onClick={(event) => {
                          if (!window.getSelection()?.isCollapsed) {
                            return;
                          }

                          setSelectedBase({
                            anchor: event.currentTarget,
                            coordinate
                          });
                        }}
                        role="button"
                      >
                        {base}
                      </span>
                    );
                  })
                )}
              </span>
            ))}
          </span>
          <span
            className={`${styles.sequenceCoordinates} ${styles.sequenceEndCoordinate}`}
          >
            {getLineCoordinates(line, firstCoordinate, coordinateStep).end}
          </span>
          {transcriptSequenceRows.map((transcript) => {
            const transcriptLine = transcript.sequence.slice(
              line.start,
              line.end
            );

            return transcriptLine.trim() ? (
              <div
                className={styles.sequenceTranscriptRow}
                key={transcript.stableId}
              >
                <span className={styles.sequenceTranscriptLabel}>
                  {transcript.stableId}
                </span>
                <span className={styles.sequenceTranscriptBases}>
                  {transcriptLine}
                </span>
                <span aria-hidden="true" />
              </div>
            ) : null;
          })}
          {genomicProteinSequence &&
            genomicProteinSequence.slice(line.start, line.end).trim() && (
              <div className={styles.sequenceProteinRow}>
                <span className={styles.sequenceProteinLabel}>Protein</span>
                <span className={styles.sequenceProteinBases}>
                  {genomicProteinSequence.slice(line.start, line.end)}
                </span>
                <span aria-hidden="true" />
              </div>
            )}
        </div>
      ))}
      {selectedSequence && (
        <SelectedSequenceMenu
          anchor={selectedSequence.anchor}
          genomeIdForUrl={props.genomeIdForUrl}
          onClose={() => setSelectedSequence(null)}
          region={selectedSequence.region}
          regionEnd={selectedSequence.end}
          regionLength={props.feature.slice.region.length}
          regionName={selectedSequence.regionName}
          regionStart={selectedSequence.start}
          sequence={selectedSequence.sequence}
        />
      )}
      {selectedBase && (
        <SequenceBaseZmenu
          anchor={selectedBase.anchor}
          coordinate={selectedBase.coordinate}
          genomeIdForApi={props.genomeIdForApi}
          genomeIdForUrl={props.genomeIdForUrl}
          onClose={() => setSelectedBase(null)}
          regionName={props.feature.slice.region.name}
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

const getFeatureLength = (feature: Feature) =>
  feature.slice.location.end - feature.slice.location.start + 1;

const getGeneRanges = (params: {
  locationFeature: Feature;
  genes: OverlapBoundaryFeature[];
  disabledGeneHighlightIds: string[];
}): SequenceRange[] => {
  const { locationFeature, genes, disabledGeneHighlightIds } = params;
  const locationStart = locationFeature.slice.location.start;

  return genes
    .filter((gene) => !disabledGeneHighlightIds.includes(gene.stable_id))
    .map((gene) => ({
      start: gene.slice.location.start - locationStart,
      end: gene.slice.location.end - locationStart + 1,
      type: 'gene'
    }));
};

const getSequenceDisplayLineCount = (params: {
  feature: Feature;
  selectedTranscripts: TranscriptStructure[];
  cdsRanges?: SequenceRange[];
  isProteinSequenceShown?: boolean;
  proteinSequence?: string;
  isReverseComplement?: boolean;
  untilLine?: number;
}) => {
  const totalFeatureLines = Math.ceil(
    getFeatureLength(params.feature) / SEQUENCE_LINE_LENGTH
  );
  const baseLineCount = Math.min(
    params.untilLine ?? totalFeatureLines,
    totalFeatureLines
  );
  const transcriptLines = new Set<string>();

  for (const transcript of params.selectedTranscripts) {
    for (const { exon } of transcript.spliced_exons) {
      const range = getSequenceRange(
        params.feature,
        exon.slice.location,
        'transcript'
      );
      const firstLine = Math.floor(range.start / SEQUENCE_LINE_LENGTH);
      const lastLine = Math.floor((range.end - 1) / SEQUENCE_LINE_LENGTH);

      for (let line = firstLine; line <= lastLine; line++) {
        if (line < baseLineCount) {
          transcriptLines.add(`${transcript.stable_id}-${line}`);
        }
      }
    }
  }

  if (params.isProteinSequenceShown && params.proteinSequence) {
    const codingPositions = (params.cdsRanges ?? []).flatMap((range) =>
      Array.from(
        { length: range.end - range.start },
        (_, index) => range.start + index
      )
    );

    for (let index = 1; index < codingPositions.length; index += 3) {
      const codingPosition = codingPositions[index];
      const sequencePosition = params.isReverseComplement
        ? getFeatureLength(params.feature) - codingPosition - 1
        : codingPosition;
      const line = Math.floor(sequencePosition / SEQUENCE_LINE_LENGTH);

      if (line < baseLineCount) {
        transcriptLines.add(`protein-${line}`);
      }
    }
  }

  return baseLineCount + transcriptLines.size;
};

const getDisplayedTranscriptSequence = (params: {
  displayedSequence: string;
  displayedSequenceOffset: number;
  feature: Feature;
  isReverseComplement: boolean;
  transcript: TranscriptStructure;
}) => {
  const exonRanges = params.transcript.spliced_exons
    .map(({ exon }) =>
      getSequenceRange(params.feature, exon.slice.location, 'transcript')
    )
    .map((range) =>
      params.isReverseComplement
        ? getReverseComplementRange(range, getFeatureLength(params.feature))
        : range
    )
    .map((range) => ({
      start: range.start - params.displayedSequenceOffset,
      end: range.end - params.displayedSequenceOffset
    }));
  const transcriptSequence = Array.from(
    { length: params.displayedSequence.length },
    () => '-'
  );

  for (const range of exonRanges) {
    const start = Math.max(0, range.start);
    const end = Math.min(params.displayedSequence.length, range.end);

    for (let index = start; index < end; index++) {
      transcriptSequence[index] = params.displayedSequence[index];
    }
  }

  return transcriptSequence.join('');
};

const getGenomicProteinSequence = (params: {
  cdsRanges: SequenceRange[];
  displayedSequenceLength: number;
  displayedSequenceOffset: number;
  featureLength: number;
  isReverseComplement: boolean;
  proteinSequence: string;
}) => {
  const codingPositions = params.cdsRanges.flatMap((range) =>
    Array.from(
      { length: range.end - range.start },
      (_, index) => range.start + index
    )
  );
  const proteinLine = Array.from(
    { length: params.displayedSequenceLength },
    () => ' '
  );

  for (const [proteinIndex, aminoAcid] of params.proteinSequence
    .split('')
    .entries()) {
    const codingPosition = codingPositions[proteinIndex * 3 + 1];
    if (codingPosition === undefined) {
      break;
    }

    const sequencePosition = params.isReverseComplement
      ? params.featureLength - codingPosition - 1
      : codingPosition;
    const displayedPosition = sequencePosition - params.displayedSequenceOffset;

    if (displayedPosition >= 0 && displayedPosition < proteinLine.length) {
      proteinLine[displayedPosition] = aminoAcid;
    }
  }

  return proteinLine.join('');
};

const getDisplayedCdsCodonIndexes = (params: {
  cdsRanges: SequenceRange[];
  displayedSequenceOffset: number;
  featureLength: number;
  isReverseComplement: boolean;
}) => {
  const codonIndexes = new Map<number, number>();
  let codingPosition = 0;

  for (const range of params.cdsRanges) {
    for (let position = range.start; position < range.end; position++) {
      const sequencePosition = params.isReverseComplement
        ? params.featureLength - position - 1
        : position;
      codonIndexes.set(
        sequencePosition - params.displayedSequenceOffset,
        Math.floor(codingPosition / 3)
      );
      codingPosition++;
    }
  }

  return codonIndexes;
};

const getLocationBlock = (
  location: { regionName: string; start: number; end: number } | null,
  activeBlockIndex: number
) => {
  if (!location) {
    return null;
  }

  const locationLength = location.end - location.start + 1;
  const blocksCount = Math.ceil(locationLength / SEQUENCE_BLOCK_LENGTH);
  const blockIndex = Math.min(activeBlockIndex, blocksCount - 1);
  const start = location.start + blockIndex * SEQUENCE_BLOCK_LENGTH;

  return {
    regionName: location.regionName,
    start,
    end: Math.min(start + SEQUENCE_BLOCK_LENGTH - 1, location.end)
  };
};

const getSequenceBlocks = (
  feature: Feature | undefined,
  activeBlockIndex: number
): SequenceBlock[] => {
  if (!feature) {
    return [];
  }

  const featureLength = getFeatureLength(feature);
  const blocksCount = Math.ceil(featureLength / SEQUENCE_BLOCK_LENGTH);
  const firstBlockIndex = Math.max(0, activeBlockIndex - 1);
  const lastBlockIndex = Math.min(blocksCount - 1, activeBlockIndex + 1);
  const blocks: SequenceBlock[] = [];

  for (let index = firstBlockIndex; index <= lastBlockIndex; index++) {
    const start = index * SEQUENCE_BLOCK_LENGTH;
    const end = Math.min(start + SEQUENCE_BLOCK_LENGTH, featureLength);
    const isReverseStrand = feature.slice.strand.code === 'reverse';
    const sequenceStart = isReverseStrand
      ? feature.slice.location.end - end + 1
      : feature.slice.location.start + start;
    const sequenceEnd = isReverseStrand
      ? feature.slice.location.end - start
      : feature.slice.location.start + end - 1;

    blocks.push({
      index,
      start,
      end,
      request: {
        checksum: feature.slice.region.sequence.checksum,
        start: sequenceStart,
        end: sequenceEnd,
        strand: feature.slice.strand.code
      }
    });
  }

  return blocks;
};

const getSequenceRange = (
  transcript: Feature,
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

const getLineCoordinates = (
  line: { start: number; end: number },
  firstCoordinate: number,
  coordinateStep: number
) => {
  const start = firstCoordinate + coordinateStep * line.start;
  const end = firstCoordinate + coordinateStep * (line.end - 1);
  return {
    start: start.toLocaleString(),
    end: end.toLocaleString()
  };
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
    end: regionEnd,
    region: `${params.regionName}:${regionStart}-${regionEnd}`,
    regionName: params.regionName,
    sequence: params.displayedSequence.slice(start.position, end.position),
    start: regionStart
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
  regionEnd: number;
  regionLength: number;
  regionName: string;
  regionStart: number;
  sequence: string;
}) => {
  const navigate = useNavigate();
  const { currentData: overlap, isFetching } =
    useSequenceViewerOverlapRegionQuery(
      {
        genomeId: props.genomeIdForUrl,
        regionName: props.regionName,
        start: props.regionStart,
        end: props.regionEnd
      },
      {
        skip: props.regionStart < 1 || props.regionEnd > props.regionLength
      }
    );
  const markers = getBaseZmenuMarkers(overlap);

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
        {isFetching ? (
          <CircleLoader />
        ) : markers.length ? (
          <div className={styles.selectedSequenceMenuFeatures}>
            {markers.map((marker) => (
              <TranscriptBoundaryMenuItem
                genomeIdForUrl={props.genomeIdForUrl}
                key={`${marker.featureType}-${marker.stableId}`}
                marker={marker}
                onNavigate={props.onClose}
              />
            ))}
          </div>
        ) : (
          <p className={styles.selectedSequenceMenuEmpty}>
            No features overlap this sequence.
          </p>
        )}
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

const SequenceBaseZmenu = (props: {
  anchor: HTMLElement;
  coordinate: number;
  genomeIdForApi: string;
  genomeIdForUrl: string;
  onClose: () => void;
  regionName: string;
}) => {
  const { currentData: overlap, isFetching } =
    useSequenceViewerOverlapRegionQuery({
      genomeId: props.genomeIdForApi,
      regionName: props.regionName,
      start: props.coordinate,
      end: props.coordinate
    });
  const location = `${props.regionName}:${props.coordinate.toLocaleString()}`;
  const markers = getBaseZmenuMarkers(overlap);

  return (
    <Toolbox
      anchor={props.anchor}
      className={styles.transcriptBoundaryToolbox}
      onOutsideClick={props.onClose}
      position={ToolboxPosition.RIGHT}
    >
      <section className={styles.baseZmenuLocation}>
        <span>Location</span>
        <strong>{location}</strong>
      </section>
      {isFetching ? (
        <CircleLoader />
      ) : markers.length ? (
        markers.map((marker) => (
          <TranscriptBoundaryMenuItem
            genomeIdForUrl={props.genomeIdForUrl}
            key={`${marker.featureType}-${marker.stableId}`}
            marker={marker}
            onNavigate={props.onClose}
          />
        ))
      ) : (
        <p className={styles.baseZmenuEmpty}>No features overlap this base.</p>
      )}
    </Toolbox>
  );
};

const getBaseZmenuMarkers = (overlap?: {
  genes: OverlapBoundaryFeature[];
  transcripts: OverlapBoundaryFeature[];
}): TranscriptSequenceMarker[] => {
  if (!overlap) {
    return [];
  }

  const toMarker = (
    feature: OverlapBoundaryFeature,
    featureType: EntityType
  ): TranscriptSequenceMarker => ({
    featureType,
    label: feature.symbol ?? feature.name ?? null,
    position: 0,
    stableId: feature.stable_id,
    unversionedStableId: feature.stable_id,
    biotype: feature.so_term,
    boundary: 'first',
    transcript: {
      stable_id: feature.stable_id,
      unversioned_stable_id: feature.stable_id,
      metadata: { biotype: { label: feature.so_term ?? 'Unavailable' } },
      slice: feature.slice
    }
  });

  return [
    ...overlap.genes.map((feature) => toMarker(feature, 'gene')),
    ...overlap.transcripts.map((feature) => toMarker(feature, 'transcript'))
  ];
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

const getGenesForLocationView = (params: {
  genes: OverlapBoundaryFeature[];
  location: { regionName: string; start: number; end: number } | null;
}) => {
  const { genes, location } = params;
  if (genes.length <= 10 || !location) {
    return genes;
  }

  const locationMidpoint = (location.start + location.end) / 2;

  return [...genes]
    .toSorted((gene1, gene2) => {
      const gene1Midpoint =
        (gene1.slice.location.start + gene1.slice.location.end) / 2;
      const gene2Midpoint =
        (gene2.slice.location.start + gene2.slice.location.end) / 2;
      const distanceDifference =
        Math.abs(gene1Midpoint - locationMidpoint) -
        Math.abs(gene2Midpoint - locationMidpoint);

      return (
        distanceDifference || gene1.stable_id.localeCompare(gene2.stable_id)
      );
    })
    .slice(0, 10);
};

const getMarkersAtPosition = (
  markers: TranscriptSequenceMarker[],
  position: number
) => markers.filter((marker) => marker.position === position);

const TranscriptBoundaryBase = (props: {
  base: string;
  coordinate: number;
  genomeIdForUrl: string;
  markers: TranscriptSequenceMarker[];
  isExpanded: boolean;
  onClick: () => void;
  onClose: () => void;
  regionName: string;
}) => {
  const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null);
  const { currentData: overlap, isFetching } =
    useSequenceViewerOverlapRegionQuery(
      {
        genomeId: props.genomeIdForUrl,
        regionName: props.regionName,
        start: props.coordinate,
        end: props.coordinate
      },
      { skip: !props.isExpanded }
    );
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
  const menuMarkers = [
    ...props.markers,
    ...getBaseZmenuMarkers(overlap)
  ].filter(
    (marker, index, markers) =>
      markers.findIndex(
        (candidate) =>
          candidate.featureType === marker.featureType &&
          candidate.stableId === marker.stableId
      ) === index
  );

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
          {menuMarkers.map((marker) => (
            <TranscriptBoundaryMenuItem
              genomeIdForUrl={props.genomeIdForUrl}
              key={`${marker.stableId}-${marker.boundary}`}
              marker={marker}
              onNavigate={props.onClose}
            />
          ))}
          {isFetching && <CircleLoader />}
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
    types.includes('gene') || types.includes('transcript')
      ? styles.geneHighlight
      : null,
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
