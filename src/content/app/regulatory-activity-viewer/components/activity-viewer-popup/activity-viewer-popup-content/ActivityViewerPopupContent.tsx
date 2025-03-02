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

import GenePopupContent from './GenePopupContent';
import RegulatoryFeaturePopupContent from './RegulatoryFeaturePopupContent';

import type { PopupMessage } from '../activityViewerPopupMessageTypes';

type Props = {
  message: PopupMessage;
  onClose: () => void;
};

const ActivityViewerPopupContent = (props: Props) => {
  if (props.message.type === 'gene') {
    return (
      <GenePopupContent
        content={props.message.content}
        onClose={props.onClose}
      />
    );
  } else if (props.message.type === 'regulatory-feature') {
    return <RegulatoryFeaturePopupContent content={props.message.content} />;
  }

  return null;
};

export default ActivityViewerPopupContent;
