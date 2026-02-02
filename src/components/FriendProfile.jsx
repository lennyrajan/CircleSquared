import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Baby, Dog, Utensils, Coffee, DollarSign, Calendar, MapPin, Tag, MessageSquare, Clock, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function FriendProfile({ friend, isOpen, onClose, onLogInteraction }) {
    if (!friend) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        try {
            return format(parseISO(dateStr), 'MMM do');
        } catch {
            return dateStr;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={onClose} />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="side-panel glass-card"
                    >
                        <div className="panel-header">
                            <div className="panel-title-area">
                                <div className="profile-avatar large">
                                    {friend.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h2>{friend.name}</h2>
                                    <span className="relationship-tag">{friend.category}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="icon-btn"><X /></button>
                        </div>

                        <div className="panel-content">
                            <div className="action-bar">
                                <button className="log-btn primary" onClick={() => onLogInteraction(friend.id)}>
                                    <Clock size={16} /> Log Interaction
                                </button>
                            </div>

                            <section className="profile-section">
                                <h3><Info size={16} /> Context</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Nickname</label>
                                        <p>{friend.nickname || 'None'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>How we met</label>
                                        <p>{friend.howMet || 'Not recorded'}</p>
                                    </div>
                                </div>
                            </section>

                            <section className="profile-section">
                                <h3><Heart size={16} /> Family</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Partner</label>
                                        <p>{friend.partnerName || 'None'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Anniversary</label>
                                        <p>{formatDate(friend.anniversary)}</p>
                                    </div>
                                </div>
                                {friend.kids?.length > 0 && (
                                    <div className="sub-section">
                                        <label>Kids</label>
                                        {friend.kids.map((kid, i) => (
                                            <div key={i} className="meta-item">
                                                <Baby size={12} /> {kid.name} ({formatDate(kid.birthday)})
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {friend.pets?.length > 0 && (
                                    <div className="sub-section">
                                        <label>Pets</label>
                                        {friend.pets.map((pet, i) => (
                                            <div key={i} className="meta-item">
                                                <Dog size={12} /> {pet.name} {pet.type ? `(${pet.type})` : ''}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="profile-section">
                                <h3><Utensils size={16} /> Lifestyle</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Food</label>
                                        <div className="chip-cloud small">
                                            {friend.foodPrefs?.length > 0 ? friend.foodPrefs.map(p => <span key={p} className="chip static">{p}</span>) : <p>No dietary notes</p>}
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <label>Drinks</label>
                                        <p>{friend.drinkPrefs || 'Not recorded'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Budget</label>
                                        <p>{friend.budget || 'Medium'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Activities</label>
                                        <p>{friend.activityPrefs || 'Not recorded'}</p>
                                    </div>
                                </div>
                            </section>

                            <section className="profile-section">
                                <h3><Calendar size={16} /> Key Dates</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Birthday</label>
                                        <p>{formatDate(friend.birthday)}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Partner Birthday</label>
                                        <p>{formatDate(friend.partnerBirthday)}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

