import { motion } from 'framer-motion';
import { RELATIONSHIP_LEVELS, calculateDrift } from '../utils/socialHealth';

export function CircleViz({ friends }) {
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
                    className="friend-node-group clickable"
                >
                    <circle
                        r="18"
                        fill={isDrifting ? '#ff4d4d' : 'white'}
                        stroke={isDrifting ? 'white' : RELATIONSHIP_LEVELS[tierKey.toUpperCase()]?.color || '#ccc'}
                        strokeWidth="3"
                        className="friend-node-circle"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                    />
                    <text
                        dy=".3em"
                        textAnchor="middle"
                        fontSize="11"
                        fill={isDrifting ? 'white' : 'var(--color-charcoal)'}
                        fontWeight="800"
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
            <svg viewBox="-260 -260 520 520" width="100%" height="auto">
                <defs>
                    <radialGradient id="centerGradient">
                        <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                </defs>

                {/* Premium Solid Rings */}
                <circle r={RELATIONSHIP_LEVELS.PERIPHERAL.radius} className="viz-ring ring-peripheral" />
                <circle r={RELATIONSHIP_LEVELS.SECONDARY.radius} className="viz-ring ring-secondary" />
                <circle r={RELATIONSHIP_LEVELS.PRIMARY.radius} className="viz-ring ring-primary" />

                {/* Ring Labels */}
                <text y={-RELATIONSHIP_LEVELS.PRIMARY.radius - 8} textAnchor="middle" className="ring-label" fontSize="9">PRIMARY</text>
                <text y={-RELATIONSHIP_LEVELS.SECONDARY.radius - 8} textAnchor="middle" className="ring-label" fontSize="9">SECONDARY</text>
                <text y={-RELATIONSHIP_LEVELS.PERIPHERAL.radius - 8} textAnchor="middle" className="ring-label" fontSize="9">PERIPHERAL</text>

                {/* Center Glow */}
                <circle r="40" fill="url(#centerGradient)" opacity="0.5" />

                {/* Nodes */}
                {renderFriendNodes(categorizedFriends.peripheral, RELATIONSHIP_LEVELS.PERIPHERAL.radius, 'peripheral')}
                {renderFriendNodes(categorizedFriends.secondary, RELATIONSHIP_LEVELS.SECONDARY.radius, 'secondary')}
                {renderFriendNodes(categorizedFriends.primary, RELATIONSHIP_LEVELS.PRIMARY.radius, 'primary')}

                {/* Center */}
                <motion.circle r="12" fill="var(--color-charcoal)" initial={{ scale: 0 }} animate={{ scale: 1 }} />
            </svg>
        </div>
    );
}
