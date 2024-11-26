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

import { useState } from 'react';

import Modal from 'src/shared/components/modal/Modal';
import { PrimaryButton } from 'src/shared/components/button/Button';

const DefaultModalForStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <PrimaryButton onClick={toggleModal}>Show modal</PrimaryButton>
      {isOpen && (
        <Modal onClose={toggleModal}>Hello from inside the modal</Modal>
      )}
    </>
  );
};

export const DefaultModalStory = {
  name: 'default',
  render: () => <DefaultModalForStory />
};

export default {
  title: 'Components/Shared Components/Modal'
};
