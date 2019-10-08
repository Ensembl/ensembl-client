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
} from 'src/shared/components/accordion';

import {
  getAttributesAccordionExpandedPanel,
  getSelectedAttributes
} from '../../../state/attributes/attributesSelector';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';
import {
  setAttributesAccordionExpandedPanel,
  fetchAttributes,
  resetSelectedAttributes
} from '../../../state/attributes/attributesActions';

import { Orthologues } from './sections';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import { setShowExampleData } from 'src/content/app/custom-download/state/customDownloadActions';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as ResetIcon } from 'static/img/shared/trash.svg';
import styles from './AttributesAccordion.scss';

import AttributesAccordionSection from 'src/content/app/custom-download/containers/content/attributes-accordion/sections/AttributesAccordionSection';

type Attribute = {
  [key: string]: boolean;
};
type SelectedAttributes = {
  [key: string]: boolean | Attribute;
};

type StateProps = {
  expandedPanel: string;
  selectedAttributes: {};
};

type DispatchProps = {
  setAttributesAccordionExpandedPanel: (
    setAttributesAccordionExpandedPanel: string
  ) => void;
  fetchAttributes: () => void;
  resetSelectedAttributes: () => void;
  setShowExampleData: (showExampleData: boolean) => void;
};

type Props = StateProps & DispatchProps;

const getTotalSelectedAttributes = (
  attributes: SelectedAttributes,
  totalSelectedAttributes = 0
) => {
  Object.keys(attributes).forEach((key) => {
    if (typeof attributes[key] === 'boolean' && attributes[key] === true) {
      totalSelectedAttributes++;
    } else if (typeof attributes[key] === 'object') {
      totalSelectedAttributes = getTotalSelectedAttributes(
        attributes[key] as SelectedAttributes,
        totalSelectedAttributes
      );
    }
  });

  return totalSelectedAttributes;
};

const AttributesAccordion = (props: Props) => {
  useEffect(() => {
    props.fetchAttributes();
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

  const buildSection = (options: {
    section: string;
    hideTitles?: boolean;
    hideUnchecked?: boolean;
  }) => {
    return (
      <AttributesAccordionSection
        section={options.section}
        hideTitles={options.hideTitles}
        hideUnchecked={options.hideUnchecked}
      />
    );
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <BadgedButton
          badgeContent={getTotalSelectedAttributes(props.selectedAttributes)}
          className={styles.titleBadge}
        >
          <div className={styles.title}>Data to download</div>
        </BadgedButton>
        <span
          className={styles.viewExample}
          onClick={() => props.setShowExampleData(true)}
        >
          View example data
        </span>
        <span className={styles.resetIcon} onClick={onReset}>
          <ImageButton
            buttonStatus={ImageButtonStatus.ACTIVE}
            description={'Reset attributes'}
            image={ResetIcon}
          />
        </span>
      </div>
      <Accordion
        preExpanded={[props.expandedPanel]}
        onChange={accordionOnChange}
      >
        <AccordionItem uuid={'genes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('genes')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionItem}>
            {buildSection({ section: 'genes' })}
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'genes' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'genes',
                  hideTitles: true,
                  hideUnchecked: true
                })}
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
            {buildSection({ section: 'transcripts' })}
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'transcripts' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'transcripts',
                  hideTitles: true,
                  hideUnchecked: true
                })}
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
            <div className={styles.defaultContent}>
              No attributes available under this section.
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'sequences'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('sequences')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            {buildSection({ section: 'sequences' })}
          </AccordionItemPanel>
          <AccordionItemPermanentBlock>
            {props.expandedPanel !== 'sequences' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'sequences',
                  hideTitles: true,
                  hideUnchecked: true
                })}
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
          <AccordionItemPanel>
            <div className={styles.defaultContent}>
              No attributes available under this section.
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'phenotypes'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('phenotypes')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div className={styles.defaultContent}>
              No attributes available under this section.
            </div>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem uuid={'protein'}>
          <AccordionItemHeading>
            <AccordionItemButton>
              {formatAccordionTitle('protein')}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <div className={styles.defaultContent}>
              No attributes available under this section.
            </div>
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
            <div className={styles.defaultContent}>
              No attributes available under this section.
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  setAttributesAccordionExpandedPanel,
  fetchAttributes,
  resetSelectedAttributes,
  setShowExampleData
};

const mapStateToProps = (state: RootState): StateProps => ({
  expandedPanel: getAttributesAccordionExpandedPanel(state),
  selectedAttributes: getSelectedAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributesAccordion);
