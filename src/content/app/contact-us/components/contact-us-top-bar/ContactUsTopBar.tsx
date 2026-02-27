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

/**
 * A word on naming.
 *
 * For 'app' pages (genome browser, entity viewer, etc.),
 * this space would normally be called an 'app bar'.
 * But since the contact us page isn't an 'app', the name 'top bar'
 * seems more appropriate. It seems we will only have one such 'bar'
 * on the contact us page, and it will be at the top; so there
 * shouldn't be much confusion.
 */

import ConversationIcon from 'src/shared/components/communication-framework/ConversationIcon';

import styles from './ContactUsTopBar.module.css';

const ContactUsTopBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <ConversationIcon />
        <h1>Contact us</h1>
      </div>
    </div>
  );
};

export default ContactUsTopBar;
