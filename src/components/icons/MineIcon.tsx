import React from 'react';

const MineIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="25" height="25">
    <circle cx="50" cy="50" r="35" fill="black" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="black" strokeWidth="10" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="black" strokeWidth="10" />
    <line x1="25" y1="25" x2="75" y2="75" stroke="black" strokeWidth="10" />
    <line x1="25" y1="75" x2="75" y2="25" stroke="black" strokeWidth="10" />
    <circle cx="50" cy="50" r="10" fill="white" />
  </svg>
);

export default MineIcon;
