import { differenceInDays, parseISO } from 'date-fns';

export const RELATIONSHIP_LEVELS = {
    INNER: { id: 'inner', label: 'Inner Circle', radius: 80, color: '#FFBF00' },
    MIDDLE: { id: 'middle', label: 'Middle Circle', radius: 140, color: '#008080' },
    OUTER: { id: 'outer', label: 'Outer Circle', radius: 200, color: '#333333' }
};

export const CADENCES = {
    WEEKLY: { id: 7, label: 'Weekly' },
    BIWEEKLY: { id: 14, label: 'Bi-weekly' },
    MONTHLY: { id: 30, label: 'Monthly' },
    QUARTERLY: { id: 90, label: 'Quarterly' }
};

export const calculateDrift = (lastInteractionDate, cadenceDays) => {
    if (!lastInteractionDate) return { isDrifting: true, daysSince: Infinity };

    const today = new Date();
    const lastDate = typeof lastInteractionDate === 'string' ? parseISO(lastInteractionDate) : lastInteractionDate;
    const daysSince = differenceInDays(today, lastDate);

    return {
        isDrifting: daysSince > cadenceDays,
        daysSince,
        percentDrift: Math.min(100, (daysSince / cadenceDays) * 100)
    };
};

export const getSocialHealthScore = (friends) => {
    if (!friends || friends.length === 0) return 0;

    const totalDrift = friends.reduce((acc, friend) => {
        const { percentDrift } = calculateDrift(friend.lastInteraction, friend.cadence);
        return acc + (100 - percentDrift);
    }, 0);

    return Math.round(totalDrift / friends.length);
};
