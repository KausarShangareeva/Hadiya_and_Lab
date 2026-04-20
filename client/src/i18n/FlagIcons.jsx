export function FlagRU({ size = 20 }) {
  return (
    <svg width={size} height={size * 0.667} viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="30" height="6.67" y="0" fill="#fff" />
      <rect width="30" height="6.67" y="6.67" fill="#0039A6" />
      <rect width="30" height="6.67" y="13.33" fill="#D52B1E" />
    </svg>
  )
}

export function FlagEN({ size = 20 }) {
  return (
    <svg width={size} height={size * 0.667} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="60" height="40" fill="#012169" />
      {/* White diagonals */}
      <line x1="0" y1="0" x2="60" y2="40" stroke="#fff" strokeWidth="8" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="#fff" strokeWidth="8" />
      {/* Red diagonals */}
      <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="4.5" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="4.5" />
      {/* White cross */}
      <rect x="24" y="0" width="12" height="40" fill="#fff" />
      <rect x="0" y="14" width="60" height="12" fill="#fff" />
      {/* Red cross */}
      <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
      <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
    </svg>
  )
}

export function FlagTR({ size = 20 }) {
  return (
    <svg width={size} height={size * 0.667} viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="11" cy="10" r="5.5" fill="#fff" />
      <circle cx="13" cy="10" r="4.3" fill="#E30A17" />
      <polygon points="18,10 20.5,7 20.5,13" fill="#fff" transform="rotate(-15 19.5 10)" />
    </svg>
  )
}
