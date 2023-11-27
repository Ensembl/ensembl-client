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

const html = `
<article>
  <h1>Headers & body copy (H1)</h1>
  <p>
    The optimum line length for reading is around ten words,
    so article copy will be displayed at a max width to accommodate this.
    This max width for text blocks, and formatting,
    is also used — as is — in the contextual overlays.
  </p>
  <p>
    The default style for body copy is Lato 13/17 px regular, max width 440px.
  </p>
  <p>
    Heading 1 should only be used for article or video titles. Heading 2 will
    appear in body copy, with a two-line break at the end of a paragraph
    to separate the blocks of copy.
  </p>

  <h2>
    Font weight and character styles
  </h2>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nullam varius neque varius lectus feugiat, non tempus justo posuere.
    Donec consequat convallis sapien eget convallis.
    Use <strong>bold</strong> to highlight <strong>key words or phrases</strong>
    in the body copy. 
  </p>
  <p>
    A 2-line break is used to separate the preceding text from a level 2 heading.
  </p>

  <h2>
    Ordered and unordered lists
  </h2>
  <h3>
    Spacing
  </h3>
  <p>
    Every list item is indented by 25 pixels.
    Each subsequent level of nesting is further indented by another 25 pixels. 
  </p>
  <p>
    Top-level list items are separated from each other vertically by an empty line.
    Items in nested lists follow each other like regular lines of text.
  </p>

  <h3>
    Unordered (bulleted) lists
  </h3>
  <p>
    First-level list items and second-level list items use solid black circles as list markers.
    Third-level list items use hyphens as list markers
  </p>
  <ul>
    <li>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Mauris mi tellus, iaculis et neque sit amet, blandit mollis sapien.
      Nullam molestie in nisl ut auctor. Fusce quis pharetra diam.
    </li>
    <li>
      In varius neque leo, ac dapibus tellus posuere ac.
    </li>
    <li>
      Suspendisse tempor dui sed blandit dignissim. Integer ut magna nulla.
      Pellentesque porttitor eget erat sit amet tincidunt.
    </li>
  </ul>
  <p>
    And now with nesting:
  </p>
  <ul>
    <li>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Mauris mi tellus, iaculis et neque sit amet, blandit mollis sapien.
    </li>
    <ul>
      <li>
        Nullam molestie in nisl ut auctor. Fusce quis pharetra diam.
      </li>
      <li>
        Sed quis volutpat justo. Duis auctor mi at magna accumsan lacinia.
        Aliquam aliquet ligula leo, vitae vestibulum nisl aliquam at. 
      </li>
      <li>
        Ut quis metus ultrices, laoreet mi a, congue velit. 
      </li>
      <ul>
        <li>
          Fusce placerat efficitur varius. Donec tellus metus,
          venenatis id porta sit amet, ornare sed orci.
        </li>
        <li>
          Phasellus interdum purus viverra tristique tincidunt.
        </li>
      </ul>
    </ul>
    <li>
      In varius neque leo, ac dapibus tellus posuere ac.
    </li>
    <li>
      Suspendisse tempor dui sed blandit dignissim. Integer ut magna nulla.
      Pellentesque porttitor eget erat sit amet tincidunt.
    </li>
  </ul>

  <h3>
    Ordered (numbered) lists
  </h3>
  <p>
    Ordered lists have the same spacing rules for indentation and for the
    vertical distance between list items as unordered lists.
  </p>
  <ol>
    <li>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Mauris mi tellus, iaculis et neque sit amet, blandit mollis sapien.
    </li>
    <ol>
      <li>
        Nullam molestie in nisl ut auctor. Fusce quis pharetra diam.
      </li>
      <li>
        Sed quis volutpat justo. Duis auctor mi at magna accumsan lacinia.
        Aliquam aliquet ligula leo, vitae vestibulum nisl aliquam at. 
      </li>
      <li>
        Ut quis metus ultrices, laoreet mi a, congue velit. 
      </li>
      <ol>
        <li>
          Fusce placerat efficitur varius. Donec tellus metus,
          venenatis id porta sit amet, ornare sed orci.
        </li>
        <li>
          Phasellus interdum purus viverra tristique tincidunt.
        </li>
      </ol>
    </ol>
    <li>
      In varius neque leo, ac dapibus tellus posuere ac.
    </li>
    <li>
      Suspendisse tempor dui sed blandit dignissim. Integer ut magna nulla.
      Pellentesque porttitor eget erat sit amet tincidunt.
    </li>
  </ol>
</article>
`;

export default html;
