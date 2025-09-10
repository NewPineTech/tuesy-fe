'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Send, Square, Volume2, VolumeX, Settings, AudioWaveform as Waveform, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentConfig, Scope } from '@/lib/types';
import { defaultAgent } from '@/lib/mock-data';

interface MobileVoiceComposerProps {
  onSendMessage: (message: string, config?: AgentConfig) => void;
  isStreaming?: boolean;
  agentConfig?: AgentConfig;
  onConfigChange?: (config: AgentConfig) => void;
}

export function MobileVoiceComposer({ 
  onSendMessage, 
  isStreaming = false,
  agentConfig: externalConfig,
  onConfigChange 
}: MobileVoiceComposerProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [internalConfig, setInternalConfig] = useState<AgentConfig>(defaultAgent);
  const [showConfig, setShowConfig] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  
  const agentConfig = externalConfig || internalConfig;
  const setAgentConfig = onConfigChange || setInternalConfig;

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
      onSendMessage(message);
      setMessage('');
      setTranscript('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
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
      {/* Text Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn... (Ctrl+Enter để gửi)"
            className="min-h-[100px] py-4 px-4 resize-none border-2 border-zinc-600 focus:border-zinc-500"
            disabled={isStreaming}
          />
          
          {/* Bottom Left - Attachment-style controls inside textarea */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* Knowledge level selector */}
            <Select
              value={agentConfig.knowledgeLevel || 'basic'}
              onValueChange={(value) => 
                setAgentConfig({ ...agentConfig, knowledgeLevel: value as any })
              }
            >
              <SelectTrigger className="h-5 w-auto min-w-0 px-2 py-0 text-xs border border-zinc-500 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-md focus:ring-1 focus:ring-blue-500 leading-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="beginner" className="text-xs text-zinc-200 focus:bg-zinc-700">
                  Đại chúng
                </SelectItem>
                <SelectItem value="basic" className="text-xs text-zinc-200 focus:bg-zinc-700">
                  Sơ cơ
                </SelectItem>
                <SelectItem value="intermediate" className="text-xs text-zinc-200 focus:bg-zinc-700">
                  Trung cấp
                </SelectItem>
                <SelectItem value="advanced" className="text-xs text-zinc-200 focus:bg-zinc-700">
                  Cao cấp
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Citation toggle button */}
            <button
              type="button"
              onClick={() => setAgentConfig({ ...agentConfig, citations: !agentConfig.citations })}
              className={`h-8 px-2 py-0 text-xs rounded-md border transition-all focus:ring-1 focus:ring-blue-500 leading-none ${
                agentConfig.citations
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-zinc-700 text-zinc-200 border-zinc-500 hover:bg-zinc-600'
              }`}
            >
              Trích dẫn
            </button>
          </div>
          
          {/* Bottom Right Toolbar */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            {!message.trim() && (
              <>
                {/* Micro icon button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={startListening}
                  disabled={isStreaming}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                {/* Voice mode toggle button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={toggleVoiceMode}
                  disabled={isStreaming}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Popover open={showConfig} onOpenChange={setShowConfig}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Cấu hình Agent</h4>
                  
                  {/* Citations Toggle */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="citations" className="text-sm">
                      Hiển thị trích dẫn
                    </Label>
                    <Switch
                      id="citations"
                      checked={agentConfig.citations}
                      onCheckedChange={(checked) =>
                        setAgentConfig({ ...agentConfig, citations: checked })
                      }
                    />
                  </div>

                  {/* Scope Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm">Phạm vi tìm kiếm</Label>
                    <Select
                      value={agentConfig.scope}
                      onValueChange={(value: Scope) =>
                        setAgentConfig({ ...agentConfig, scope: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corpus">Chỉ cơ sở dữ liệu</SelectItem>
                        <SelectItem value="web-l1">Web cấp 1</SelectItem>
                        <SelectItem value="web-l2">Web cấp 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Nhiệt độ: {agentConfig.temperature}
                    </Label>
                    <Slider
                      value={[agentConfig.temperature]}
                      onValueChange={([value]) =>
                        setAgentConfig({ ...agentConfig, temperature: value })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Reset Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAgentConfig(defaultAgent)}
                    className="w-full gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Đặt lại mặc định
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {message.trim() && (
              <Button
                type="submit"
                size="sm"
                className="h-8 px-3"
                disabled={!message.trim() || isStreaming}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
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