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

import React, { useState } from 'react';

import { SecondaryButton } from 'src/shared/components/button/Button';

const ContactUs = () => {
  const [shouldShowForm, setShouldShowForm] = useState(false);

  if (shouldShowForm) {
    return <div>Will display the form</div>;
  }

  /*
    @Imran: update the below accordingly
  */
  return (
    <div>
      <p>
        Please contact us if you have a problem with the website or need help
      </p>
      <SecondaryButton onClick={() => setShouldShowForm(!shouldShowForm)}>
        Contact us
      </SecondaryButton>
    </div>
  );
};

export default ContactUs;
