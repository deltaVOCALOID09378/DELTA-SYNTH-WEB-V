type IconProps = { size?: number; className?: string };

export function ArrowIcon({ size = 18, className }: IconProps) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" /></svg>;
}

export function PlayIcon({ size = 18, className }: IconProps) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="m8 5 11 7-11 7V5Z" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

export function SearchIcon({ size = 18, className }: IconProps) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" /></svg>;
}
