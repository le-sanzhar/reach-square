"use client";

export default function HeroPlay({ queue }) {
  if (!queue?.length) return null;
  return (
    <button
      className="play-pill"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("reach2:play", { detail: { queue, index: 0 } }))
      }
    >
      ▶ СЛУШАТЬ
    </button>
  );
}
