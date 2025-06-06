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

import { useAppDispatch } from 'src/store';

import { closeEpigenomesSelector } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

import EpigenomeSelectionPanel from '../epigenome-selection-panel/EpigenomeSelectionPanel';
import Modal from 'src/shared/components/modal/Modal';

type Props = {
  genomeId: string;
};

const EpigenomeSelectionModal = (props: Props) => {
  const { genomeId } = props;
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(
      closeEpigenomesSelector({
        genomeId
      })
    );
  };

  return (
    <Modal onClose={onClose}>
      <EpigenomeSelectionPanel genomeId={genomeId} />
    </Modal>
  );
};

export default EpigenomeSelectionModal;
