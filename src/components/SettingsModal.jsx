import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, Trash2, Shield, User, Bell, Palette, Database } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, friends, onImport, onClear }) {
    const [activeSection, setActiveSection] = useState('data');

    const exportData = () => {
        const data = {
            friends,
            exportDate: new Date().toISOString(),
            version: '1.2'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `circle-squared-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.friends && Array.isArray(data.friends)) {
                    if (confirm(`Found ${data.friends.length} friends. This will OVERWRITE your current data. Proceed?`)) {
                        onImport(data.friends);
                    }
                } else {
                    alert("Invalid backup file format.");
                }
            } catch (err) {
                alert("Error parsing file.");
            }
        };
        reader.readAsText(file);
    };

    const sections = [
        { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
        { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
        { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
        { id: 'display', label: 'Display', icon: <Palette size={18} /> }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={onClose} />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="modal-content glass-card settings-modal"
                    >
                        <div className="modal-header">
                            <h2>System Settings</h2>
                            <button onClick={onClose} className="icon-btn"><X /></button>
                        </div>

                        <div className="settings-layout">
                            <aside className="settings-sidebar">
                                {sections.map(s => (
                                    <button key={s.id} className={`sidebar-item ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
                                        <div className="sidebar-icon">{s.icon}</div>
                                        <span className="sidebar-label">{s.label}</span>
                                    </button>
                                ))}
                            </aside>

                            <div className="settings-main">
                                {activeSection === 'data' && (
                                    <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <div className="settings-section">
                                            <h3>Local Persistence</h3>
                                            <p>Your data is stored locally in your browser. Use these tools to manage your relationship intelligence.</p>

                                            <div className="settings-actions">
                                                <button className="settings-btn" onClick={exportData}>
                                                    <Download size={16} /> Export Backup (.json)
                                                </button>

                                                <label className="settings-btn btn-label">
                                                    <Upload size={16} /> Import Backup
                                                    <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="settings-section danger-zone">
                                            <h3>Danger Zone</h3>
                                            <p>Permanently erase all relationship data, notes, and milestones.</p>
                                            <button className="settings-btn destructive" onClick={onClear}>
                                                <Trash2 size={16} /> Factory Reset System
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeSection === 'profile' && (
                                    <div className="empty-settings">
                                        <User size={48} />
                                        <p>User profiling coming in Phase 2</p>
                                    </div>
                                )}

                                {activeSection === 'privacy' && (
                                    <div className="settings-section">
                                        <h3>Relationship Privacy</h3>
                                        <div className="setting-toggle">
                                            <span>Local-Only Mode</span>
                                            <div className="toggle active"></div>
                                        </div>
                                        <p className="hint">Inlocal-only mode, your data never leaves this device.</p>
                                    </div>
                                )}

                                {activeSection === 'display' && (
                                    <div className="settings-section">
                                        <h3>Aesthetics</h3>
                                        <p>Customize your intelligence dashboard.</p>
                                        <div className="theme-grid">
                                            <div className="theme-opt amber active"></div>
                                            <div className="theme-opt teal"></div>
                                            <div className="theme-opt charcoal"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
