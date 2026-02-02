import { differenceInDays, parseISO, isSameDay, format } from 'date-fns';

export const RELATIONSHIP_LEVELS = {
    PRIMARY: { id: 'primary', label: 'Primary Connections', radius: 80, color: '#FFBF00' },
    SECONDARY: { id: 'secondary', label: 'Secondary Connections', radius: 140, color: '#008080' },
    PERIPHERAL: { id: 'peripheral', label: 'Peripheral Connections', radius: 200, color: '#333333' }
};

export const RELATIONSHIP_CATEGORIES = [
    'Close Friend', 'Good Friend', 'Acquaintance', 'Colleague', 'Family', 'Neighbor', 'Other'
];

export const CADENCES = {
    WEEKLY: { id: 7, label: 'Weekly' },
    BIWEEKLY: { id: 14, label: 'Bi-weekly' },
    MONTHLY: { id: 30, label: 'Monthly' },
    QUARTERLY: { id: 90, label: 'Quarterly' }
};

export const FOOD_PREFERENCES = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Allergies'];
export const BUDGET_PREFERENCES = ['Low', 'Medium', 'High'];

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

export const getUpcomingEvents = (friends) => {
    const today = new Date();
    const events = [];

    friends.forEach(friend => {
        // Check birthdays
        if (friend.birthday) {
            events.push({ friend, type: 'Birthday', date: friend.birthday, label: `${friend.name}'s Birthday` });
        }
        if (friend.partnerBirthday) {
            events.push({ friend, type: 'Partner Birthday', date: friend.partnerBirthday, label: `${friend.partnerName}'s Birthday` });
        }
        if (friend.anniversary) {
            events.push({ friend, type: 'Anniversary', date: friend.anniversary, label: `${friend.name}'s Anniversary` });
        }
        (friend.kids || []).forEach(kid => {
            if (kid.birthday) {
                events.push({ friend, type: 'Kid Birthday', date: kid.birthday, label: `${kid.name}'s Birthday` });
            }
        });
    });

    return events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getMonth() - dateB.getMonth() || dateA.getDate() - dateB.getDate();
    });
};
