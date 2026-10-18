import { useEffect, type SubmitEventHandler } from 'react';

import { locationRegex } from 'src/shared/helpers/genomicLocationHelpers';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { SecondaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './NoFocusInterstitial.module.css';






const NoFocusInterstitial = () => {
  const { genomeId } = useSequenceViewerIds();
  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerTranscriptSearch, transcriptSearchResults] =
    useLazySearchTranscriptsQuery();
  const { currentData: currentTranscriptSearchResults } =
    transcriptSearchResults;
  const resetGeneSearch = geneSearchResults.reset;
  const resetTranscriptSearch = transcriptSearchResults.reset;

  // reset search results if genome id changes
  useEffect(() => {
    resetGeneSearch();
    resetTranscriptSearch();
  }, [ genomeId, resetGeneSearch, resetTranscriptSearch ]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputValue = formData.get('search');
    const trimmedInputValue = (inputValue as string).trim();

    if (isLocationLike(trimmedInputValue)) {
      console.log('inputValue is location', trimmedInputValue);
    }
  }


  return (
    <div>
      <div className={styles.topPanel}>
        <form
          className={styles.searchForm}
          onSubmit={handleSubmit}
        >
          <ShadedInput
            name="search"
            autoComplete='off'
            className={styles.searchField}
            placeholder='Location, gene id or transcript id'
            autoFocus={true}
            size={'large'}
          />
          <SecondaryButton
            className={styles.submit}
          >
            Find
          </SecondaryButton>
        </form>
      </div>
      This is for when we don't have a focus feature
    </div>
  );
};

const isLocationLike = (input: string) => {
  return locationRegex.test(input);
};


export default NoFocusInterstitial;