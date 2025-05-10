export const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10).split('-').reverse().join('.');
};

export const formatTime = (date: Date) => {
    return date.toISOString().slice(11, 16);
};

export const formatDateTime = (date: Date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
};
