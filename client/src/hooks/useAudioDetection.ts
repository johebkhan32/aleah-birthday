import { useEffect, useRef, useCallback } from 'react';

interface AudioDetectionOptions {
  threshold?: number;
  onBlow?: () => void;
  enabled?: boolean;
  /** Number of consecutive frames above threshold required to trigger a blow */
  sustainedFrames?: number;
  /** Grace period in ms after starting detection before blow can trigger (avoids false positives from mic settling) */
  gracePeriodMs?: number;
}

export function useAudioDetection({
  threshold = 130,
  onBlow,
  enabled = false,
  sustainedFrames = 8,
  gracePeriodMs = 1500,
}: AudioDetectionOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Use refs for callback and enabled state to avoid stale closures
  const onBlowRef = useRef(onBlow);
  const enabledRef = useRef(enabled);
  const consecutiveFramesRef = useRef(0);
  const hasTriggeredRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Keep refs in sync
  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const startAudioDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Reset state
      consecutiveFramesRef.current = 0;
      hasTriggeredRef.current = false;
      startTimeRef.current = Date.now();

      const detectBlow = () => {
        if (!enabledRef.current || !analyser || hasTriggeredRef.current) return;

        analyser.getByteFrequencyData(dataArray);

        // Focus on low-frequency bins (typical of blowing sounds)
        // Blowing produces strong low-frequency energy
        const lowFreqBins = dataArray.slice(0, 20);
        const lowFreqVolume = lowFreqBins.reduce((a, b) => a + b, 0) / lowFreqBins.length;

        // Also check overall volume
        const overallVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        // Check grace period
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < gracePeriodMs) {
          animationFrameRef.current = requestAnimationFrame(detectBlow);
          return;
        }

        // Blow detection: requires strong low-frequency content AND high overall volume
        // This helps distinguish a real blow from music (which has more balanced frequency content)
        const isBlowLike = lowFreqVolume > threshold && overallVolume > (threshold * 0.6);

        if (isBlowLike) {
          consecutiveFramesRef.current++;

          if (consecutiveFramesRef.current >= sustainedFrames) {
            hasTriggeredRef.current = true;
            onBlowRef.current?.();
            return;
          }
        } else {
          // Reset consecutive counter if volume drops below threshold
          consecutiveFramesRef.current = Math.max(0, consecutiveFramesRef.current - 2);
        }

        animationFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [threshold, gracePeriodMs, sustainedFrames]);

  const stopAudioDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    consecutiveFramesRef.current = 0;
    hasTriggeredRef.current = false;
  }, []);

  useEffect(() => {
    if (enabled) {
      startAudioDetection();
    } else {
      stopAudioDetection();
    }

    return () => {
      stopAudioDetection();
    };
  }, [enabled, startAudioDetection, stopAudioDetection]);

  return { startAudioDetection, stopAudioDetection };
}
