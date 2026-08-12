/** Minimal ambient types for the parts of the YouTube IFrame API used here. */
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface OnStateChangeEvent {
    data: PlayerState;
    target: Player;
  }

  interface PlayerOptions {
    videoId?: string;
    host?: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (e: { target: Player }) => void;
      onStateChange?: (e: OnStateChangeEvent) => void;
      onError?: (e: { data: number; target: Player }) => void;
    };
  }

  interface VideoData {
    video_id?: string;
    title?: string;
    author?: string;
  }

  interface LoadPlaylistArgs {
    list: string;
    listType?: string;
    index?: number;
    startSeconds?: number;
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    loadVideoById(videoId: string): void;
    cueVideoById(videoId: string): void;
    /* playlist controls */
    loadPlaylist(args: LoadPlaylistArgs): void;
    cuePlaylist(args: LoadPlaylistArgs): void;
    getPlaylist(): string[] | null;
    /** id of the list actually loaded — not necessarily the one we asked for */
    getPlaylistId(): string | null;
    getPlaylistIndex(): number;
    playVideoAt(index: number): void;
    nextVideo(): void;
    previousVideo(): void;
    setShuffle(shuffle: boolean): void;
    setLoop(loop: boolean): void;
    getVideoData(): VideoData;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): PlayerState;
    destroy(): void;
  }
}

interface Window {
  YT?: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
}
