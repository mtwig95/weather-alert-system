import React from 'react';

type Props = {
    message: string;
};

export const ErrorMessage: React.FC<Props> = ({ message }) => {
    return (
        <div style={{
            backgroundColor: '#ffe0e0',
            color: '#b00020',
            border: '1px solid #b00020',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>❗</span>
            <span>{message}</span>
        </div>
    );
};
