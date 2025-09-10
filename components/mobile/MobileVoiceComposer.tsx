'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Send, Square, Volume2, VolumeX, Settings, AudioWaveform as Waveform } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentConfig } from '@/lib/types';

interface MobileVoiceComposerProps {
  onSendMessage: (message: string, config: AgentConfig) => void;
  isStreaming?: boolean;
  agentConfig: AgentConfig;
}

export function MobileVoiceComposer({ 
  onSendMessage, 
  isStreaming = false,
  agentConfig 
}: MobileVoiceComposerProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Mock speech recognition
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      
      // Setup audio visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);
      
      visualizeAudio();
      
      // Mock transcription after 3 seconds
      setTimeout(() => {
        const mockTranscripts = [
          'Xin Thầy giải thích về ý nghĩa của tâm bất sanh bất diệt?',
          'Làm thế nào để tu tập thiền trong đời sống hàng ngày?',
          'Phật giáo có những giáo lý gì về nghiệp báo?'
        ];
        const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        setTranscript(randomTranscript);
        setMessage(randomTranscript);
        stopListening();
      }, 3000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setAudioLevel(0);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255);
    
    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming) {
      onSendMessage(message, agentConfig);
      setMessage('');
      setTranscript('');
    }
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (voiceMode && isListening) {
      stopListening();
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (voiceMode) {
    return (
      <div className="border-t border-border bg-background p-4">
        {/* Voice Mode Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1">
              <Volume2 className="h-3 w-3" />
              Voice Mode
            </Badge>
            <Badge variant="outline" className="text-xs">
              Tiếng Việt
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoiceMode}
          >
            <VolumeX className="h-4 w-4" />
          </Button>
        </div>

        {/* Audio Visualization */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div 
              className={cn(
                "w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-200",
                isListening 
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20" 
                  : "border-muted bg-muted/10"
              )}
              style={{
                transform: isListening ? `scale(${1 + audioLevel * 0.3})` : 'scale(1)'
              }}
            >
              {isListening ? (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-green-500 rounded-full animate-pulse"
                      style={{
                        height: `${20 + Math.random() * audioLevel * 40}px`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Mic className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            
            {isListening && (
              <div className="absolute -inset-4 rounded-full border-2 border-green-500/30 animate-ping" />
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center mb-2">
            {isListening ? 'Đang nghe...' : 'Nhấn để nói chuyện với Thầy'}
          </p>

          {transcript && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4 max-w-full">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16"
            onClick={isListening ? stopListening : startListening}
            disabled={isStreaming}
          >
            {isListening ? (
              <Square className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          {message.trim() && (
            <Button
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={handleSubmit}
              disabled={isStreaming}
            >
              <Send className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Status */}
        {isStreaming && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
            Thầy đang phản hồi...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Text Mode Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {agentConfig.name}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {agentConfig.scope === 'corpus' ? 'Cơ sở dữ liệu' : 'Web'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoiceMode}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Text Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="min-h-[80px] pr-12 resize-none text-base"
            disabled={isStreaming}
          />
          
          <Button
            type="submit"
            size="sm"
            className="absolute bottom-2 right-2 h-8 w-8 p-0"
            disabled={!message.trim() || isStreaming}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Status */}
      {isStreaming && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
          Đang xử lý...
        </div>
      )}
    </div>
  );
}