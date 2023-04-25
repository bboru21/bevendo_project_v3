export const nthNumber = (number) => {
  if (number > 3 && number < 21) return "th";
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const displayDate = (date) => {

  const d = new Date(`${date}T00:00:00`);

  const weekday = d.toLocaleDateString('en-us', { weekday: 'long' });
  const month = d.toLocaleDateString('en-us', { month: 'long' });
  const day = d.toLocaleDateString('en-us', { day: 'numeric' });


  return `${weekday}, ${month} ${day}${nthNumber(day)}`;
}
