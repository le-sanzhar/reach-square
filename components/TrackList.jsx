"use client";
import { useEffect, useState } from "react";

function fmt(ms) {
  if (!ms) return "";
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function TrackList({ tracks, albumTitle, artistName, cover }) {
  const [nowUrl, setNowUrl] = useState(null);

  useEffect(() => {
    const onState = (e) => setNowUrl(e.detail?.url || null);
    window.addEventListener("reach2:nowplaying", onState);
    return () => window.removeEventListener("reach2:nowplaying", onState);
  }, []);

  const queue = (tracks || [])
    .filter((t) => t.previewUrl)
    .map((t) => ({ url: t.previewUrl, name: t.name, artist: artistName || albumTitle, cover }));

  function play(t) {
    const index = queue.findIndex((x) => x.url === t.previewUrl);
    window.dispatchEvent(new CustomEvent("reach2:play", { detail: { queue, index: Math.max(0, index) } }));
  }

  if (!tracks?.length) return null;

  return (
    <div className="panel">
      <div className="eyebrow">Треклист</div>
      {tracks.map((t, i) => (
        <div className="track" key={i}>
          <span className="n">{i + 1}</span>
          {t.previewUrl ? (
            <button
              className={`play-btn ${nowUrl === t.previewUrl ? "playing" : ""}`}
              onClick={() => play(t)}
              aria-label={nowUrl === t.previewUrl ? "Пауза" : "Превью"}
            >
              {nowUrl === t.previewUrl ? "❚❚" : "▶"}
            </button>
          ) : (
            <span style={{ width: 34 }} />
          )}
          <span className="nm">{t.name}</span>
          <span className="d">{fmt(t.durationMs)}</span>
        </div>
      ))}
      <div className="preview-note">▶ — официальные 30-секундные превью (iTunes). Полные треки — по ссылкам выше.</div>
    </div>
  );
}
