import React, { useState } from 'react';
import { parseNaturalLanguageJob, ParsedJobRequirement } from '../utils/aiParser';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Sparkles, ArrowRight, X, Volume2, CheckCircle2 } from 'lucide-react';

interface AiVoiceJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedData: (data: ParsedJobRequirement) => void;
}

export const AiVoiceJobModal: React.FC<AiVoiceJobModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedData
}) => {
  const { showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedJobRequirement | null>(null);

  if (!isOpen) return null;

  const handleParse = (text: string) => {
    if (!text.trim()) return;
    const parsed = parseNaturalLanguageJob(text);
    setParsedResult(parsed);
  };

  const startVoiceInput = () => {
    // Check Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice recognition not supported in this browser. Please use text input or sample phrases.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('🎙️ Listening... Speak your job requirement now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleParse(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Voice capture interrupted. You can type or pick sample phrases.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      showToast('Voice service unavailable. Use text prompt below.');
    }
  };

  const samplePrompts = [
    'I need a carpenter in Vijayawada for three days paying 800 per day',
    'Urgent: 2 electricians needed in Guntur for commercial wiring 2 days 900/day',
    'House cleaner required in Vijayawada 600 per day morning hours',
    'Need a driver for Tata Ace commercial vehicle 18000 per month in Vijayawada'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#1e3a8a' }}>AI Voice & Text Job Form Auto-Fill</h3>
              <p style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>
                Speak naturally or paste your requirement in everyday language
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '6px', borderRadius: '50%', color: '#64748b', background: '#ffffff' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Voice & Prompt Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder='e.g. "I need 2 carpenters in Vijayawada for 3 days paying 800 per day"'
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  handleParse(e.target.value);
                }}
                style={{ flex: 1, padding: '12px 16px', fontSize: '1rem' }}
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className={isListening ? 'btn-call-now' : 'btn-primary'}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: isListening ? '#dc2626' : undefined
                }}
                title="Speak using microphone"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isListening ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>

            {/* Quick Sample Prompts */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                💡 Click a sample sentence to test AI extraction:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(p);
                      handleParse(p);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.85rem',
                      color: '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Parsed Structure Preview */}
          {parsedResult && (
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '16px',
              padding: '1.25rem',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="#16a34a" />
                  Structured Fields Extracted
                </div>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  Confidence {parsedResult.confidence}%
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Required Skill:</span>
                  <strong style={{ color: '#0f172a' }}>{parsedResult.requiredWorkerSkill}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Work Location:</span>
                  <strong style={{ color: '#0f172a' }}>{parsedResult.workLocation}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Duration:</span>
                  <strong style={{ color: '#0f172a' }}>{parsedResult.workDuration}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Payment:</span>
                  <strong style={{ color: '#16a34a', fontSize: '1rem' }}>
                    ₹{parsedResult.salaryAmount}/{parsedResult.salaryUnit}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Workers Needed:</span>
                  <strong style={{ color: '#0f172a' }}>{parsedResult.workersNeeded}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Experience:</span>
                  <strong style={{ color: '#0f172a' }}>{parsedResult.experienceRequiredYears}+ Years</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApplyParsedData(parsedResult)}
                className="btn-call-now"
                style={{ width: '100%', marginTop: '1rem', background: '#2563eb' }}
              >
                <span>Apply & Populate Job Posting Form</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
