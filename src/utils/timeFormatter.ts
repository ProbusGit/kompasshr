export const extractTime = (dateTimeString: string): string => {
  const timePart = dateTimeString.split('T')[1];
  if (!timePart) return '';

  const [hours, minutes] = timePart.split(':');
  const hour = parseInt(hours, 10);
  const isPM = hour >= 12;
  const formattedHour = hour % 12 || 12; // Convert to 12-hour format
  const period = isPM ? 'PM' : 'AM';

  return `${formattedHour}:${minutes} ${period}`;
};
