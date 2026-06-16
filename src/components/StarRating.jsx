const StarRating = ({ rating = 4.85, max = 5 }) => {
    return (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {Array.from({ length: max }, (_, i) => {
                const filled = Math.min(Math.max(rating - i, 0), 1);
                const id = `star-clip-${i}`;
                return (
                    <svg key={i} width="28" height="28" viewBox="0 0 24 24"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(201,168,76,0.7))' }}>
                        <defs>
                            <clipPath id={id}>
                                <rect x="0" y="0" width={`${filled * 100}%`} height="24" />
                            </clipPath>
                        </defs>
                        {/* Background star */}
                        <polygon
                            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 
                      12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                            fill="#C9A84C"
                            opacity="0.15"
                        />
                        {/* Filled star clipped */}
                        <polygon
                            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 
                      12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                            fill="#C9A84C"
                            clipPath={`url(#${id})`}
                        />
                    </svg>
                );
            })}
        </div>
    );
};

export default StarRating;
