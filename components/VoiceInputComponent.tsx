/**
 * VOICE INPUT COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - JWT token management via getAccessToken()
 * - Secure voice assessment with proper authentication
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';

interface VoiceInputComponentProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  placeholder: string;
  existingInput?: {
    voice_transcript: string;
    text_fallback?: string;
    input_method: 'voice' | 'text';
    audio_duration?: number;
    gpt_feedback?: string;
    gpt_score?: number;
    gpt_ideal_answer?: string;
    created_at?: string;
    updated_at?: string;
  } | null;
  onSave: (
    caseId: string,
    stepNumber: number,
    voiceTranscript: string,
    textFallback?: string,
    inputMethod?: 'voice' | 'text',
    audioDuration?: number,
  ) => Promise<void>;
  isSaving: boolean;
}

export default function VoiceInputComponent({
  caseId,
  stepNumber,
  stepName,
  placeholder = 'Sprechen Sie Ihre Empfehlung ein oder geben Sie sie als Text ein...',
  existingInput,
  onSave,
  isSaving = false,
}: VoiceInputComponentProps) {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, getAccessToken, isAuthenticated } = useAuth();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(existingInput?.voice_transcript || '');
  const [textFallback, setTextFallback] = useState(existingInput?.text_fallback || '');
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>(
    existingInput?.input_method || 'text',
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRequestingAssessment, setIsRequestingAssessment] = useState(false);
  // const [showFeedback, setShowFeedback] = useState(false); // unused
  const [isSupported, setIsSupported] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const recognitionRef = useRef<any>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'de-DE';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let _interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            _interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
          setInputMethod('voice');
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  // Update local state when existingInput changes
  useEffect(() => {
    if (existingInput) {
      setTranscript(existingInput.voice_transcript || '');
      setTextFallback(existingInput.text_fallback || '');
      setInputMethod(existingInput.input_method || 'text');
      setHasChanges(false);
    }
  }, [existingInput]);

  // Track changes
  useEffect(() => {
    const transcriptChanged = transcript !== (existingInput?.voice_transcript || '');
    const fallbackChanged = textFallback !== (existingInput?.text_fallback || '');
    setHasChanges(transcriptChanged || fallbackChanged);
  }, [transcript, textFallback, existingInput]);

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) {
      alert(
        'Spracherkennung wird in diesem Browser nicht unterstützt. Bitte verwenden Sie die Texteingabe.',
      );
      return;
    }

    setIsRecording(true);
    setRecordingTime(0);
    recognitionRef.current.start();

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInputMethod('text');
  };

  const handleSave = async () => {
    const mainContent = inputMethod === 'voice' ? transcript : textFallback;
    const fallback = inputMethod === 'voice' ? textFallback : undefined;

    if (!mainContent.trim()) {
      alert('Bitte geben Sie Ihre Empfehlung ein (per Sprache oder Text).');
      return;
    }

    try {
      await onSave(
        caseId,
        stepNumber,
        transcript.trim(),
        fallback?.trim(),
        inputMethod,
        recordingTime,
      );
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving voice input:', error);
      alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    }
  };

  const handleReset = () => {
    setTranscript(existingInput?.voice_transcript || '');
    setTextFallback(existingInput?.text_fallback || '');
    setInputMethod(existingInput?.input_method || 'text');
    setHasChanges(false);
    setMessage(null);
  };

  const handleRequestAssessment = async () => {
    if (!transcript.trim()) {
      setMessage({ type: 'error', text: 'Bitte geben Sie zuerst eine Antwort ein.' });
      return;
    }

    try {
      setIsRequestingAssessment(true);
      setMessage(null);

      console.log(`🎤🤖 Requesting GPT assessment for voice input`);

      // Use navaa Auth Guidelines - check authentication
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated for voice assessment');
        throw new Error('Benutzer nicht authentifiziert');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for voice assessment');
        throw new Error('Authentifizierungsfehler. Bitte erneut einloggen.');
      }

      // Call assessment API
      const response = await fetch('/api/admin/assess-voice-input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
        },
        body: JSON.stringify({
          caseId,
          stepNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Assessment failed');
      }

      console.log('✅ GPT assessment completed');

      setMessage({
        type: 'success',
        text: `✅ Bewertung abgeschlossen! Score: ${result.data.assessment.score}/10`,
      });

      // Show feedback section
      // Feedback UI currently disabled

      // Trigger reload of data in parent component
      window.location.reload();
    } catch (error: any) {
      console.error('💥 Error requesting assessment:', error);
      setMessage({ type: 'error', text: `Fehler bei der Bewertung: ${error.message}` });
    } finally {
      setIsRequestingAssessment(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🎤 Spracheingabe - Schritt {stepNumber}: {stepName}
        </h3>
        {existingInput && (
          <span className="text-sm text-gray-500">
            Gespeichert:{' '}
            {new Date(existingInput.updated_at || existingInput.created_at || '').toLocaleString(
              'de-DE',
            )}
            {existingInput.input_method === 'voice' && ` (🎤 Sprache)`}
            {existingInput.input_method === 'text' && ` (📝 Text)`}
          </span>
        )}
      </div>

      {/* Voice Recording Section */}
      {isSupported ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-700">🎤 Spracheingabe</h4>
            {isRecording && (
              <div className="flex items-center text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">
                  Aufnahme läuft... {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mb-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2"
              >
                🎤 Aufnahme starten
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium flex items-center gap-2"
              >
                ⏹️ Aufnahme stoppen
              </button>
            )}

            {transcript && (
              <button
                onClick={clearTranscript}
                disabled={isSaving || isRecording}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
              >
                🗑️ Löschen
              </button>
            )}
          </div>

          {/* Voice Transcript Display */}
          {transcript && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">🎤</span>
                <span className="font-medium text-blue-800">Gesprochener Text:</span>
              </div>
              <p className="text-gray-800 leading-relaxed">{transcript}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-sm text-yellow-700">
              Spracherkennung wird in diesem Browser nicht unterstützt. Bitte verwenden Sie die
              Texteingabe.
            </span>
          </div>
        </div>
      )}

      {/* Text Fallback Section */}
      <div className="mb-4">
        <label
          htmlFor={`voice-text-${stepNumber}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          📝 Texteingabe {isSupported ? '(Fallback oder Alternative)' : ''}:
        </label>
        <textarea
          id={`voice-text-${stepNumber}`}
          value={textFallback}
          onChange={(e) => {
            setTextFallback(e.target.value);
            if (!transcript) setInputMethod('text');
          }}
          placeholder={placeholder}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          disabled={isSaving}
        />
        <div className="text-right text-sm text-gray-500 mt-1">{textFallback.length} Zeichen</div>
      </div>

      {/* Input Method Selection */}
      {transcript && textFallback && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700 mr-3">Haupteingabe:</span>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              value="voice"
              checked={inputMethod === 'voice'}
              onChange={(e) => setInputMethod(e.target.value as 'voice' | 'text')}
              className="mr-2"
            />
            🎤 Sprache
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="text"
              checked={inputMethod === 'text'}
              onChange={(e) => setInputMethod(e.target.value as 'voice' | 'text')}
              className="mr-2"
            />
            📝 Text
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`px-4 py-2 rounded-md font-medium ${
            !hasChanges || isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSaving ? '💾 Speichern...' : '💾 Speichern'}
        </button>

        <button
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className={`px-4 py-2 rounded-md font-medium ${
            !hasChanges || isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          🔄 Zurücksetzen
        </button>

        {/* GPT Assessment Button - REUSING same pattern as FreeTextWithFeedbackComponent */}
        {existingInput && transcript.trim() && (
          <button
            onClick={handleRequestAssessment}
            disabled={isRequestingAssessment}
            className={`px-4 py-2 rounded-md font-medium ${
              isRequestingAssessment
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRequestingAssessment ? '🤖 Bewerte...' : '🤖 GPT-Bewertung'}
          </button>
        )}
      </div>

      {/* Status Display */}
      {existingInput && !hasChanges && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-sm text-green-700">
              Empfehlung gespeichert (
              {existingInput.input_method === 'voice' ? 'per Sprache' : 'per Text'})
              {existingInput.audio_duration && ` - ${formatTime(existingInput.audio_duration)}`}
            </span>
          </div>
        </div>
      )}

      {hasChanges && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2"></span>
            <span className="text-sm text-yellow-700">Ungespeicherte nderungen</span>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* GPT Feedback Display - REUSING same pattern as FreeTextWithFeedbackComponent */}
      {existingInput?.gpt_feedback && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">GPT-Bewertung & Feedback</h4>

          {/* Score Display */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Bewertung:</span>
              <div
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  (existingInput.gpt_score || 0) >= 8
                    ? 'bg-green-100 text-green-800'
                    : (existingInput.gpt_score || 0) >= 6
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {existingInput.gpt_score}/10 Punkte
              </div>
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2"> Detailliertes Feedback:</h5>
            <div className="bg-blue-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
              {existingInput.gpt_feedback}
            </div>
          </div>

          {/* Ideal Answer */}
          {existingInput.gpt_ideal_answer && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2"> Idealtypische Antwort:</h5>
              <div className="bg-green-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                {existingInput.gpt_ideal_answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
