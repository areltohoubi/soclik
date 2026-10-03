import React from "react";

type SocialIconProps = {
  type: "linkedin" | "instagram" | "twitter";
  className?: string;
  color?: string;
};

export default function SocialIcon({
  type,
  className = "w-6 h-6",
  color = "currentColor",
}: SocialIconProps) {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    className,
    fill: color,
    "aria-hidden": true,
  };

  switch (type) {
    case "linkedin":
      return (
        <svg {...commonProps}>
          <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.68H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.57V8.99H3.56v11.46zM22.22 0H1.78C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.78 24h20.44c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...commonProps}>
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
          <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
          <circle cx="17.5" cy="6.5" r="1.25" />
        </svg>
      );

    case "twitter":
      return (
        <svg {...commonProps}>
          <path d="M23.5 4.7a9.6 9.6 0 0 1-2.8.77 4.9 4.9 0 0 0 2.15-2.7 9.8 9.8 0 0 1-3.1 1.18A4.9 4.9 0 0 0 11.3 8.4c0 .38.04.76.13 1.1A13.9 13.9 0 0 1 1.7 3.3a4.9 4.9 0 0 0 1.52 6.54A4.9 4.9 0 0 1 1 9.22v.06a4.9 4.9 0 0 0 3.93 4.8 4.9 4.9 0 0 1-2.2.08 4.9 4.9 0 0 0 4.58 3.4A9.85 9.85 0 0 1 1.2 19.67 13.9 13.9 0 0 0 8.73 21.9c9.03 0 13.97-7.48 13.97-13.97 0-.21 0-.43-.01-.64A10 10 0 0 0 23.5 4.7z" />
        </svg>
      );

    default:
      return null;
  }
}