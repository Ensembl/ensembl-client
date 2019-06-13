import React, {
  FunctionComponent,
  RefObject,
  useCallback,
  useState,
  useEffect
} from 'react';

import TrackPanelListItem from './TrackPanelListItem';

import { TrackType, TrackStates } from '../trackPanelConfig';
import { ChrLocation } from '../../browserState';

import styles from './TrackPanelList.scss';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';
import { GenomeTrackCategory } from 'src/genome/genomeTypes';
import { EnsObjectTrack, EnsObject } from 'src/ens-object/ensObjectTypes';

type TrackPanelListProps = {
  activeGenomeId: string;
  browserRef: RefObject<HTMLDivElement>;
  defaultChrLocation: ChrLocation;
  drawerOpened: boolean;
  drawerView: string;
  launchbarExpanded: boolean;
  ensObjectInfo: EnsObject;
  ensObjectTracks: EnsObjectTrack;
  selectedBrowserTab: { [genomeId: string]: TrackType };
  toggleDrawer: (drawerOpened: boolean) => void;
  genomeTrackCategories: GenomeTrackCategory[];
  trackStates: TrackStates;
  updateDrawerView: (drawerView: string) => void;
};

const TrackPanelList: FunctionComponent<TrackPanelListProps> = (
  props: TrackPanelListProps
) => {
  const [currentTrackCategories, setCurrentTrackCategories] = useState<
    GenomeTrackCategory[]
  >([]);

  useEffect(() => {
    const selectedBrowserTab =
      props.selectedBrowserTab[props.activeGenomeId] || TrackType.GENOMIC;

    if (props.genomeTrackCategories.length > 0) {
      setCurrentTrackCategories(
        props.genomeTrackCategories.filter((category: GenomeTrackCategory) =>
          category.types.includes(selectedBrowserTab)
        )
      );
    }
  }, [props.selectedBrowserTab]);

  const changeDrawerView = useCallback(
    (currentTrack: string) => {
      const { drawerView, toggleDrawer, updateDrawerView } = props;

      updateDrawerView(currentTrack);

      if (!drawerView) {
        toggleDrawer(true);
      }
    },
    [props.drawerView]
  );

  const getTrackPanelListClasses = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelList} ${heightClass}`;
  };

  // const getMainTracks = (): EnsObjectTrack | null => {
  //   const { defaultChrLocation, ensObjectInfo } = props;
  //   const [, chrStart, chrEnd] = defaultChrLocation;

  //   if (chrStart === 0 && chrEnd === 0) {
  //     return null;
  //   }

  //   let geneLabel = ensObjectInfo.obj_symbol;
  //   let transcriptLabel = ensObjectInfo.associated_object.stable_id;

  //   if (ensObjectInfo.obj_type === 'transcript') {
  //     geneLabel = ensObjectInfo.associated_object.obj_symbol;
  //     transcriptLabel = ensObjectInfo.stable_id;
  //   }

  //   return {
  //     additional_info: ensObjectInfo.bio_type,
  //     child_tracks: [
  //       {
  //         additional_info: ensObjectInfo.bio_type,
  //         colour: 'BLUE',
  //         label: transcriptLabel,
  //         track_id: 'gene-feat',
  //         support_level: ensObjectInfo.associated_object.selected_info
  //       }
  //     ],
  //     // drawerView: 'gene',
  //     // id: 0,
  //     label: geneLabel,
  //     track_id: 'gene-feat'
  //   };
  // };

  const getDefaultTrackStatus = (categoryName: string, trackName: string) => {
    const statesOfCategory = props.trackStates[categoryName];

    let defaultTrackStatus = ImageButtonStatus.ACTIVE;

    if (statesOfCategory && statesOfCategory[trackName]) {
      defaultTrackStatus = statesOfCategory[trackName][props.activeGenomeId];
    }

    return defaultTrackStatus;
  };

  const getTrackListItem = (
    categoryName: string,
    track: EnsObjectTrack | null
  ) => {
    if (!track) {
      return;
    }

    return (
      <TrackPanelListItem
        activeGenomeId={props.activeGenomeId}
        browserRef={props.browserRef}
        categoryName={categoryName}
        defaultTrackStatus={getDefaultTrackStatus(categoryName, track.track_id)}
        drawerOpened={props.drawerOpened}
        drawerView={props.drawerView}
        key={track.track_id}
        track={track}
        updateDrawerView={changeDrawerView}
      >
        {track.child_tracks &&
          track.child_tracks.map((childTrack: EnsObjectTrack) =>
            getTrackListItem(categoryName, childTrack)
          )}
      </TrackPanelListItem>
    );
  };

  return (
    <div className={getTrackPanelListClasses()}>
      <section>
        <dl>{getTrackListItem('main', props.ensObjectTracks)}</dl>
      </section>
      {currentTrackCategories.map((category: GenomeTrackCategory) => (
        <section key={category.track_category_id}>
          <h4>{category.label}</h4>
          <dl>
            {category.track_list.length ? (
              category.track_list.map((track: EnsObjectTrack) =>
                getTrackListItem(category.track_category_id, track)
              )
            ) : (
              <dd className={styles.emptyListMsg}>No data available</dd>
            )}
          </dl>
        </section>
      ))}
    </div>
  );
};

export default TrackPanelList;
