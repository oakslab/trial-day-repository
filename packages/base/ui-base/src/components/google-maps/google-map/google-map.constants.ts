export const getSvgMarkClusterer = (fill: string) => {
  return `
        <svg fill="${fill}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <circle cx="120" cy="120" opacity="1" r="70" />
        <circle cx="120" cy="120" opacity=".7" r="90" />
        <circle cx="120" cy="120" opacity=".3" r="110" />
        <circle cx="120" cy="120" opacity=".2" r="130" />
        </svg>`;
};
