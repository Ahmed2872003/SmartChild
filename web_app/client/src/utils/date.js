const formatDate = (date) => {
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const fullTimeString = timeFormatter.format(date);

  return fullTimeString;
};

export { formatDate };
