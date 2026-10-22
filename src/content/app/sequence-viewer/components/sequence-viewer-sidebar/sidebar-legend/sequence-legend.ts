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

// we expect the legend to contain the following classes:
// .title - the title of a legend section. Applying the same styling as to SectionSidebarHeading
// .legend-item - one legend item (i.e. one row in the legend)
// .color-marker - the coloured square

const staticStyles = `
  :host {
    display: block;
  }

  .title {
    font-size: 11px;
    font-weight: var(--font-weight-light);
    border-bottom: 1px solid var(--color-medium-light-grey);
    padding-bottom: 3px;
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .legend-item {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 1rem;
    align-items: baseline;
  }

  .color-marker {
    height: 10px;
    width: 10px;
  }
`;

export class SequenceLegend extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // add a shadow DOM
  }

  set template(htmlTemplate: string | null) {
    if (htmlTemplate === null) {
      this.shadowRoot!.innerHTML = '';
      return;
    }

    const parsedTemplate = new DOMParser().parseFromString(
      htmlTemplate,
      'text/html'
    );
    const stylesTemplate = parsedTemplate.querySelector(
      'template#styles'
    ) as HTMLTemplateElement;
    const legendTemplate = parsedTemplate.querySelector(
      'template#legend'
    ) as HTMLTemplateElement;

    this.#updateStyles(stylesTemplate);

    const resultContainer = this.shadowRoot;
    resultContainer!.replaceChildren(...legendTemplate.content.childNodes);
  }

  #updateStyles(stylesTemplate: HTMLTemplateElement) {
    const dynamicStylesNode = stylesTemplate.content.querySelector('style');

    const staticStyleSheet = new CSSStyleSheet();
    staticStyleSheet.replaceSync(staticStyles);

    const styleSheets: CSSStyleSheet[] = [staticStyleSheet];

    if (dynamicStylesNode) {
      const dynamicStyles = dynamicStylesNode.textContent;
      const dynamicStyleSheet = new CSSStyleSheet();
      dynamicStyleSheet.replaceSync(dynamicStyles);
      styleSheets.push(dynamicStyleSheet);
    }

    this.shadowRoot!.adoptedStyleSheets = styleSheets;
  }
}

window.customElements.define('ens-sequence-viewer-legend', SequenceLegend);
