import React from 'react';

const IncorrectlyMarkedFlagIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="25" height="25">
        <path d="M 20 80 L 20 20 L 80 20 L 60 40 L 80 60 L 20 60" fill="yellow" stroke="black" strokeWidth="5" />
        <line x1="10" y1="10" x2="90" y2="90" stroke="red" strokeWidth="10" />
        <line x1="10" y1="90" x2="90" y2="10" stroke="red" strokeWidth="10" />
    </svg>
);

export default IncorrectlyMarkedFlagIcon;
