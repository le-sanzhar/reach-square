import { X } from 'lucide-react';
import { useState } from 'react';
import StarRating from './StarRating';

export default function ReviewModal({ isOpen, onClose }) {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-bg-dark/90 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-card-bg border border-border-gold/30 rounded-sm shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 text-text-muted hover:text-primary transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="font-serif text-3xl text-text-main mb-2">Write a Review</h2>
                <p className="text-text-muted mb-8 text-sm">Reviewing "Crest" by Bladee & Ecco2k</p>

                <div className="mb-8">
                    <label className="block text-text-main font-semibold mb-3">Your Rating</label>
                    <div className="bg-bg-dark/50 inline-block p-4 rounded-sm border border-border-gold/10 hover:border-border-gold/30 transition-colors">
                        <StarRating
                            rating={rating}
                            max={5}
                            size="lg"
                            interactive={true}
                            onChange={setRating}
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-text-main font-semibold mb-3">Your Review</label>
                    <textarea
                        className="w-full h-40 bg-bg-dark border border-border-gold/20 rounded-sm p-4 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 transition-colors resize-none shadow-inner"
                        placeholder="What did you think of this album?"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-text-muted hover:text-text-main transition-colors font-semibold tracking-wide text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-primary text-[#0D0D0D] font-bold rounded-sm hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all tracking-wide text-sm"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
}
