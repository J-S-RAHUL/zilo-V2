import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CallModal } from './components/CallModal';
import { WorkerDetailModal } from './components/WorkerDetailModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';
import { AiVoiceJobModal } from './components/AiVoiceJobModal';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { FindWorkersView } from './views/FindWorkersView';
import { FindJobsView } from './views/FindJobsView';
import { PostJobView } from './views/PostJobView';
import { CreateWorkerView } from './views/CreateWorkerView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ParsedJobRequirement } from './utils/aiParser';
import {
  Home,
  Users,
  Briefcase,
  PlusCircle,
  UserCheck,
  LayoutDashboard,
  Shield,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView, toastMessage, currentUser, isAuthModalOpen, closeAuthModal } = useApp();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [parsedAiJob, setParsedAiJob] = useState<ParsedJobRequirement | null>(null);

  const handleApplyAiData = (data: ParsedJobRequirement) => {
    setParsedAiJob(data);
    setIsAiModalOpen(false);
    setCurrentView('post-job');
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="main-content">
        {currentView === 'home' && (
          <HomeView onOpenAiModal={() => setIsAiModalOpen(true)} />
        )}
        {currentView === 'find-workers' && <FindWorkersView />}
        {currentView === 'find-jobs' && <FindJobsView />}
        {currentView === 'post-job' && (
          <PostJobView
            onOpenAiModal={() => setIsAiModalOpen(true)}
            parsedAiData={parsedAiJob}
            onClearParsedAiData={() => setParsedAiJob(null)}
          />
        )}
        {currentView === 'create-worker' && <CreateWorkerView />}
        {currentView === 'dashboard' && <UserDashboardView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Floating Action Button for AI Job Assistant (Desktop & Mobile) */}
      <div style={{
        position: 'fixed',
        bottom: '84px',
        right: '20px',
        zIndex: 35
      }}>
        <button
          onClick={() => setIsAiModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.9rem',
            padding: '12px 18px',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            border: '2px solid rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Speak or dictate job requirement to AI"
        >
          <Sparkles size={18} />
          <span>AI Job Assistant</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`bottom-nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          className={`bottom-nav-item ${currentView === 'find-workers' ? 'active' : ''}`}
          onClick={() => setCurrentView('find-workers')}
        >
          <Users size={20} />
          <span>Find Work</span>
        </button>

        <button
          className={`bottom-nav-item ${currentView === 'find-jobs' ? 'active' : ''}`}
          onClick={() => setCurrentView('find-jobs')}
        >
          <Briefcase size={20} />
          <span>Jobs</span>
        </button>

        <button
          className={`bottom-nav-item ${currentView === 'post-job' ? 'active' : ''}`}
          onClick={() => setCurrentView('post-job')}
        >
          <PlusCircle size={20} />
          <span>Post Job</span>
        </button>

        <button
          className={`bottom-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
      </nav>

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: 'white',
        padding: '3rem 1.25rem 5rem',
        borderTop: '1px solid #1e293b'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#2563eb',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900
              }}>
                Z
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>ZILO</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Direct worker-to-employer connection platform. No middlemen, no approval queues, no hiring commissions.
              View verified phone numbers and call directly.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: '#f1f5f9' }}>
              For Employers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <li>
                <button onClick={() => setCurrentView('find-workers')} style={{ color: '#94a3b8' }}>
                  🔍 Find Skilled Workers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('post-job')} style={{ color: '#94a3b8' }}>
                  ➕ Post Worker Requirement
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} style={{ color: '#94a3b8' }}>
                  📊 Manage Posted Requirements
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: '#f1f5f9' }}>
              For Workers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <li>
                <button onClick={() => setCurrentView('find-jobs')} style={{ color: '#94a3b8' }}>
                  💼 Browse Daily & Monthly Work
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('create-worker')} style={{ color: '#94a3b8' }}>
                  👤 Publish Worker Profile
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} style={{ color: '#94a3b8' }}>
                  🟢 Toggle Working Availability
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: '#f1f5f9' }}>
              Direct Contact Promise
            </h4>
            <div style={{
              background: '#1e293b',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              lineHeight: 1.5
            }}>
              📞 <strong>100% Direct Phone:</strong> Call now button dials phone instantly on mobile. Zero platform commission on payments.
            </div>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setCurrentView('admin')}
                style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Shield size={14} /> Platform Moderation Panel
              </button>
            </div>
          </div>
        </div>

        <div className="container" style={{
          marginTop: '2.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #1e293b',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          © {new Date().getFullYear()} Zilo Platform. Built for direct employer-worker connections.
        </div>
      </footer>

      {/* Global Modals */}
      <CallModal />
      <WorkerDetailModal />
      <JobDetailModal />
      <ReviewModal />
      <ReportModal />
      <AiVoiceJobModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyParsedData={handleApplyAiData}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />

      {/* Reactive Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <PhoneCall size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
