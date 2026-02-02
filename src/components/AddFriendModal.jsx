import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Award } from 'lucide-react';
import { CADENCES, RELATIONSHIP_LEVELS } from '../utils/socialHealth';

export function AddFriendModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        level: 'middle',
        cadence: 30,
        tags: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: Date.now().toString(),
            lastInteraction: new Date().toISOString(),
            interactions: []
        });
        setFormData({ name: '', level: 'middle', cadence: 30, tags: '' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="modal-content glass-card"
                    >
                        <div className="modal-header">
                            <h2>Add to your Circle</h2>
                            <button onClick={onClose} className="icon-btn"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><User size={16} /> Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Friend's name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label><Award size={16} /> Relationship</label>
                                <div className="segmented-control">
                                    {Object.values(RELATIONSHIP_LEVELS).map(level => (
                                        <button
                                            key={level.id}
                                            type="button"
                                            className={formData.level === level.id ? 'active' : ''}
                                            onClick={() => setFormData({ ...formData, level: level.id })}
                                        >
                                            {level.label.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label><Calendar size={16} /> Check-in Cadence</label>
                                <select
                                    value={formData.cadence}
                                    onChange={(e) => setFormData({ ...formData, cadence: parseInt(e.target.value) })}
                                >
                                    {Object.values(CADENCES).map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="submit-btn">Add Friend</button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
