import React from 'react';

export function FaBox({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M509.5 184.6L458.9 32.8C452.4 13.2 434.1 0 413.4 0H98.6c-20.7 0-39 13.2-45.5 32.8L2.5 184.6c-1.6 4.9-2.5 10-2.5 15.2V464c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V199.8c0-5.2-.9-10.3-2.5-15.2zM32 199.8L78.6 60c1.3-3.9 5-6 9.1-6h336.5c4.1 0 7.8 2.1 9.1 6L480 199.8H32z" />
    </svg>
  );
}

export function FaTshirt({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 640 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M624 96H480l-32-64H192l-32 64H16C7.2 96 0 103.2 0 112v80c0 8.8 7.2 16 16 16h64v272c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V208h64c8.8 0 16-7.2 16-16v-80c0-8.8-7.2-16-16-16zM320 128c-44.1 0-80-35.9-80-80h160c0 44.1-35.9 80-80 80z" />
    </svg>
  );
}

export function FaTruck({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 640 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 100v12z" />
    </svg>
  );
}

export function FaSyncAlt({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.1c-7.411 0-13.123-6.529-11.834-13.829C35.093 93.36 136.002 8 256.02 8c66.257 0 128.847 26.471 174.96 72.583L479.9 31.67c9.37-9.37 25.1-2.73 25.1 10.43V160c0 8.84-7.16 16-16 16H369.09c-13.16 0-19.8-15.73-10.43-25.1l12.06-12.06zM500.9 336H381.1c-8.84 0-16 7.16-16 16v117.9c0 13.16 15.73 19.8 25.1 10.43l12.06-12.06C433.542 497.992 474.112 514.038 517.152 514c77.458-.068 144.328-53.178 162.791-126.85 1.344-5.363 6.122-9.15 11.651-9.15h57.306c7.411 0 13.123 6.529 11.834 13.829C726.907 482.64 625.998 568 505.98 568c-66.257 0-128.847-26.471-174.96-72.583L282.1 544.33c-9.37 9.37-25.1 2.73-25.1-10.43V416c0-8.84 7.16-16 16-16h118.9c13.16 0 19.8 15.73 10.43 25.1l-12.06 12.06z" />
    </svg>
  );
}

export function FaTicketAlt({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 576 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M128 160h320v192H128V160zm400 96c0 26.5 21.5 48 48 48v96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32v-96c26.5 0 48-21.5 48-48s-21.5-48-48-48V112c0-17.7 14.3-32 32-32h512c17.7 0 32 14.3 32 32v96c-26.5 0-48 21.5-48 48zM96 128H64v256h32V128zm416 0h-32v256h32V128z" />
    </svg>
  );
}

export function FaEnvelope({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
    </svg>
  );
}

export function FaPhoneAlt({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" />
    </svg>
  );
}

export function FaHeadset({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M192 208c0-17.7-14.3-32-32-32h-16c-35.3 0-64 28.7-64 64v48c0 35.3 28.7 64 64 64h16c17.7 0 32-14.3 32-32V208zm192 0v112c0 17.7 14.3 32 32 32h16c35.3 0 64-28.7 64-64v-48c0-35.3-28.7-64-64-64h-16c-17.7 0-32 14.3-32 32zm-128-96c-88.4 0-160 71.6-160 160v16h-32c-17.7 0-32 14.3-32 32v48c0 17.7 14.3 32 32 32h32v16c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V112zm-32 288h-64c-8.8 0-16-7.2-16-16s7.2-16 16-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16z" />
    </svg>
  );
}

export function FaPaperPlane({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.4l82.7-97 119.7 46.2c13.7 5.3 28.8-3.5 30.6-18.1L511.9 28.7C513.7 13.9 493.5-3.3 476 3.2z" />
    </svg>
  );
}

export function FaUserShield({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 640 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm384 16c-48.4 0-93.5 16.4-129.5 44.1-1.3-.4-2.7-.9-4.1-1.4l-112-40c-15.2-5.4-32.3.9-39.7 14.8-1.7 3.3-2.7 7-2.7 10.8V448c0 35.3 28.7 64 64 64h224c35.3 0 64-28.7 64-64V272c0-35.3-28.7-64-64-64zm-32 192h-64v-64h64v64z" />
    </svg>
  );
}
