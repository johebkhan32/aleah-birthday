import { useEffect, useRef, useCallback } from 'react';

interface AudioDetectionOptions {
  threshold?: number;
  onBlow?: () => void;
  enabled?: boolean;
}

export function useAudioDetection({
  threshold = 50,
  onBlow,
  enabled = false,
}: AudioDetectionOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startAudioDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectBlow = () => {
        if (!enabled || !analyser) return;

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (volume > threshold) {
          onBlow?.();
        }

        animationFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [threshold, onBlow, enabled]);

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
