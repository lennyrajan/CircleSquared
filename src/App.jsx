import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Heart, AlertCircle, Calendar, MessageSquare, ChevronRight, Settings } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CircleViz } from './components/CircleViz';
import { AddFriendModal } from './components/AddFriendModal';
import { getSocialHealthScore } from './utils/socialHealth';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useLocalStorage('cs_onboarded', false);
  const [friends, setFriends] = useLocalStorage('cs_friends', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddFriend = (newFriend) => {
    setFriends([...friends, newFriend]);
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="logo-container"
        >
          <div className="logo-icon">Circle<sup>2</sup></div>
        </motion.div>
      </div>
    );
  }

  const healthScore = getSocialHealthScore(friends);

  return (
    <div className="app-container bg-gradient">
      <main>
        {!onboarded && (
          <section className="onboarding">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-card"
            >
              <h1 className="brand-title">Circle<sup>2</sup></h1>
              <p className="tagline">Your circle, elevated.</p>

              <div className="welcome-content">
                <h2>Strengthen your circle.</h2>
                <p>Never lose touch with the people who matter most. Circle Squared helps you track interactions and reminds you to stay connected.</p>
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
            <header>
              <h2 className="section-title">Social Health</h2>
              <div className="header-actions">
                <div className="health-badge">
                  <Heart size={14} fill={healthScore > 70 ? 'var(--color-teal)' : 'var(--color-amber)'} />
                  {healthScore}%
                </div>
                <button className="icon-btn"><Settings size={20} /></button>
              </div>
            </header>

            <CircleViz friends={friends} />

            {friends.length === 0 ? (
              <div className="empty-state glass-card">
                <Users size={48} className="empty-icon" />
                <h3>Your circle is empty</h3>
                <p>Add your first 3 friends to start tracking your social health.</p>
                <button className="cta-btn" onClick={() => setIsAddModalOpen(true)}>
                  <Plus size={20} /> Add Friends
                </button>
              </div>
            ) : (
              <div className="quick-actions glass-card">
                <div className="section-header">
                  <h3>Your Circle</h3>
                  <button className="add-small-btn" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="friend-list-mini">
                  {friends.map(friend => (
                    <div key={friend.id} className="friend-item-mini">
                      <div className="friend-avatar-mini">{friend.name.charAt(0)}</div>
                      <div className="friend-info-mini">
                        <span className="friend-name">{friend.name}</span>
                        <span className="friend-level-tag">{friend.level}</span>
                      </div>
                      <button className="log-btn">Log</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AddFriendModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddFriend}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
