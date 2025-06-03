import React from 'react';
import { Metadata } from 'next';
import './overlay.css';
import '../[lang]/globals.css'; // Import global CSS with Tailwind

export const metadata: Metadata = {
  title: 'Chat Overlay - OBS Integration',
  description: 'Transparent chat overlay for OBS Studio integration',
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="overlay-body">
        {children}
      </body>
    </html>
  );
} 