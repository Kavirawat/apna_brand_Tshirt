import React from 'react';

export function PhonePeIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="64" height="64" rx="16" fill="#5F259F" />

      <path
        d="M45 18H24C21.79 18 20 19.79 20 22V48C20 49.66 21.34 51 23 51C24.66 51 26 49.66 26 48V40.5H35.5C41.85 40.5 47 35.35 47 29V20C47 18.9 46.1 18 45 18ZM41 29C41 32.04 38.54 34.5 35.5 34.5H26V24H35.5C38.54 24 41 26.46 41 29.5V29Z"
        fill="#FFFFFF"
      />
      <path
        d="M33 34L41 50"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GooglePayIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="64" height="64" rx="16" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

      <path
        d="M32 23.64C32 22.95 31.94 22.28 31.83 21.64H22V25.73H27.63C27.38 27.08 26.62 28.22 25.47 28.99V31.69H28.97C31.02 29.8 32 27 32 23.64Z"
        fill="#4285F4"
      />
      <path
        d="M22 33.82C25.24 33.82 27.96 32.75 29.97 30.89L26.47 28.19C25.5 28.84 24.26 29.23 22 29.23C18.87 29.23 16.22 27.12 15.27 24.27H11.65V27.08C13.66 31.07 17.58 33.82 22 33.82Z"
        fill="#34A853"
      />
      <path
        d="M15.27 24.27C15.03 23.54 14.89 22.77 14.89 21.98C14.89 21.19 15.03 20.42 15.27 19.69V16.88H11.65C10.91 18.35 10.5 20.12 10.5 21.98C10.5 23.84 10.91 25.61 11.65 27.08L15.27 24.27Z"
        fill="#FBBC04"
      />
      <path
        d="M22 14.73C23.76 14.73 25.35 15.34 26.59 16.53L29.68 13.44C27.95 11.83 25.23 10.91 22 10.91C17.58 10.91 13.66 13.66 11.65 17.65L15.27 20.46C16.22 17.61 18.87 14.73 22 14.73Z"
        fill="#EA4335"
      />

      <text
        x="33"
        y="30"
        fontFamily="sans-serif"
        fontSize="15"
        fontWeight="800"
        fill="#5F6368"
      >
        Pay
      </text>
    </svg>
  );
}

export function PaytmIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 96 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="96" height="64" rx="16" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />

      <path
        d="M17 19H25C29.42 19 32.5 21.5 32.5 25.5C32.5 29.5 29.42 32 25 32H20.8V43H17V19ZM20.8 28.5H24.8C27.2 28.5 28.7 27.3 28.7 25.5C28.7 23.7 27.2 22.5 24.8 22.5H20.8V28.5Z"
        fill="#002970"
      />
      <path
        d="M34 26.5C34 24.5 35.5 23 37.5 23C39.5 23 41 24.5 41 26.5V43H37.5V36.5C36.8 37.5 35.5 38 34.2 38C31.5 38 29.5 35.8 29.5 32.5C29.5 29.2 31.5 27 34.2 27C35.5 27 36.8 27.5 37.5 28.5V26.5H34ZM37.5 32.5C37.5 30.5 36.2 29.2 34.5 29.2C32.8 29.2 31.5 30.5 31.5 32.5C31.5 34.5 32.8 35.8 34.5 35.8C36.2 35.8 37.5 34.5 37.5 32.5Z"
        fill="#002970"
      />

      <text
        x="47"
        y="38"
        fontFamily="sans-serif"
        fontSize="22"
        fontWeight="900"
        fill="#00B9F5"
        letterSpacing="-0.5"
      >
        tm
      </text>
    </svg>
  );
}

export function UpiQrIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="64" height="64" rx="16" fill="#181922" stroke="#D4AF37" strokeWidth="1.5" />

      <rect x="14" y="14" width="14" height="14" rx="2" stroke="#D4AF37" strokeWidth="2.5" />
      <rect x="18" y="18" width="6" height="6" fill="#D4AF37" />
      <rect x="36" y="14" width="14" height="14" rx="2" stroke="#D4AF37" strokeWidth="2.5" />
      <rect x="40" y="18" width="6" height="6" fill="#D4AF37" />
      <rect x="14" y="36" width="14" height="14" rx="2" stroke="#D4AF37" strokeWidth="2.5" />
      <rect x="18" y="40" width="6" height="6" fill="#D4AF37" />

      <circle cx="43" cy="43" r="3" fill="#D4AF37" />
      <rect x="34" y="34" width="4" height="4" fill="#D4AF37" />
      <rect x="44" y="34" width="4" height="4" fill="#D4AF37" />
    </svg>
  );
}
