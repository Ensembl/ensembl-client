import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
  AccordionItemPermanentBlock
} from 'src/shared/accordion';

import { getAttributesAccordionExpandedPanel } from './state/attributesAccordionSelector';
import {
  setAttributesAccordionExpandedPanel,
  fetchAttributes,
  resetSelectedAttributes,
  updateSelectedAttributes
} from './state/attributesAccordionActions';

import {
  Genes,
  Transcripts,
  Variations,
  Location,
  Orthologues,
  Phenotypes,
  Paralogues,
  Sequences
} from './sections';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import { Attributes } from 'src/content/app/custom-download/types/Attributes';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';
import { ReactComponent as ResetIcon } from 'static/img/shared/reset.svg';
import styles from './AttributesAccordion.scss';

type Props = StateProps & DispatchProps;

const AttributesAccordion = (props: Props) => {
  useEffect(() => {
    props.fetchAttributes();
    props.updateSelectedAttributes(
      customDownloadStorageService.getSelectedAttributes()
    );
  }, []);

  const formatAccordionTitle = (expandedPanel: string) => {
    const title =
      expandedPanel.charAt(0).toUpperCase() + expandedPanel.slice(1);

    if (expandedPanel !== props.expandedPanel) {
      return <span>{title}</span>;
    }

    return (
      <span className={styles.accordionExpandedTitle}>
        Download <span> {title} </span> information
      </span>
    );
  };

  const accordionOnChange = (newExpandedPanels: string[]) => {
    props.setAttributesAccordionExpandedPanel(newExpandedPanels[0]);
  };

  const onReset = () => {
    props.resetSelectedAttributes();
    customDownloadStorageService.saveSelectedAttributes({});
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.dataSelectorHint}>
        Select the information you would like to download - these attributes
        will be displayed as columns in a table
        <span className={styles.resetIcon} onClick={onReset}>
          <ImageButton
            buttonStatus={ImageButtonStatus.ACTIVE}
            description={'Reset attributes'}
            image={ResetIcon}
          />
        </span>
      </div>
      <Accordion
        preExpanded={Array(1).fill(props.expandedPanel)}
        onChange={accordionOnChange}
      >
        <AccordionItem uuid={'genes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('genes')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItem}>
            <Genes />
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'genes' && (
              <div className={styles.permanentBlock}>
                <Genes hideUnchecked={true} hideTitles={true} />
              </div>
            )}
          </AccordionItemPermanentBlock>
        </AccordionItem>

        <AccordionItem uuid={'transcripts'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('transcripts')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItem}>
            <Transcripts />
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'transcripts' && (
              <div className={styles.permanentBlock}>
                <Transcripts hideUnchecked={true} hideTitles={true} />
              </div>
            )}
          </AccordionItemPermanentBlock>
        </AccordionItem>

        <AccordionItem uuid={'exons'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('exons')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'sequences'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('sequences')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Sequences />
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'sequences' && (
              <div className={styles.permanentBlock}>
                <Sequences hideUnchecked={true} hideTitles={true} />
              </div>
            )}
          </AccordionItemPermanentBlock>
        </AccordionItem>

        <AccordionItem uuid={'location'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('location')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Location />
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'location' && (
              <div className={styles.permanentBlock}>
                <Location hideUnchecked={true} hideTitles={true} />
              </div>
            )}
          </AccordionItemPermanentBlock>
        </AccordionItem>

        <AccordionItem uuid={'variation'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('variation')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItem}>
            <Variations />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'phenotypes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('phenotypes')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Phenotypes />
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'phenotypes' && (
              <div className={styles.permanentBlock}>
                <Phenotypes hideUnchecked={true} hideTitles={true} />
              </div>
            )}
          </AccordionItemPermanentBlock>
        </AccordionItem>

        <AccordionItem uuid={'protein'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('protein')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div>No attributes available under this section.</div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'orthologues'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('orthologues')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItem}>
            <Orthologues />
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'paralogues'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('paralogues')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Paralogues />
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

type DispatchProps = {
  setAttributesAccordionExpandedPanel: (
    setAttributesAccordionExpandedPanel: string
  ) => void;
  fetchAttributes: () => void;
  resetSelectedAttributes: () => void;
  updateSelectedAttributes: (attributes: Attributes) => void;
};

const mapDispatchToProps: DispatchProps = {
  setAttributesAccordionExpandedPanel,
  fetchAttributes,
  resetSelectedAttributes,
  updateSelectedAttributes
};

type StateProps = {
  expandedPanel: string;
};

const mapStateToProps = (state: RootState): StateProps => ({
  expandedPanel: getAttributesAccordionExpandedPanel(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributesAccordion);
