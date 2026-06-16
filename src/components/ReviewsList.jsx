// src/components/ReviewsList.jsx
import { useState, useRef, useEffect } from 'react';
import ReviewCard from './ReviewCard';

const REVIEWS_DATA = [
    {
        id: 1,
        user: 'vinyl_head',
        date: '2 months ago',
        rating: 5,
        likes: 87,
        language: '🇷🇺 RU',
        lang: 'ru',
        text: "Страница 1 — это именно то, чего не хватало русской R&B сцене. Голос Страницы обволакивает, продакшн минималистичный но очень атмосферный. «Холодно» и «Туман» — просто шедевры. Слушаю на повторе уже третью неделю."
    },
    {
        id: 2,
        user: 'pitchbox',
        date: '1 year ago',
        rating: 4,
        likes: 134,
        language: '🇷🇺 RU',
        lang: 'ru',
        text: "Сильный дебютный альбом. Чувствуется влияние SZA и ранней Sevdaliza, но при этом звучит по-русски и по-своему. Иногда треки немного сливаются, но общее настроение держит от начала до конца."
    },
    {
        id: 3,
        user: 'drain_scholar',
        date: '3 weeks ago',
        rating: 5,
        likes: 23,
        language: '🇬🇧 EN',
        lang: 'en',
        text: "Discovered STRANIZA randomly and this album completely floored me. Doesn't matter that it's in Russian — the emotion translates perfectly. 'Не звони' might be one of the best breakup songs I've heard this year."
    }
];

export default function ReviewsList() {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6 border-b border-border-gold/20 pb-4">
                <h3 className="font-serif text-3xl text-text-main flex items-baseline gap-3">
                    Reviews
                    <span className="text-text-muted text-base font-sans font-normal">847</span>
                </h3>
                <div className="flex items-center">
                    <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-semibold tracking-wide overflow-x-auto no-scrollbar items-center">
                        <button className="text-primary border-b-2 border-primary pb-1 whitespace-nowrap">Most Recent</button>
                        <button className="text-text-muted hover:text-text-main transition-colors pb-1 whitespace-nowrap">Most Liked</button>
                        <button className="text-text-muted hover:text-text-main transition-colors pb-1 whitespace-nowrap">Critics</button>
                    </div>

                    {/* Language Filter Dropdown */}
                    <div className="relative ml-4 border-l border-border-gold/20 pl-4" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="text-text-muted hover:text-primary transition-colors pb-1 whitespace-nowrap flex items-center gap-1"
                        >
                            {selectedLanguage === 'all' ? 'All Languages ↓'
                                : selectedLanguage === 'ru' ? '🇷🇺 Russian ↓'
                                    : '🇬🇧 English ↓'}
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 top-full mt-2 w-36 bg-[#161410] border border-primary/60 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-[60] py-2 flex flex-col">
                                <button
                                    onClick={() => { setSelectedLanguage('all'); setIsLangOpen(false); }}
                                    className={`text-left px-4 py-2 hover:bg-primary/10 text-sm transition-colors flex items-center gap-2 ${selectedLanguage === 'all' ? 'text-primary' : 'text-text-main hover:text-primary'}`}
                                >
                                    <span>All Languages</span>
                                    {selectedLanguage === 'all' && <span className="ml-auto">✓</span>}
                                </button>
                                <button
                                    onClick={() => { setSelectedLanguage('ru'); setIsLangOpen(false); }}
                                    className={`text-left px-4 py-2 hover:bg-primary/10 text-sm transition-colors flex items-center gap-2 ${selectedLanguage === 'ru' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                                >
                                    <span>🇷🇺 Russian</span>
                                    {selectedLanguage === 'ru' && <span className="ml-auto">✓</span>}
                                </button>
                                <button
                                    onClick={() => { setSelectedLanguage('en'); setIsLangOpen(false); }}
                                    className={`text-left px-4 py-2 hover:bg-primary/10 text-sm transition-colors flex items-center gap-2 ${selectedLanguage === 'en' ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                                >
                                    <span>🇬🇧 English</span>
                                    {selectedLanguage === 'en' && <span className="ml-auto">✓</span>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {REVIEWS_DATA
                    .filter(rev => selectedLanguage === 'all' || rev.lang === selectedLanguage)
                    .map((rev) => (
                        <ReviewCard
                            key={rev.id}
                            user={rev.user}
                            date={rev.date}
                            rating={rev.rating}
                            likes={rev.likes}
                            text={rev.text}
                            language={rev.language}
                        />
                    ))}
            </div>
        </div>
    );
}
