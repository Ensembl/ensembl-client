import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getSelectedTranscriptDataToDownload } from 'src/content/app/custom-download/customDownloadSelectors';

import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

type Props = StateProps;

const Transcripts = (props: Props) => {
  if (
    !props.transcriptDataToDownload ||
    !props.transcriptDataToDownload.default
  ) {
    return null;
  }

  return (
    <CheckBoxGrid
      checkboxOnChange={console.log}
      gridData={props.transcriptDataToDownload}
      columns={3}
    />
  );
};

type StateProps = {
  transcriptDataToDownload: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  transcriptDataToDownload: getSelectedTranscriptDataToDownload(state)
});

export default connect(mapStateToProps)(Transcripts);
