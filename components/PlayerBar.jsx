"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function fmt(s) {
  if (!Number.isFinite(s)) return "0:00";
  const sec = Math.floor(s);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

// Глобальный плеер с очередью. Запуск:
// window.dispatchEvent(new CustomEvent("reach2:play", { detail: { queue: [{url,name,artist,cover}], index } }))
export default function PlayerBar() {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(30);

  const track = queue[idx] || null;

  useEffect(() => {
    const a = new Audio();
    audioRef.current = a;
    a.addEventListener("timeupdate", () => setT(a.currentTime));
    a.addEventListener("loadedmetadata", () => setDur(a.duration || 30));
    return () => a.pause();
  }, []);

  // авто-переход на следующий трек
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => {
      if (idx + 1 < queue.length) start(queue, idx + 1);
      else { setPlaying(false); broadcast(null); }
    };
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  }, [idx, queue]);

  useEffect(() => {
    const onPlayEvent = (e) => {
      const d = e.detail;
      if (!d?.queue?.length) return;
      const i = d.index || 0;
      const a = audioRef.current;
      const target = d.queue[i];
      if (a && a.src === target.url && !a.paused) {
        a.pause(); setPlaying(false); broadcast(null);
        return;
      }
      start(d.queue, i);
    };
    window.addEventListener("reach2:play", onPlayEvent);
    return () => window.removeEventListener("reach2:play", onPlayEvent);
  }, []);

  function start(q, i) {
    const a = audioRef.current;
    const tr = q[i];
    if (!a || !tr?.url) return;
    setQueue(q); setIdx(i); setT(0);
    a.src = tr.url;
    a.play().catch(() => {});
    setPlaying(true);
    broadcast(tr.url);
  }

  function broadcast(url) {
    window.dispatchEvent(new CustomEvent("reach2:nowplaying", { detail: { url } }));
  }

  function toggle() {
    const a = audioRef.current;
    if (!a || !track) return;
    if (a.paused) { a.play().catch(() => {}); setPlaying(true); broadcast(track.url); }
    else { a.pause(); setPlaying(false); broadcast(null); }
  }

  function seek(e) {
    const a = audioRef.current;
    if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * dur;
  }

  const hasPrev = idx > 0;
  const hasNext = idx + 1 < queue.length;

  return (
    <div className={`player ${track ? "" : "hidden"}`} aria-hidden={!track}>
      {track && (
        <>
          {track.cover && <Image src={track.cover} alt="" width={48} height={48} />}
          <div className="pmeta">
            <div className="pname">{track.name}</div>
            <div className="partist">{track.artist}</div>
          </div>

          <div className="ctrls">
            <button className="step" disabled={!hasPrev} onClick={() => hasPrev && start(queue, idx - 1)} aria-label="Предыдущий">⏮</button>
            <button className="pbtn" onClick={toggle} aria-label={playing ? "Пауза" : "Играть"}>
              {playing ? "❚❚" : "▶"}
            </button>
            <button className="step" disabled={!hasNext} onClick={() => hasNext && start(queue, idx + 1)} aria-label="Следующий">⏭</button>
          </div>

          <div className="pbar">
            <span className="ptime">{fmt(t)}</span>
            <div className="ptrack" onClick={seek} role="slider" aria-label="Перемотка"
              aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(t)}>
              <div className="pfill" style={{ width: `${Math.min(100, (t / dur) * 100)}%` }} />
            </div>
            <span className="ptime">{fmt(dur)}</span>
          </div>
          <span className="pnote">30-сек превью · iTunes</span>
        </>
      )}
    </div>
  );
}
