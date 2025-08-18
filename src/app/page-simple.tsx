'use client';

import React from 'react';

export default function HomePage() {
  return React.createElement('div', { className: 'container mx-auto p-8' }, 
    React.createElement('h1', { className: 'text-4xl font-bold' }, 'Simple Test Page'),
    React.createElement('p', null, 'This is a test using React.createElement')
  );
}
