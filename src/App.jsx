import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Heart, AlertCircle, Calendar, MessageSquare, ChevronRight, Settings, Info, Gift } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CircleViz } from './components/CircleViz';
import { AddFriendModal } from './components/AddFriendModal';
import { FriendProfile } from './components/FriendProfile';
import { SettingsModal } from './components/SettingsModal';
import { getSocialHealthScore, getUpcomingEvents } from './utils/socialHealth';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useLocalStorage('cs_onboarded', false);
  const [friends, setFriends] = useLocalStorage('cs_friends', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [showHealthMessage, setShowHealthMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddFriend = (newFriend) => {
    setFriends([...friends, newFriend]);
    setIsAddModalOpen(false);
  };

  const handleLogInteraction = (friendId) => {
    const updatedFriends = friends.map(f => {
      if (f.id === friendId) {
        return {
          ...f,
          lastInteraction: new Date().toISOString(),
          interactions: [...(f.interactions || []), { date: new Date().toISOString() }]
        };
      }
      return f;
    });
    setFriends(updatedFriends);
  };

  const handleImportData = (newFriends) => {
    setFriends(newFriends);
    setIsSettingsOpen(false);
  };

  const handleClearData = () => {
    setFriends([]);
    setOnboarded(false);
    localStorage.clear();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="logo-container">
          <div className="logo-icon">Circle<sup>2</sup></div>
        </motion.div>
      </div>
    );
  }

  const healthScore = getSocialHealthScore(friends);
  const upcomingEvents = getUpcomingEvents(friends).slice(0, 3);
  const selectedFriend = friends.find(f => f.id === selectedFriendId);

  return (
    <div className="app-container bg-gradient">
      <main>
        {!onboarded && (
          <section className="onboarding">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card">
              <h1 className="brand-title">Circle<sup>2</sup></h1>
              <p className="tagline">Your circle, elevated.</p>
              <div className="welcome-content">
                <h2>Strengthen your circle.</h2>
                <p>Circle Squared is now a **Relationship Intelligence System**. Track family, food preferences, and key milestones to stay deeply connected.</p>
              </div>
              <div className="onboarding-actions">
                <button onClick={() => setOnboarded(true)} className="primary-btn">
                  Get Started <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </section>
        )}

        {onboarded && (
          <div className="dashboard-view">
            <header className="glass-header">
              <h1 className="section-title">Circle<sup>2</sup></h1>
              <div className="header-actions">
                <div className="health-badge-container" onMouseEnter={() => setShowHealthMessage(true)} onMouseLeave={() => setShowHealthMessage(false)}>
                  <div className="health-badge">
                    <Heart size={14} fill={healthScore > 70 ? 'var(--color-teal)' : 'var(--color-amber)'} />
                    <span>{healthScore}%</span>
                  </div>
                  <AnimatePresence>
                    {showHealthMessage && (
                      <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="health-overlay glass-card">
                        <h4>Social Vitality</h4>
                        <p>{healthScore > 80 ? 'Excellent! Your circles are flourishing.' : healthScore > 50 ? 'Good, but some connections are drifting.' : 'Time to reach out! Your social health needs attention.'}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button className="icon-btn add-trigger" onClick={() => setIsAddModalOpen(true)} title="Add Connection">
                  <Plus size={22} />
                </button>
                <button className="icon-btn settings-trigger" onClick={() => setIsSettingsOpen(true)} title="Settings">
                  <Settings size={22} />
                </button>
              </div>
            </header>

            <CircleViz friends={friends} />

            <div className="dashboard-grid">
              <div className="quick-actions glass-card">
                <div className="section-header">
                  <h3>Relationship Feed</h3>
                </div>
                {friends.length === 0 ? (
                  <div className="empty-state-mini">
                    <Users size={32} />
                    <p>Your circle is empty. Start by adding a key connection.</p>
                  </div>
                ) : (
                  <div className="friend-list-mini">
                    {friends.map(friend => (
                      <div key={friend.id} className="friend-item-mini clickable" onClick={() => setSelectedFriendId(friend.id)}>
                        <div className="friend-avatar-mini">
                          {friend.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="friend-info-mini">
                          <span className="friend-name">{friend.name}</span>
                          <span className="friend-level-tag">{friend.level}</span>
                        </div>
                        <button className="log-btn" onClick={(e) => { e.stopPropagation(); handleLogInteraction(friend.id); }}>Log</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="events-panel glass-card">
                <div className="section-header">
                  <h3>Upcoming Milestones</h3>
                </div>
                <div className="events-list">
                  {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                    <div key={i} className="event-item">
                      <div className="event-icon"><Gift size={16} /></div>
                      <div className="event-info">
                        <span className="event-label">{event.label}</span>
                        <span className="event-date">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="empty-events">
                      <Calendar size={24} />
                      <p>No upcoming milestones</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <AddFriendModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddFriend} />
            <FriendProfile friend={selectedFriend} isOpen={!!selectedFriendId} onClose={() => setSelectedFriendId(null)} onLogInteraction={handleLogInteraction} />
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              friends={friends}
              onImport={handleImportData}
              onClear={handleClearData}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
