import React from 'react';
import './Loader.css';

export const PremiumSpinner = ({ text = "Loading..." }) => (
    <div className="premium-loader-container">
        <div className="premium-loader-spinner"></div>
        <div className="premium-loader-text">{text}</div>
    </div>
);

export const ProductSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-info">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-line price"></div>
        </div>
    </div>
);

export const SkeletonSection = () => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        padding: '20px',
        width: '100%',
        backgroundColor: '#fff'
    }}>
        {[...Array(4)].map((_, i) => (
            <ProductSkeleton key={i} />
        ))}
    </div>
);
