import { useEffect, useRef, useState, useCallback, useId } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

type UseYouTubePlayerProps = {
  videoId: string;
  isActive: boolean;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onError?: (error: any) => void;
};

export const useYouTubePlayer = ({
  videoId,
  isActive,
  onReady,
  onStateChange,
  onError,
}: UseYouTubePlayerProps) => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [playerStatus, setPlayerStatus] = useState<'idle' | 'creating' | 'ready' | 'error'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const containerId = useId();

  const onReadyRef = useRef(onReady);
  const onStateChangeRef = useRef(onStateChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onReadyRef.current = onReady;
    onStateChangeRef.current = onStateChange;
    onErrorRef.current = onError;
  }, [onReady, onStateChange, onError]);

  // Загрузка YouTube IFrame API (один раз)
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiStatus('loaded');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => setApiStatus('error');
    document.body.appendChild(script);

    const originalCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      setApiStatus('loaded');
      if (originalCallback) originalCallback();
    };

    return () => {};
  }, []);

  // Создание плеера
  useEffect(() => {
    if (!isActive || !videoId || apiStatus !== 'loaded') return;
    if (playerRef.current) return; 

    setPlayerStatus('creating');

    const onPlayerReady = () => {
      if (!isActive) return;
      setPlayerStatus('ready');
      onReadyRef.current?.();
    };

    const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
      if (!isActive) return;
      const playing = event.data === window.YT.PlayerState.PLAYING;
      setIsPlaying(playing);
      onStateChangeRef.current?.(event.data);
    };

    const onPlayerError = (event: YT.OnErrorEvent) => {
      if (!isActive) return;
      setPlayerStatus('error');
      onErrorRef.current?.(event);
    };

    try {
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          controls: 0,
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
    } catch (error) {
      setPlayerStatus('error');
      onErrorRef.current?.(error);
    }

    return () => {
      // Не вызываем destroy() — React сам удалит контейнер при размонтировании.
      playerRef.current = null;
      setPlayerStatus('idle');
      setIsPlaying(false);
    };
  }, [isActive, videoId, apiStatus, containerId]);

  const play = useCallback(() => {
    if (playerRef.current && isActive) {
      playerRef.current.playVideo();
    }
  }, [isActive]);

  const pause = useCallback(() => {
    if (playerRef.current && isActive) {
      playerRef.current.pauseVideo();
    }
  }, [isActive]);

  const toggle = useCallback(() => {
    if (playerRef.current && isActive) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  }, [isActive, isPlaying]);

  return {
    containerId,
    apiStatus,
    playerStatus,
    isPlaying,
    play,
    pause,
    toggle,
  };
};