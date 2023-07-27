export const title = (input) => {
  return input.split(" ").map( i => i.charAt(0).toUpperCase() + i.slice(1) ).join(' ');
}