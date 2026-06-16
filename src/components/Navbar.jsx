import { Bell, User } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="w-full flex justify-between items-center py-6 px-4 md:px-8 border-b border-border-gold bg-bg-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="text-primary font-serif font-bold text-3xl tracking-tighter cursor-pointer flex-shrink-0">
                R²
            </div>
            <div className="hidden md:flex gap-8 text-text-muted font-medium text-sm tracking-widest uppercase">
                <button className="hover:text-primary transition-colors">Feed</button>
                <button className="hover:text-primary transition-colors">Charts</button>
                <button className="hover:text-primary transition-colors">Artists</button>
            </div>
            <div className="flex gap-4 md:gap-6 items-center text-text-muted flex-shrink-0">
                <button className="hover:text-primary transition-colors">
                    <Bell size={20} />
                </button>
                <button className="w-8 h-8 rounded-full bg-card-bg border border-border-gold flex items-center justify-center hover:border-primary transition-colors text-text-main">
                    <User size={16} />
                </button>
            </div>
        </nav>
    );
}
