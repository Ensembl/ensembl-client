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

import { PrimaryButton } from 'src/shared/components/button/Button';
import TextButton from 'src/shared/components/text-button/TextButton';

import styles from './BetaIntroRapidRetirement.module.css';

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

type Props = {
  onClose: () => void;
  onNotificationDismissed: () => void;
};

const BetaIntroRapidRetirement = (props: Props) => {
  return (
    <>
      <p className={styles.strong}>
        Beta is a fresher, faster way to see genome annotation across the
        taxonomic tree and get the data you need.
      </p>
      <p>
        This is the new home for both the most popular genome assemblies from
        each of the Ensembl divisions, as well as new genomes which would
        previously have been made available on Ensembl Rapid Release.
      </p>
      <p>
        It's early days for this new service, and we're working to continually
        improve and expand functionality - so any feedback would be much
        appreciated…
      </p>
      <div className={styles.buttons}>
        <PrimaryButton onClick={props.onClose}>Use Beta</PrimaryButton>
        <TextButton onClick={props.onNotificationDismissed}>
          Clear message
        </TextButton>
      </div>
    </>
  );
};

export default BetaIntroRapidRetirement;
