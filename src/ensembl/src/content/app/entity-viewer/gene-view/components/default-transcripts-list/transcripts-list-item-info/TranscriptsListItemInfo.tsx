import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

import transcriptsListStyles from '../DefaultTranscriptsList.scss';
import styles from './TranscriptsListITemInfo.scss';

type ItemInfoProps = {
  transcriptId: string | null;
};

type ItemInfoWithDataProps = {
  transcript: Transcript;
};

const QUERY = gql`
  query Transcript($id: String!) {
    transcript(byId: { id: $id }) {
      id
      symbol
      biotype
      slice {
        location {
          start
          end
        }
        region {
          strand {
            code
          }
        }
      }
      exons {
        slice {
          location {
            start
            end
          }
        }
      }
      cds {
        start
        end
      }
    }
  }
`;

const ItemInfo = (props: ItemInfoProps) => {
  const { data } = useQuery<{ transcript: Transcript }>(QUERY, {
    variables: { id: props.transcriptId },
    skip: !props.transcriptId
  });

  // TODO decide about the loader and possibly about error handling

  if (!data) {
    return null;
  }

  return <ItemInfoWithData transcript={data.transcript} />;
};

const ItemInfoWithData = (props: ItemInfoWithDataProps) => {
  const { transcript } = props;

  const getExonLocation = () => {
    const {
      slice: { location, region }
    } = transcript;
    return `${region.strand.value}:${location.start}-${location.end}`;
  };

  return (
    <div className={transcriptsListStyles.row}>
      <div className={transcriptsListStyles.left}>bottom left</div>
      <div className={transcriptsListStyles.middle}>
        <div className={styles.column}>
          <div>{transcript.biotype}</div>
          <div>{getExonLocation()}</div>
        </div>
        <div></div>
      </div>
      <div className={transcriptsListStyles.right}>{transcript.symbol}</div>
    </div>
  );
};

export default ItemInfo;
