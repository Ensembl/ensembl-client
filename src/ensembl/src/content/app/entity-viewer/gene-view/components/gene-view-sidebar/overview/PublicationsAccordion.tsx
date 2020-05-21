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
import classNames from 'classnames';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'src/shared/components/accordion';

import JSONValue from 'src/shared/types/JSON';
import { EntityViewerSidebarPayload } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './GeneOverview.scss';

type Props = {
  sidebarPayload: EntityViewerSidebarPayload | null;
  sidebarUIState: { [key: string]: JSONValue } | null;
  updateEntityUI: (uIstate: { [key: string]: JSONValue }) => void;
};

const PublicationsAccordion = (props: Props) => {
  // TODO: Put this back once we enable the accordion
  // const publications = props.sidebarPayload?.publications || [];
  // const expandedPanels = props.sidebarUIState?.publicationsAccordion
  //   ?.expandedPanels as string[];
  const accordionItemClassNames = classNames(
    styles.entityViewerAccordionButton,
    styles.entityViewerAccordionButtonDisabled
  );

  const onChange = (expandedPanels: (string | number)[]) => {
    props.updateEntityUI({
      publicationsAccordion: {
        expandedPanels
      }
    });
  };

  return (
    <div className={styles.accordionContainer}>
      <Accordion
        className={styles.entityViewerAccordion}
        preExpanded={['publications']}
        onChange={onChange}
      >
        <AccordionItem
          className={styles.entityViewerAccordionItem}
          uuid={'publications'}
        >
          <AccordionItemHeading className={styles.entityViewerAccordionHeader}>
            <AccordionItemButton
              className={accordionItemClassNames}
              disabled={true}
            >
              Publications
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={styles.entityViewerAccordionItemContent}
          >
            <div>
              {/* {publications.map((entry, key) => renderPublication(entry, key))} */}
              No data to display here
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// TODO: Put this back once we enable the accordion
// const renderPublication = (props: Publication, key: number) => {
//   return (
//     <div className={styles.publication} key={key}>
//       <div className={styles.title}>{props.title}</div>
//       <div className={styles.authors}>{props.authors.join(', ')}</div>
//       <ExternalLink linkText={props.source.value} href={props.source.url} />
//       <div className={styles.sourceDescription}>{props.source.name}</div>
//     </div>
//   );
// };

export default PublicationsAccordion;
