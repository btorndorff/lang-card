import React from "react";

const AudioIcon = ({
  color = "currentColor",
  className = "",
  size = 22,
}: {
  color?: string;
  className?: string;
  size?: number;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} inline-block align-middle`}
    >
      <g transform="translate(0, 2)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5379 0.326427C19.3027 -0.0184387 18.8377 -0.103612 18.4994 0.136188C18.1611 0.375988 18.0776 0.849954 18.3128 1.19482C19.7166 3.25284 20.5081 5.98228 20.5081 8.94218C20.5081 11.9023 19.7165 14.6327 18.3128 16.6906C18.0776 17.0354 18.1611 17.5094 18.4994 17.7492C18.8377 17.989 19.3027 17.9038 19.5379 17.5589C21.1206 15.2387 22.0002 12.2045 22.0002 8.94218C22.0002 5.68003 21.1207 2.64684 19.5379 0.326427ZM9.53136 0.260645L9.6863 0.2546L9.8274 0.256135C10.8374 0.305551 11.701 1.06459 12.0316 2.19016C12.1236 2.54903 12.1757 2.90001 12.2363 3.47137L12.3169 4.22015C12.4793 5.95588 12.4741 12.774 12.3015 14.1796L12.1943 15.1876C12.152 15.5275 12.1036 15.789 12.0245 16.0891C11.6829 17.252 10.7402 18.0311 9.69788 17.999C9.16733 18.0124 8.52122 17.7372 8.07177 17.3519L4.53033 14.4192L2.70765 14.4197C1.36492 14.4197 0.408561 13.5009 0.173654 12.0992L0.147133 11.9137C-0.0517828 10.4723 -0.0456035 7.85186 0.14705 6.27666C0.339841 4.8715 1.34653 3.83485 2.70765 3.83485L4.52934 3.83428L7.98246 0.965847C8.4005 0.604856 9.02436 0.307939 9.53136 0.260645ZM9.70129 1.77499L9.66348 1.77514C9.54305 1.7725 9.15611 1.94588 8.93611 2.13569L5.26654 5.18492C5.1334 5.29555 4.9669 5.35596 4.79514 5.35596H2.70765C2.14233 5.35596 1.72047 5.79038 1.62631 6.47606C1.45078 7.91186 1.44492 10.3986 1.62661 11.7161C1.72092 12.5088 2.10288 12.8986 2.70765 12.8986H4.79514C4.96645 12.8986 5.13254 12.9587 5.26551 13.0688L9.02223 16.1793C9.22228 16.3508 9.5297 16.4817 9.70129 16.4785C10.0719 16.4895 10.4381 16.1868 10.5891 15.6739C10.6677 15.3752 10.7086 15.0959 10.7592 14.5823L10.7923 14.2481L10.8206 13.993C10.9834 12.6666 10.9834 5.58792 10.8203 4.25925L10.7143 3.29586C10.6893 3.09255 10.665 2.93148 10.638 2.79338L10.5951 2.60105C10.4381 2.06725 10.0714 1.76398 9.70129 1.77499ZM15.0863 3.23974C15.4246 2.99996 15.8895 3.08516 16.1247 3.43004C17.141 4.92009 17.7037 6.86075 17.7037 8.94269C17.7037 11.0244 17.1411 12.9641 16.1247 14.4543C15.8895 14.7992 15.4246 14.8844 15.0863 14.6446C14.7479 14.4048 14.6644 13.9309 14.8996 13.586C15.737 12.3581 16.2115 10.7222 16.2115 8.94269C16.2115 7.16297 15.7369 5.52602 14.8996 4.29836C14.6644 3.95348 14.7479 3.47952 15.0863 3.23974Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export const AudioButton = ({
  audioData,
  color = "#000",
  size = 22,
  className = "",
  iconClassName = "",
}: {
  audioData: string;
  color?: string;
  size?: number;
  className?: string;
  iconClassName?: string;
}) => {
  const playAudio = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (audioData) {
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
      audio.play();
    }
  };

  return (
    <button
      onClick={playAudio}
      className={`flex items-center justify-center ${className}`}
      disabled={!audioData}
    >
      <AudioIcon color={color} size={size} className={iconClassName} />
    </button>
  );
};
