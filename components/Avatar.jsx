export default function Avatar({ userId, name, size = 30 }) {
  const url = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(userId || "default")}&backgroundType=gradientLinear&radius=50`;
  return (
    <img
      src={url}
      alt={name || "User"}
      width={size}
      height={size}
      style={{ borderRadius: "50%", width: size, height: size, objectFit: "cover", flexShrink: 0, display: "block" }}
    />
  );
}
