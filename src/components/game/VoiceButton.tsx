import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Send } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';

export function VoiceButton() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcript = useGameStore((state) => state.transcript);
  const setTranscript = useGameStore((state) => state.setTranscript);
  const sendActionToBackend = useGameStore((state) => state.sendActionToBackend);
  const recognitionRef = useRef<any>(null);

  const handleStartListening = useCallback(async () => {
    try {
      // Check if Web Speech API is available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Voice input is not supported in your browser');
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const newTranscript = result[0].transcript;
        setTranscript(newTranscript);
        
        // If final result, automatically send to backend
        if (result.isFinal && newTranscript.trim()) {
          setTimeout(() => {
            handleSendAction(newTranscript);
          }, 500);
        }
      };

      recognition.onerror = (event) => {
        setError('Error listening: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setError('Could not start listening');
      setIsListening(false);
    }
  }, [setTranscript]);

  const handleStopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleSendAction = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      await sendActionToBackend(text);
      setTranscript(''); // Clear transcript after sending
    } catch (err) {
      setError('Failed to send action');
    }
  }, [sendActionToBackend, setTranscript]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-game flex flex-col items-center gap-4 py-6"
    >
      {/* Waveform Animation */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center gap-1 h-12"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-primary rounded-full waveform-bar"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Button */}
      <button
        onClick={isListening ? handleStopListening : handleStartListening}
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isListening 
            ? 'bg-danger voice-pulse' 
            : 'gradient-hero hover:brightness-110'
          }
          shadow-game
        `}
      >
        {isListening ? (
          <MicOff className="w-10 h-10 text-danger-foreground" />
        ) : (
          <Mic className="w-10 h-10 text-primary-foreground" />
        )}
      </button>

      {/* Label */}
      <p className="text-kid font-semibold text-muted-foreground">
        {isListening ? '🔴 Listening...' : '🎤 Press to Speak'}
      </p>

      {/* Transcript Display with Send Button */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 w-full max-w-md"
          >
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
              <Volume2 className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-kid text-foreground flex-1">{transcript}</p>
            </div>
            <Button
              onClick={() => handleSendAction(transcript)}
              size="icon"
              className="rounded-xl h-10 w-10"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </motion.div>
  );
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
