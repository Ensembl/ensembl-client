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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  setAttributesAccordionExpandedPanel,
  fetchAttributes,
  resetSelectedAttributes
} from 'src/content/app/custom-download/state/attributes/attributesActions';
import { Orthologues } from './sections';
import { setShowExampleData } from 'src/content/app/custom-download/state/customDownloadActions';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
  AccordionItemPermanentBlock
} from 'src/shared/components/accordion';
import BadgedButton from 'src/shared/components/badged-button/BadgedButton';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as ResetIcon } from 'static/icons/icon_delete.svg';

import AttributesAccordionSection from 'src/content/app/custom-download/containers/content/attributes-accordion/sections/AttributesAccordionSection';
import {
  getAttributesAccordionExpandedPanels,
  getSelectedAttributes
} from 'src/content/app/custom-download/state/attributes/attributesSelector';

import JSONValue from 'src/shared/types/JSON';
import { Status } from 'src/shared/types/status';

import styles from './AttributesAccordion.scss';

type StateProps = {
  expandedPanels: string[];
  selectedAttributes: JSONValue;
};

type DispatchProps = {
  setAttributesAccordionExpandedPanel: (expandedPanels: string[]) => void;
  fetchAttributes: () => void;
  resetSelectedAttributes: () => void;
  setShowExampleData: (showExampleData: boolean) => void;
};

type Props = StateProps & DispatchProps;

const getTotalSelectedAttributes = (
  attributes: JSONValue,
  totalSelectedAttributes = 0
) => {
  Object.keys(attributes).forEach((key) => {
    if (attributes[key] === true) {
      totalSelectedAttributes++;
    } else if (typeof attributes[key] === 'object') {
      totalSelectedAttributes = getTotalSelectedAttributes(
        attributes[key] as JSONValue,
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

    if (expandedPanel !== props.expandedPanels[0]) {
      return <span>{title}</span>;
    }

    return (
      <span className={styles.accordionExpandedTitle}>
        Download <span> {title} </span> information
      </span>
    );
  };

  const accordionOnChange = (newExpandedPanels: string[]) => {
    props.setAttributesAccordionExpandedPanel(newExpandedPanels);
  };

  const onReset = () => {
    props.resetSelectedAttributes();
  };

  const buildSection = (options: {
    section: string;
    hideTitles?: boolean;
    showOverview?: boolean;
  }) => {
    return (
      <AttributesAccordionSection
        section={options.section}
        hideTitles={options.hideTitles}
        showOverview={options.showOverview}
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
            status={Status.DEFAULT}
            description={'Reset attributes'}
            image={ResetIcon}
          />
        </span>
      </div>
      <Accordion
        preExpanded={props.expandedPanels}
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
            {props.expandedPanels[0] !== 'genes' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'genes',
                  hideTitles: true,
                  showOverview: true
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
            {props.expandedPanels[0] !== 'transcripts' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'transcripts',
                  hideTitles: true,
                  showOverview: true
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
            {props.expandedPanels[0] !== 'sequences' && (
              <div className={styles.permanentBlock}>
                {buildSection({
                  section: 'sequences',
                  hideTitles: true,
                  showOverview: true
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
  expandedPanels: getAttributesAccordionExpandedPanels(state),
  selectedAttributes: getSelectedAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributesAccordion);
