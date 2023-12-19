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
import React, { useContext, useRef } from 'react';
import classNames from 'classnames';

import { TableContext } from 'src/shared/components/data-table/DataTable';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import { TableAction } from 'src/shared/components/data-table/dataTableTypes';

import styles from './PopupPanel.module.css';

const PopupPanel = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { dispatch } = useContext(TableContext) || {};

  const ref = useRef(null);

  const closePanel = () => {
    if (dispatch) {
      dispatch({
        type: 'set_selected_action',
        payload: TableAction.DEFAULT
      });
    }
  };

  useOutsideClick([ref], closePanel);

  const popupPanelClassNames = classNames(styles.popupPanel, props.className);

  return (
    <div className={popupPanelClassNames} ref={ref}>
      {props.children}
    </div>
  );
};

export default PopupPanel;
