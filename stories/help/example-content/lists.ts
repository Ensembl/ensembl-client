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
  <h1>Lists</h1>

  <h2>
    Spacing
  </h2>
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
          <ol>
            <li>
              Fusce placerat efficitur varius. Donec tellus metus,
              venenatis id porta sit amet, ornare sed orci.
            </li>
            <li>
              Phasellus interdum purus viverra tristique tincidunt.
            </li>
          </ol>
        </li>
      </ol>
    </li>
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
