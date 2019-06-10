import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getTranscriptAttributes } from '../../state/attributesAccordionSelector';
import { setTranscriptAttributes } from '../../state/attributesAccordionActions';
import CheckBoxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Transcripts.scss';

type OwnProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = OwnProps & StateProps & DispatchProps;

const Transcripts = (props: Props) => {
  const onChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      if (!props.transcriptAttributes) {
        return;
      }

      const newTranscriptAttributes = { ...props.transcriptAttributes };

      newTranscriptAttributes[subSection][attributeId].isChecked = status;

      props.setTranscriptAttributes(newTranscriptAttributes);
    },
    [props.transcriptAttributes]
  );

  if (props.hideUnchecked) {
    if (!props.transcriptAttributes) {
      return null;
    }
    const checkedAttributes = filterCheckedAttributes(
      props.transcriptAttributes
    );

    if (Object.keys(checkedAttributes).length === 0) {
      return null;
    }

    return (
      <div className={styles.checkboxGridWrapper}>
        <CheckBoxGrid
          checkboxOnChange={onChangeHandler}
          gridData={checkedAttributes}
          columns={3}
        />
      </div>
    );
  }

  return (
    <div className={styles.checkboxGridWrapper}>
      <CheckBoxGrid
        checkboxOnChange={onChangeHandler}
        gridData={props.transcriptAttributes}
        hideTitles={props.hideTitles}
        columns={3}
      />
    </div>
  );
};

type DispatchProps = {
  setTranscriptAttributes: (setTranscriptAttributes: any) => void;
};

const mapDispatchToProps: DispatchProps = {
  setTranscriptAttributes
};

type StateProps = {
  transcriptAttributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  transcriptAttributes: getTranscriptAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transcripts);
