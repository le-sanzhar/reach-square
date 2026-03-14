// src/components/Hero.jsx
import StarRating from './StarRating';
import { Plus } from 'lucide-react';

export default function Hero({ onWriteReview }) {

    return (
        <div className="relative w-full min-h-[500px] flex items-end pb-12 overflow-hidden border-b border-border-gold/30">
            {/* Blurred Background */}
            <div
                className="absolute inset-0 z-0 opacity-40 blur-[100px] scale-110 translate-y-[-10%]"
                style={{ backgroundImage: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #0d0d1a 100%)' }}
            ></div>
            {/* Dark Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent"></div>

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8 md:gap-12 md:items-end mt-24">

                {/* Album Art Thumbnail (Actual Image) */}
                <img
                    src="https://avatars.yandex.net/get-music-content/9737237/23155eaf.a.25893115-1/600x600"
                    alt="Страница 1 — STRANIZA"
                    style={{
                        width: '280px',
                        height: '280px',
                        minWidth: '280px',
                        minHeight: '280px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    }}
                />

                {/* Album Details */}
                <div className="flex flex-col gap-4 w-full text-center md:text-left">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-serif text-5xl md:text-8xl font-bold text-text-main tracking-tight leading-none mb-2 drop-shadow-lg">
                            Страница 1
                        </h1>
                        <h2 className="text-primary text-xl md:text-3xl font-medium tracking-wide">
                            <a href="#" className="hover:underline underline-offset-8 decoration-border-gold text-primary">STRANIZA</a>
                        </h2>
                        <div className="flex gap-3 items-center text-text-muted text-sm md:text-base font-medium mt-2 justify-center md:justify-start flex-wrap">
                            <span>2023</span>
                            <span>&middot;</span>
                            <span>R&amp;B / Поп / Инди</span>
                            <span>&middot;</span>
                            <span>Gazgolder</span>
                            <span className="bg-transparent border border-primary/35 text-primary text-[11px] px-[10px] py-[3px] rounded-[20px] ml-2 whitespace-nowrap">
                                🇷🇺 Sung in Russian
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4">
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                            <StarRating rating={4.85} max={5} size="lg" interactive={false} />
                            <div className="text-text-main font-semibold text-lg flex items-baseline gap-2">
                                4.85 <span className="text-text-muted text-sm font-normal">847 ratings</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6 justify-center md:justify-start flex-wrap">
                        <button
                            onClick={onWriteReview}
                            className="bg-primary text-[#0D0D0D] font-bold px-8 py-3 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all uppercase tracking-wider text-sm"
                        >
                            Write a Review
                        </button>
                        <button className="border border-primary text-primary font-bold px-6 py-3 rounded-sm hover:bg-primary/10 transition-all uppercase tracking-wider text-sm flex items-center gap-2">
                            <Plus size={18} />
                            Add to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
