import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Baby, Dog, Utensils, Coffee, DollarSign, Calendar, Info, MapPin } from 'lucide-react';
import { CADENCES, RELATIONSHIP_LEVELS, RELATIONSHIP_CATEGORIES, FOOD_PREFERENCES, BUDGET_PREFERENCES } from '../utils/socialHealth';

export function AddFriendModal({ isOpen, onClose, onAdd }) {
    const [activeTab, setActiveTab] = useState('core');
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        level: 'secondary',
        cadence: 30,
        category: 'Good Friend',
        howMet: '',
        birthday: '',

        // Family
        partnerName: '',
        partnerBirthday: '',
        anniversary: '',
        kids: [], // { name, birthday }
        pets: [], // { name, type, birthday }

        // Lifestyle
        foodPrefs: [],
        drinkPrefs: '',
        budget: 'Medium',
        activityPrefs: '',

        tags: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: Date.now().toString(),
            lastInteraction: new Date().toISOString(),
            interactions: [],
            notesCount: formData.notes ? 1 : 0
        });
        // Reset after add
        setActiveTab('core');
    };

    const addKid = () => setFormData({ ...formData, kids: [...formData.kids, { name: '', birthday: '' }] });
    const updateKid = (index, field, value) => {
        const newKids = [...formData.kids];
        newKids[index][field] = value;
        setFormData({ ...formData, kids: newKids });
    };

    const addPet = () => setFormData({ ...formData, pets: [...formData.pets, { name: '', type: '', birthday: '' }] });
    const updatePet = (index, field, value) => {
        const newPets = [...formData.pets];
        newPets[index][field] = value;
        setFormData({ ...formData, pets: newPets });
    };

    const toggleFoodPref = (pref) => {
        const newPrefs = formData.foodPrefs.includes(pref)
            ? formData.foodPrefs.filter(p => p !== pref)
            : [...formData.foodPrefs, pref];
        setFormData({ ...formData, foodPrefs: newPrefs });
    };

    const tabs = [
        { id: 'core', label: 'Core', icon: <User size={16} /> },
        { id: 'context', label: 'Context', icon: <Info size={16} /> },
        { id: 'family', label: 'Family', icon: <Heart size={16} /> },
        { id: 'lifestyle', label: 'Lifestyle', icon: <Utensils size={16} /> }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={onClose} />
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        className="modal-content expanded-modal glass-card"
                    >
                        <div className="modal-header">
                            <h2>Add Relationship Intelligence</h2>
                            <button onClick={onClose} className="icon-btn"><X /></button>
                        </div>

                        <div className="modal-tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="expanded-form">
                            <div className="tab-container">
                                {activeTab === 'core' && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" required />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group flex-1">
                                                <label>Tier</label>
                                                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                                                    {Object.values(RELATIONSHIP_LEVELS).map(l => <option key={l.id} value={l.id}>{l.label.split(' ')[0]}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group flex-1">
                                                <label>Cadence</label>
                                                <select value={formData.cadence} onChange={(e) => setFormData({ ...formData, cadence: parseInt(e.target.value) })}>
                                                    {Object.values(CADENCES).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Birthday</label>
                                            <input type="date" value={formData.birthday} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'context' && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <div className="form-group">
                                            <label>Nickname / Pronouns</label>
                                            <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} placeholder="e.g. Johnny / He,Him" />
                                        </div>
                                        <div className="form-group">
                                            <label>Relationship Category</label>
                                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                                {RELATIONSHIP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>How you met</label>
                                            <textarea value={formData.howMet} onChange={(e) => setFormData({ ...formData, howMet: e.target.value })} placeholder="Story behind the connection..." rows="3" />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'family' && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="scroll-area">
                                        <div className="form-group">
                                            <label>Partner Name</label>
                                            <input type="text" value={formData.partnerName} onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })} placeholder="Spouse/Partner" />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group flex-1">
                                                <label>Partner Birthday</label>
                                                <input type="date" value={formData.partnerBirthday} onChange={(e) => setFormData({ ...formData, partnerBirthday: e.target.value })} />
                                            </div>
                                            <div className="form-group flex-1">
                                                <label>Anniversary</label>
                                                <input type="date" value={formData.anniversary} onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <label className="section-label"><Baby size={14} /> Kids</label>
                                            {formData.kids.map((kid, i) => (
                                                <div key={i} className="form-row nested-row">
                                                    <input type="text" value={kid.name} onChange={(e) => updateKid(i, 'name', e.target.value)} placeholder="Name" />
                                                    <input type="date" value={kid.birthday} onChange={(e) => updateKid(i, 'birthday', e.target.value)} />
                                                </div>
                                            ))}
                                            <button type="button" onClick={addKid} className="add-nested-btn">+ Add Kid</button>
                                        </div>

                                        <div className="form-section">
                                            <label className="section-label"><Dog size={14} /> Pets</label>
                                            {formData.pets.map((pet, i) => (
                                                <div key={i} className="form-row nested-row">
                                                    <input type="text" value={pet.name} onChange={(e) => updatePet(i, 'name', e.target.value)} placeholder="Name" />
                                                    <input type="text" value={pet.type} onChange={(e) => updatePet(i, 'type', e.target.value)} placeholder="Type (Dog, Cat...)" />
                                                </div>
                                            ))}
                                            <button type="button" onClick={addPet} className="add-nested-btn">+ Add Pet</button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'lifestyle' && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <div className="form-group">
                                            <label>Food Preferences / Allergies</label>
                                            <div className="chip-cloud">
                                                {FOOD_PREFERENCES.map(pref => (
                                                    <button key={pref} type="button" className={`chip ${formData.foodPrefs.includes(pref) ? 'active' : ''}`} onClick={() => toggleFoodPref(pref)}>{pref}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Drink Preferences</label>
                                            <input type="text" value={formData.drinkPrefs} onChange={(e) => setFormData({ ...formData, drinkPrefs: e.target.value })} placeholder="Coffee, Tea, Wine..." />
                                        </div>
                                        <div className="form-group">
                                            <label>Budget Preference</label>
                                            <div className="segmented-control">
                                                {BUDGET_PREFERENCES.map(b => (
                                                    <button key={b} type="button" className={formData.budget === b ? 'active' : ''} onClick={() => setFormData({ ...formData, budget: b })}>{b}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Activity Preferences</label>
                                            <input type="text" value={formData.activityPrefs} onChange={(e) => setFormData({ ...formData, activityPrefs: e.target.value })} placeholder="Hiking, Board games, Movies..." />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="submit-btn primary-btn">Build Intelligence</button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
