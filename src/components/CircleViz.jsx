import { motion } from 'framer-motion';
import { RELATIONSHIP_LEVELS, calculateDrift } from '../utils/socialHealth';

export function CircleViz({ friends }) {
    // Categorize based on SRS 1.2 Tier Rules
    const getTier = (friend) => {
        const { daysSince } = calculateDrift(friend.lastInteraction, friend.cadence || 30);
        if (daysSince <= 30) return 'primary';
        if (daysSince <= 90) return 'secondary';
        return 'peripheral';
    };

    const categorizedFriends = friends.reduce((acc, friend) => {
        const tier = getTier(friend);
        acc[tier].push(friend);
        return acc;
    }, { primary: [], secondary: [], peripheral: [] });

    const renderFriendNodes = (friendsList, radius, tierKey) => {
        return friendsList.map((friend, index) => {
            const seed = parseInt(friend.id.slice(-4)) || index;
            const baseAngle = (index / (friendsList.length || 1)) * 2 * Math.PI;
            const angleOffset = ((seed % 20) - 10) * (Math.PI / 180);
            const angle = baseAngle + angleOffset;

            const jitter = (seed % 15) - 7;
            const x = Math.cos(angle) * (radius + jitter);
            const y = Math.sin(angle) * (radius + jitter);

            const { isDrifting } = calculateDrift(friend.lastInteraction, friend.cadence);
            const initials = friend.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

            return (
                <motion.g
                    key={friend.id}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x, y }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    className="friend-node-group"
                    onClick={(e) => { e.stopPropagation(); /* In App.jsx we handle selection */ }}
                >
                    <circle
                        r="16"
                        fill={isDrifting ? '#ff4d4d' : 'white'}
                        stroke={isDrifting ? 'white' : RELATIONSHIP_LEVELS[tierKey.toUpperCase()]?.color || '#ccc'}
                        strokeWidth="3"
                        className="friend-node-circle"
                    />
                    <text
                        dy=".3em"
                        textAnchor="middle"
                        fontSize="10"
                        fill={isDrifting ? 'white' : 'var(--color-charcoal)'}
                        fontWeight="700"
                        style={{ pointerEvents: 'none' }}
                    >
                        {initials}
                    </text>
                    <title>{friend.name}</title>
                </motion.g>
            );
        });
    };

    return (
        <div className="circle-viz-container">
            <svg viewBox="-250 -250 500 500" width="100%" height="auto">
                {/* Rings */}
                <circle r={RELATIONSHIP_LEVELS.PERIPHERAL.radius} fill="rgba(51, 51, 51, 0.03)" stroke="rgba(51, 51, 51, 0.1)" strokeDasharray="4 4" />
                <circle r={RELATIONSHIP_LEVELS.SECONDARY.radius} fill="rgba(0, 128, 128, 0.05)" stroke="rgba(0, 128, 128, 0.1)" strokeDasharray="4 4" />
                <circle r={RELATIONSHIP_LEVELS.PRIMARY.radius} fill="rgba(255, 191, 0, 0.08)" stroke="rgba(255, 191, 0, 0.2)" strokeDasharray="4 4" />

                {/* Ring Labels */}
                <text y={-RELATIONSHIP_LEVELS.PRIMARY.radius - 5} textAnchor="middle" fontSize="8" fill="#aaa" fontWeight="800">PRIMARY (0-30d)</text>
                <text y={-RELATIONSHIP_LEVELS.SECONDARY.radius - 5} textAnchor="middle" fontSize="8" fill="#aaa" fontWeight="800">SECONDARY (31-90d)</text>
                <text y={-RELATIONSHIP_LEVELS.PERIPHERAL.radius - 5} textAnchor="middle" fontSize="8" fill="#aaa" fontWeight="800">PERIPHERAL ({">"}90d)</text>

                {/* Nodes */}
                {renderFriendNodes(categorizedFriends.peripheral, RELATIONSHIP_LEVELS.PERIPHERAL.radius, 'peripheral')}
                {renderFriendNodes(categorizedFriends.secondary, RELATIONSHIP_LEVELS.SECONDARY.radius, 'secondary')}
                {renderFriendNodes(categorizedFriends.primary, RELATIONSHIP_LEVELS.PRIMARY.radius, 'primary')}

                {/* Center */}
                <text textAnchor="middle" dy=".3em" fontSize="14" fontWeight="800" fill="var(--color-charcoal)">YOU</text>
            </svg>
        </div>
    );
}
