import { motion } from 'framer-motion';
import { RELATIONSHIP_LEVELS, calculateDrift } from '../utils/socialHealth';

export function CircleViz({ friends }) {
    const innerFriends = friends.filter(f => f.level === 'inner');
    const middleFriends = friends.filter(f => f.level === 'middle');
    const outerFriends = friends.filter(f => f.level === 'outer');

    const renderFriendNodes = (friendsList, radius) => {
        return friendsList.map((friend, index) => {
            const angle = (index / friendsList.length) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const { isDrifting } = calculateDrift(friend.lastInteraction, friend.cadence);

            return (
                <motion.g
                    key={friend.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x, y }}
                    transition={{ type: 'spring', damping: 12 }}
                >
                    <circle
                        r="12"
                        fill={isDrifting ? '#ff4d4d' : 'white'}
                        stroke={isDrifting ? 'white' : RELATIONSHIP_LEVELS[friend.level.toUpperCase()].color}
                        strokeWidth="3"
                        className="friend-node"
                    />
                    {friend.photo ? (
                        <defs>
                            <clipPath id={`clip-${friend.id}`}>
                                <circle r="12" />
                            </clipPath>
                        </defs>
                    ) : (
                        <text
                            dy=".3em"
                            textAnchor="middle"
                            fontSize="8"
                            fill={isDrifting ? 'white' : 'var(--color-charcoal)'}
                            fontWeight="bold"
                        >
                            {friend.name.charAt(0)}
                        </text>
                    )}
                </motion.g>
            );
        });
    };

    return (
        <div className="circle-viz-container">
            <svg viewBox="-250 -250 500 500" width="100%" height="auto">
                {/* Circles */}
                <circle r={RELATIONSHIP_LEVELS.OUTER.radius} fill="rgba(51, 51, 51, 0.03)" stroke="rgba(51, 51, 51, 0.1)" strokeDasharray="4 4" />
                <circle r={RELATIONSHIP_LEVELS.MIDDLE.radius} fill="rgba(0, 128, 128, 0.05)" stroke="rgba(0, 128, 128, 0.1)" strokeDasharray="4 4" />
                <circle r={RELATIONSHIP_LEVELS.INNER.radius} fill="rgba(255, 191, 0, 0.08)" stroke="rgba(255, 191, 0, 0.2)" strokeDasharray="4 4" />

                {/* Friend Nodes */}
                {renderFriendNodes(outerFriends, RELATIONSHIP_LEVELS.OUTER.radius)}
                {renderFriendNodes(middleFriends, RELATIONSHIP_LEVELS.MIDDLE.radius)}
                {renderFriendNodes(innerFriends, RELATIONSHIP_LEVELS.INNER.radius)}

                {/* Center Label */}
                <text textAnchor="middle" dy=".3em" fontSize="14" fontWeight="800" fill="var(--color-charcoal)">YOU</text>
            </svg>
        </div>
    );
}
