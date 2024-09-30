import { Footer } from '@/components/LandingPage/Footer';
import { Header } from '@/components/LandingPage/Header';
import React from 'react'

const layout = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
  )
}

export default layout
