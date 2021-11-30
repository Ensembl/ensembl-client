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

import { UUID } from '../components/ItemContext';

export interface InjectedPanelAttributes {
  role: string | undefined;
  'aria-hidden': boolean | undefined;
  'aria-labelledby': string;
  id: string;
  hidden: boolean | undefined;
}

export interface InjectedHeadingAttributes {
  role: string;
}

export interface InjectedButtonAttributes {
  id: string;
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-disabled': boolean;
  role: string;
  tabIndex: number;
}

export default class AccordionStore {
  public readonly expanded: UUID[];
  public readonly allowMultipleExpanded: boolean;
  public readonly allowZeroExpanded: boolean;

  public constructor({
    expanded = [],
    allowMultipleExpanded = false,
    allowZeroExpanded = false
  }: {
    expanded?: UUID[];
    allowMultipleExpanded?: boolean;
    allowZeroExpanded?: boolean;
  }) {
    this.expanded = expanded;
    this.allowMultipleExpanded = allowMultipleExpanded;
    this.allowZeroExpanded = allowZeroExpanded;
  }

  public readonly toggleExpanded = (uuid: UUID): AccordionStore => {
    if (this.isItemDisabled(uuid)) {
      return this;
    }
    const isExpanded = this.isItemExpanded(uuid);

    if (!isExpanded) {
      return this.augment({
        expanded: this.allowMultipleExpanded ? [...this.expanded, uuid] : [uuid]
      });
    } else {
      return this.augment({
        expanded: this.expanded.filter(
          (expandedUuid: UUID): boolean => expandedUuid !== uuid
        )
      });
    }
  };

  public readonly setExpanded = (expanded: UUID[]): AccordionStore => {
    return this.augment({
      expanded: expanded
    });
  };

  public readonly isItemDisabled = (uuid: UUID): boolean => {
    const isExpanded = this.isItemExpanded(uuid);
    const isOnlyOneExpanded = this.expanded.length === 1;

    return Boolean(isExpanded && !this.allowZeroExpanded && isOnlyOneExpanded);
  };

  public readonly isItemExpanded = (uuid: UUID): boolean => {
    return this.expanded.includes(uuid);
  };

  public readonly getPanelAttributes = (
    uuid: UUID
  ): InjectedPanelAttributes => {
    const expanded = this.isItemExpanded(uuid);

    return {
      'aria-hidden': this.allowMultipleExpanded ? !expanded : undefined,
      'aria-labelledby': this.getButtonId(uuid),
      hidden: expanded ? undefined : true,
      id: this.getPanelId(uuid),
      role: this.allowMultipleExpanded ? undefined : 'region'
    };
  };

  public readonly getHeadingAttributes = (): InjectedHeadingAttributes => {
    return {
      role: 'heading'
    };
  };

  public readonly getButtonAttributes = (
    uuid: UUID
  ): InjectedButtonAttributes => {
    const expanded = this.isItemExpanded(uuid);
    const disabled = this.isItemDisabled(uuid);

    return {
      'aria-controls': this.getPanelId(uuid),
      'aria-disabled': disabled,
      'aria-expanded': expanded,
      id: this.getButtonId(uuid),
      role: 'button',
      tabIndex: 0
    };
  };

  private readonly getPanelId = (uuid: UUID): string =>
    `accordion__panel-${uuid}`;

  private readonly getButtonId = (uuid: UUID): string =>
    `accordion__heading-${uuid}`;

  private readonly augment = (args: {
    expanded?: UUID[];
    allowMultipleExpanded?: boolean;
    allowZeroExpanded?: boolean;
  }): AccordionStore => {
    return new AccordionStore({
      allowMultipleExpanded: this.allowMultipleExpanded,
      allowZeroExpanded: this.allowZeroExpanded,
      expanded: this.expanded,
      ...args
    });
  };
}
