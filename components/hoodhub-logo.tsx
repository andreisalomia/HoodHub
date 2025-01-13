export default function HoodHubLogo({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="LocalVibe logo"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className} // Pass className here
      {...props} // Spread other props
    >
      <g clipPath="url(#clip0_local_vibe)">
        <path
          d="M15 27C21.6274 27 27 21.6274 27 15C27 8.37258 21.6274 3 15 3C8.37258 3 3 8.37258 3 15C3 21.6274 8.37258 27 15 27Z"
          fill="url(#paint0_linear_local_vibe)"
        />
        <path
          d="M15 24C19.9706 24 24 19.9706 24 15C24 10.0294 19.9706 6 15 6C10.0294 6 6 10.0294 6 15C6 19.9706 10.0294 24 15 24Z"
          fill="#84B1F3"
        />
        <path
          d="M15 21C18.3137 21 21 18.3137 21 15C21 11.6863 18.3137 9 15 9C11.6863 9 9 11.6863 9 15C9 18.3137 11.6863 21 15 21Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_local_vibe"
          x1="3"
          y1="3"
          x2="27"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0264FA" />
          <stop offset="1" stopColor="#84B1F3" />
        </linearGradient>
        <clipPath id="clip0_local_vibe">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
