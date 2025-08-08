'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <h1>Test Page</h1>
      </main>
      <Footer />
    </div>
  );
}
