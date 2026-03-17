import React from 'react';

export default function FoundingMemberAd() {
  return (
    <div 
      className="w-screen h-screen overflow-hidden flex flex-col justify-between relative font-['Inter']"
      style={{ backgroundColor: '#0f172a', padding: '8vw' }}
    >
      {/* Top Banner & Brand */}
      <div className="flex justify-between items-start w-full z-10">
        <div 
          className="font-['Outfit'] font-black tracking-widest uppercase" 
          style={{ fontSize: '3.5vw', color: '#14b8a6' }}
        >
          Sober Stay Homes
        </div>
        <div 
          className="font-bold uppercase tracking-widest rounded-sm" 
          style={{ 
            backgroundColor: '#f59e0b', 
            color: '#ffffff', 
            fontSize: '2.5vw', 
            padding: '1vw 3vw',
          }}
        >
          Limited Spots
        </div>
      </div>
      
      <div className="flex flex-col flex-1 justify-center z-10" style={{ gap: '6vw' }}>
        
        {/* Headline */}
        <div className="font-['Outfit'] font-black leading-[1.1] text-white flex flex-col uppercase" style={{ fontSize: '16vw' }}>
          <span>3 Months</span>
          <span style={{ color: '#f59e0b' }}>FREE</span>
        </div>

        {/* Price cross-out */}
        <div className="flex items-center font-bold font-['Outfit']" style={{ gap: '4vw', fontSize: '6vw' }}>
          <span className="line-through opacity-50 text-white decoration-[0.5vw]">$49/mo</span>
          <span style={{ color: '#22c55e' }}>FREE for 3 months</span>
        </div>

        {/* Sub-text */}
        <div className="text-white font-medium leading-relaxed opacity-95" style={{ fontSize: '4.5vw', maxWidth: '85vw' }}>
          First 50 providers get 3 months free + 50% off for life.<br/>
          <span style={{ color: '#f59e0b' }}>Only a few spots left.</span>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <button 
            className="font-bold text-white rounded-xl flex items-center justify-center font-['Outfit'] uppercase tracking-wide w-full"
            style={{ 
              backgroundColor: '#14b8a6', 
              padding: '6vw', 
              fontSize: '6.5vw',
            }}
          >
            Claim Your Spot
          </button>
        </div>
      </div>

      {/* Brand Anchor Bottom */}
      <div className="absolute right-[8vw] bottom-[8vw] opacity-50 text-white font-medium tracking-wide" style={{ fontSize: '3vw' }}>
        SoberStayHomes.com
      </div>
      
    </div>
  );
}
