import { TrackType } from './trackPanelConfig';

export type TrackPanelState = Readonly<{
  selectedBrowserTab: TrackType;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
}>;

export const defaultTrackPanelState: TrackPanelState = {
  selectedBrowserTab: TrackType.GENOMIC,
  trackPanelModalOpened: false,
  trackPanelModalView: '',
  trackPanelOpened: true
};
