// src/components/ReviewCard.jsx
import { Heart, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';

export default function ReviewCard({ user, rating, text, date, likes, language }) {
    const isPrimaryLang = language && language.includes('RU');
    const badgeText = isPrimaryLang ? 'RU' : 'EN';

    return (
        <div className="bg-card-bg border border-border-gold/10 border-l-[3px] border-l-primary rounded-r-md p-6 flex flex-col gap-4 group hover:bg-card-bg/80 transition-colors relative">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-border-gold/30 flex items-center justify-center text-primary font-bold shadow-inner flex-shrink-0">
                        {user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col pr-4">
                        <div className="flex items-center gap-2">
                            <span className="text-text-main font-semibold text-sm">{user}</span>
                            {language && (
                                <span
                                    className="text-[10px] px-[7px] py-[2px] rounded-[4px] whitespace-nowrap"
                                    style={isPrimaryLang ? {
                                        background: 'rgba(201,168,76,0.12)',
                                        border: '1px solid rgba(201,168,76,0.5)',
                                        color: '#C9A84C'
                                    } : {
                                        background: 'rgba(201,168,76,0.04)',
                                        border: '1px solid rgba(201,168,76,0.2)',
                                        color: 'rgba(201,168,76,0.5)'
                                    }}
                                >
                                    {badgeText}
                                </span>
                            )}
                        </div>
                        <span className="text-text-muted text-xs">{date}</span>
                    </div>
                </div>
                <div className="p-1 rounded bg-bg-dark/50">
                    <StarRating rating={rating} size="sm" />
                </div>
            </div>

            <p className="text-text-main/80 text-sm leading-relaxed line-clamp-4 mt-2">
                {text}
            </p>

            <div className="flex gap-6 mt-2 pt-4 border-t border-border-gold/10 text-text-muted text-xs font-semibold">
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors hover:scale-105">
                    <Heart size={14} className="group-hover:text-primary transition-colors" />
                    <span>{likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors hover:scale-105">
                    <MessageSquare size={14} />
                    <span>Reply</span>
                </button>
            </div>
        </div>
    );
}
