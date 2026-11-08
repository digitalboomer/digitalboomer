import React from 'react';
import { LayoutGrid, MessagesSquare } from 'lucide-react';

interface OfficialTopicIconProps {
  topicId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OfficialTopicIcon: React.FC<OfficialTopicIconProps> = ({
  topicId,
  size = 'md',
  className = '',
}) => {
  const pixelSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const containerSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  // 1. WhatsApp: Official authentic WhatsApp emblem
  if (topicId === 'whatsapp' || topicId === 'whatsapp-communication') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        aria-hidden="true"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Official WhatsApp Logo"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.472.677 4.787 1.854 6.773L3 29.333l6.733-1.488A13.25 13.25 0 0016 29.333c7.364 0 13.333-5.97 13.333-13.333S23.364 2.667 16 2.667z"
            fill="#25D366"
          />
          <path
            d="M22.84 19.347c-.373-.187-2.2-1.085-2.542-1.209-.341-.125-.59-.187-.838.187-.249.373-.965 1.209-1.183 1.458-.217.249-.435.28-.808.093-.373-.187-1.574-.58-3-1.852-1.109-.989-1.857-2.21-2.075-2.584-.218-.373-.023-.575.163-.76.168-.168.373-.435.56-.653.186-.218.248-.373.373-.622.124-.249.062-.467-.031-.653-.094-.187-.839-2.022-1.15-2.768-.303-.728-.61-.629-.838-.641-.217-.01-.466-.013-.715-.013-.249 0-.653.093-.995.466-.342.373-1.306 1.276-1.306 3.111 0 1.835 1.337 3.608 1.523 3.857.187.249 2.632 4.019 6.376 5.635.89.385 1.585.614 2.127.786.894.284 1.708.244 2.351.148.718-.107 2.2-1.002 2.51-1.968.311-.967.311-1.797.218-1.968-.093-.171-.342-.265-.715-.452z"
            fill="#FFFFFF"
          />
        </svg>
      </span>
    );
  }

  // 2. Digital Safety: Shield with verified checkmark
  if (topicId === 'sicherheit' || topicId === 'safety') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${containerSize} rounded-lg bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] dark:text-teal-400 ${className}`}
        aria-hidden="true"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Digital Safety Shield Icon"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#176B68" fillOpacity="0.15" />
          <path d="M9 12l2 2 4-4" stroke="#176B68" strokeWidth="2.5" />
        </svg>
      </span>
    );
  }

  // 3. Online Banking: Pillar bank building / secure payment
  if (topicId === 'banking' || topicId === 'online-banking') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${containerSize} rounded-lg bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 ${className}`}
        aria-hidden="true"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Online Banking Bank Building Icon"
        >
          <path d="M3 21h18" />
          <path d="M3 10h18" />
          <path d="M5 6l7-3 7 3" />
          <path d="M4 10v11" />
          <path d="M20 10v11" />
          <path d="M8 14v4" />
          <path d="M12 14v4" />
          <path d="M16 14v4" />
        </svg>
      </span>
    );
  }

  // 4. Everyday AI: Smart cognitive chip / assistant robot
  if (topicId === 'ki' || topicId === 'ai' || topicId === 'chatgpt') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${containerSize} rounded-lg bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] dark:text-teal-300 ${className}`}
        aria-hidden="true"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Artificial Intelligence Icon"
        >
          <rect x="3" y="11" width="18" height="10" rx="3" fill="#176B68" fillOpacity="0.15" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <circle cx="8.5" cy="16" r="1.5" fill="currentColor" />
          <circle cx="15.5" cy="16" r="1.5" fill="currentColor" />
          <path d="M9 19h6" />
        </svg>
      </span>
    );
  }

  // 5. Social Media: Community network & connect
  if (topicId === 'social-media' || topicId === 'social') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${containerSize} rounded-lg bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 ${className}`}
        aria-hidden="true"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Social Media Icon"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </span>
    );
  }

  // 6. E-Mail: Readable letter envelope
  if (topicId === 'email' || topicId === 'mail') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${containerSize} rounded-lg bg-[#EAF2F8] dark:bg-slate-800 text-[#17324D] dark:text-teal-300 ${className}`}
        aria-hidden="true"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="E-Mail Icon"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </span>
    );
  }

  // Other messaging apps
  if (topicId === 'messaging') {
    return (
      <span className={`inline-flex items-center justify-center shrink-0 ${containerSize} rounded-lg bg-[#EAF2F8] dark:bg-slate-800 text-[#176B68] dark:text-teal-300 ${className}`} aria-hidden="true">
        <MessagesSquare size={pixelSize} />
      </span>
    );
  }

  return <LayoutGrid size={pixelSize} aria-hidden="true" className={`text-[#176B68] ${className}`} />;
};
