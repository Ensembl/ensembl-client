import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getTranscriptAttributes } from 'src/content/app/custom-download/customDownloadSelectors';
import { setTranscriptAttributes } from 'src/content/app/custom-download/customDownloadActions';
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

type Props = StateProps & DispatchProps;

const Transcripts = (props: Props) => {
  if (!props.transcriptAttributes) {
    return null;
  }

  const onChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newTranscriptAttributes = { ...props.transcriptAttributes };

      newTranscriptAttributes[subSection][attributeId].checkedStatus = status;

      props.setTranscriptAttributes(newTranscriptAttributes);
    },
    [props.transcriptAttributes]
  );

  return (
    <CheckBoxGrid
      checkboxOnChange={onChangeHandler}
      gridData={props.transcriptAttributes}
      columns={3}
    />
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
