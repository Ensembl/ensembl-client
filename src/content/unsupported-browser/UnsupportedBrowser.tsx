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

import Topbar from './components/topbar/Topbar';
import SupportedWebBrowser from './components/supported-web-browser/SupportedWebBrowser';

import unsupportedBrowsersDiagramPath from 'src/content/unsupported-browser/images/unsupported_browsers_diagram.svg?url';

import styles from './UnsupportedBrowser.module.css';

const UnsupportedBrowser = () => {
  return (
    <>
      <Topbar />
      <div className={styles.container}>
        <section className={styles.section1}>
          <Diagram />
        </section>
        <section className={styles.section2}>
          <div className={styles.supportMessage}>
            We support the latest versions of these browsers
          </div>
          <SupportedBrowsers />
        </section>
        <section className={styles.section3}>
          <span>If you think you’re seeing this message in error,</span>
          <span>
            <a href="https://www.ensembl.info/contact-us/">
              please contact us via our Blog
            </a>
          </span>
        </section>
      </div>
    </>
  );
};

const Diagram = () => {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramTitle}>Venn of the unsupported browser</div>
      <img
        src={unsupportedBrowsersDiagramPath}
        alt="You may need ot update or change your browser"
      />
    </div>
  );
};

const SupportedBrowsers = () => {
  const browserNames = ['chrome', 'edge', 'firefox', 'safari'] as const;

  return (
    <div className={styles.supportedBrowsers}>
      {browserNames.map((browserName) => (
        <SupportedWebBrowser name={browserName} key={browserName} />
      ))}
    </div>
  );
};

export default UnsupportedBrowser;
