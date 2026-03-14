// src/components/Tracklist.jsx
import { Clock } from 'lucide-react';

const TRACKS = [
    { num: 1, title: 'Intro', duration: '1:22' },
    { num: 2, title: 'Не звони', duration: '3:10' },
    { num: 3, title: 'Холодно', duration: '2:58' },
    { num: 4, title: 'Страница 1', duration: '3:24' },
    { num: 5, title: 'Без тебя лучше', duration: '2:47' },
    { num: 6, title: 'Туман', duration: '3:05' },
    { num: 7, title: 'Молчи', duration: '2:33' },
    { num: 8, title: 'Снова дождь', duration: '3:18' },
    { num: 9, title: 'Последний раз', duration: '2:55' },
    { num: 10, title: 'Конец главы', duration: '4:02' },
];

export default function Tracklist() {
    return (
        <div className="bg-card-bg border border-border-gold/20 rounded-sm p-6 w-full">
            <h3 className="font-serif text-2xl mb-6 text-text-main border-b border-border-gold/20 pb-4">Tracklist</h3>
            <div className="flex flex-col gap-1">
                {TRACKS.map((track) => (
                    <div
                        key={track.num}
                        className="flex items-center justify-between py-3 px-2 hover:bg-primary/[0.08] rounded-sm transition-colors group cursor-pointer"
                    >
                        <div className="flex gap-4 items-center overflow-hidden">
                            <span className="text-text-muted group-hover:text-primary transition-colors font-mono text-sm w-4">{track.num}</span>
                            <span className="text-text-main font-medium truncate group-hover:text-primary transition-colors">{track.title}</span>
                        </div>
                        <div className="flex gap-2 items-center text-text-muted text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                            <Clock size={12} />
                            {track.duration}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
