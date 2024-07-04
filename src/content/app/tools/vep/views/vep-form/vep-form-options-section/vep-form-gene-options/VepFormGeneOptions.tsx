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
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getVepFormParameters } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { updateParameters } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import type {
  VepFormConfig,
  VepFormParameterName
} from 'src/content/app/tools/vep/types/vepFormConfig';

import commonStyles from '../VepFormOptionsSection.module.css';

type Props = {
  config: VepFormConfig;
};

const VepFormGeneOptions = (props: Props) => {
  const { config } = props;
  const [isGeneSectionExpanded, setIsGeneSectionExpanded] = useState(false);
  const vepFormParameters = useAppSelector(getVepFormParameters);
  const dispatch = useAppDispatch();

  const toggleGeneSection = () => {
    setIsGeneSectionExpanded(!isGeneSectionExpanded);
  };

  const onCheckboxChange = (parameter: VepFormParameterName) => {
    dispatch(updateParameters({ [parameter]: !vepFormParameters[parameter] }));
  };

  const optionsContainerClasses = classNames(commonStyles.optionsGrid, {
    [commonStyles.optionsContainerCollapsed]: !isGeneSectionExpanded,
    [commonStyles.optionsContainerExpanded]: isGeneSectionExpanded
  });

  return (
    <FormSection>
      <div className={commonStyles.sectionTitleContainer}>
        <ShowHide
          label="Genes & transcripts"
          isExpanded={isGeneSectionExpanded}
          onClick={toggleGeneSection}
        />
      </div>
      <div className={optionsContainerClasses}>
        {/* show only the selected options in the collapsed view */}
        {'symbol' in vepFormParameters && isGeneSectionExpanded && (
          <Checkbox
            label={config.parameters.symbol.label}
            checked={vepFormParameters.symbol as boolean}
            onChange={() => onCheckboxChange('symbol')}
          />
        )}
        {'biotype' in vepFormParameters && (
          <Checkbox
            label={config.parameters.biotype.label}
            checked={vepFormParameters.biotype as boolean}
            onChange={() => onCheckboxChange('biotype')}
          />
        )}
      </div>
    </FormSection>
  );
};

export default VepFormGeneOptions;
