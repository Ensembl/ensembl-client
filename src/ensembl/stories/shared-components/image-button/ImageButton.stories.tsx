import React from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as VisibilityIcon } from 'static/img/track-panel/eye.svg';
import { ReactComponent as EllipsisIcon } from 'static/img/track-panel/ellipsis.svg';
import { ReactComponent as BookmarkIcon } from 'static/img/track-panel/bookmark.svg';
import { ReactComponent as DownloadIcon } from 'static/img/track-panel/download.svg';
import { ReactComponent as SearchIcon } from 'static/img/track-panel/search.svg';
import { ReactComponent as PersonalDataIcon } from 'static/img/track-panel/own-data.svg';
import { ReactComponent as ShareIcon } from 'static/img/track-panel/share.svg';
import { ReactComponent as TracksManagerIcon } from 'static/img/track-panel/tracks-manager.svg';

import ImageButtonParent from './ImageButtonParent.stories';

const trackPanelButtons: any = {
  BookmarkIcon: [BookmarkIcon, 'static/img/track-panel/bookmark.svg'],
  DownloadIcon: [DownloadIcon, 'static/img/track-panel/download.svg'],
  EllipsisIcon: [EllipsisIcon, 'static/img/track-panel/ellipsis.svg'],
  PersonalDataIcon: [PersonalDataIcon, 'static/img/track-panel/own-data.svg'],
  SearchIcon: [SearchIcon, 'static/img/track-panel/search.svg'],
  ShareIcon: [ShareIcon, 'static/img/track-panel/share.svg'],
  TracksManagerIcon: [
    TracksManagerIcon,
    'static/img/track-panel/tracks-manager.svg'
  ],
  VisibilityIcon: [VisibilityIcon, 'static/img/track-panel/eye.svg']
};

const trackPanelButtonStories = storiesOf(
  'Components|Shared Components/ImageButton/TrackPanel',
  module
);

Object.keys(trackPanelButtons).forEach((buttonName: string) => {
  trackPanelButtonStories.add(buttonName, () => {
    return (
      <ImageButtonParent
        imageName={buttonName}
        image={trackPanelButtons[buttonName][0]}
        imagePath={trackPanelButtons[buttonName][1]}
        classNames={trackPanelButtons[buttonName][2]}
      />
    );
  });
});
