import type React from "react";

export interface ThunderLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function ThunderLogo({
  className,
  size = 24,
  ...props
}: ThunderLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      <defs>
        <linearGradient
          id="thunder-grad"
          x1="4"
          y1="2"
          x2="24"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient
          id="thunder-glow"
          x1="4"
          y1="2"
          x2="24"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Glow shadow layer */}
      <path
        d="M18 2L4 18h10l-4 12 14-16H14L18 2z"
        fill="url(#thunder-glow)"
        filter="url(#glow-filter)"
        transform="translate(0, 2)"
      />

      {/* Main mathematically symmetric lightning bolt */}
      <path
        d="M18 2L4 18h10l-4 12 14-16H14L18 2z"
        fill="url(#thunder-grad)"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Inner highlight for 3D/glass effect */}
      <path
        d="M17 4L5.5 17h9.5l-2.5 7.5"
        fill="none"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
