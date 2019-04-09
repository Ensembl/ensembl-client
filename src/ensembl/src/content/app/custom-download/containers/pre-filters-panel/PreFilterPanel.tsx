import React, { useState, useCallback } from 'react';

import { RoundButton, RoundButtonStatus, PrimaryButton } from 'src/shared';

import styles from './PreFilterPanel.scss';

const SearchPanel = () => {
  const [preFilterStatuses, setpreFilterStatuses] = useState<any>({});

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState<boolean>(
    true
  );

  const filterOnClick = useCallback(
    (filter: string) => {
      setpreFilterStatuses(
        (): any => {
          const currentStatus = { ...preFilterStatuses };

          currentStatus[filter] !== RoundButtonStatus.ACTIVE
            ? (currentStatus[filter] = RoundButtonStatus.ACTIVE)
            : (currentStatus[filter] = RoundButtonStatus.INACTIVE);

          // Check if atleast one filter is selected
          const selectedFilters = Object.keys(currentStatus).filter(
            (key: string) => {
              return currentStatus[key] === RoundButtonStatus.ACTIVE
                ? true
                : false;
            }
          );

          setSubmitButtonDisabled(!!selectedFilters.length);
          return currentStatus;
        }
      );
    },
    [preFilterStatuses]
  );

  const onSubmitHandler = () => {
    // do something
  };

  return (
    <section className={styles.preFilterPanel}>
      <div className={styles.panelTitle}>Select pre-filters</div>
      <div className={styles.panelContent}>
        <RoundButton
          onClick={() => {
            filterOnClick('genes');
          }}
          status={preFilterStatuses.genes}
          classNames={styles}
        >
          Genes
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('transcripts');
          }}
          status={preFilterStatuses.transcripts}
          classNames={styles}
        >
          Transcripts
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('variation');
          }}
          status={preFilterStatuses.variation}
          classNames={styles}
        >
          Variation
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('phenotypes');
          }}
          status={preFilterStatuses.phenotypes}
          classNames={styles}
        >
          Phenotypes
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('regulation');
          }}
          status={preFilterStatuses.regulation}
          classNames={styles}
        >
          Regulation
        </RoundButton>

        <PrimaryButton
          onClick={onSubmitHandler}
          className={styles.primaryButton}
          isDisabled={submitButtonDisabled}
        >
          Next
        </PrimaryButton>
      </div>
    </section>
  );
};

export default SearchPanel;
