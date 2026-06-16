export default function Stars({ value = 0, size }) {
  const full = Math.round(value);
  return (
    <span className="stars" style={size ? { fontSize: size } : undefined} aria-label={`${value} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "" : "off"}>★</span>
      ))}
    </span>
  );
}
