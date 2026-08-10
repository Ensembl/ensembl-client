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

import { Link } from 'react-router';

import { useAppDispatch } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';

import styles from './FirstVisitNotification.module.css';

/**
 * This is an entirely hard-coded notification to be shown during a brief period of time.
 *
 * The actions that this component needs to be able to perform:
 * - Close the communication panel and mark this notification
 *   with a 'less powerful' flag, so that it will still show up in the communication panel,
 *   but will not cause it to open on its own.
 * - Close the communication panel and mark this notification
 *   with a 'more powerful' flag, so that it does not even show up in the communication panel
 *
 */

const FirstVisitNotification = () => {
  const dispatch = useAppDispatch();

  const onContactUsButtonClick = () => {
    dispatch(toggleCommunicationPanel());
  };

  return (
    <>
      <p className={styles.strong}>
        Explore genome annotation across the tree of life.
      </p>

      <p>
        Welcome to the new Ensembl — home to thousands of genomes ready to
        explore in our new fast interface.
      </p>

      <p>
        You will find genomes we’ve shared before, plus a growing collection of
        new species and annotation data.
      </p>

      <p>
        We’re actively developing this site to expand tools, features, and
        species coverage. If you rely on features not yet available here,
        previous Ensembl versions remain accessible via our archives for the
        long term.
      </p>

      <p>
        <Link to="/help/articles/archives" onClick={onContactUsButtonClick}>
          Ensembl Archives
        </Link>
      </p>

      <p>
        During this transition, use whichever Ensembl site best fits your work.
        The latest archives will continue to receive extended tools support
        during this time.
      </p>

      <p>
        We welcome feedback and questions, please feel free to{' '}
        <Link to={urlFor.contactUs()} onClick={onContactUsButtonClick}>
          contact us
        </Link>
        .
      </p>
    </>
  );
};

export default FirstVisitNotification;
