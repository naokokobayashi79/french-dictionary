"use client";

import { useState, useId } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const contentId = `accordion-content-${id}`;
  const buttonId = `accordion-button-${id}`;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`transition-all duration-200 ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-4 py-3">{children}</div>
      </div>
    </div>
  );
}
