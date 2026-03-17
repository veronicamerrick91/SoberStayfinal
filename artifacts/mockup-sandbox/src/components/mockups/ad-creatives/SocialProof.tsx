import React from 'react';

export default function SocialProofAd() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0f172a] flex flex-col justify-between relative" style={{ padding: '8vw' }}>
      {/* Background Subtle Element: Rising Bar Chart */}
      <div className="absolute inset-0 opacity-10 flex items-end justify-end pointer-events-none" style={{ paddingRight: '8vw', paddingBottom: '8vw' }}>
        <div className="flex items-end" style={{ gap: '2vw' }}>
          <div className="bg-[#14b8a6] rounded-t-sm" style={{ width: '10vw', height: '20vh' }}></div>
          <div className="bg-[#14b8a6] rounded-t-sm" style={{ width: '10vw', height: '35vh' }}></div>
          <div className="bg-[#22c55e] rounded-t-sm" style={{ width: '10vw', height: '55vh' }}></div>
          <div className="bg-[#22c55e] rounded-t-sm" style={{ width: '10vw', height: '80vh' }}></div>
        </div>
      </div>

      {/* Top Section: Brand Anchor */}
      <div className="flex justify-between items-start z-10">
        <div className="font-['Outfit'] font-bold text-white tracking-wider opacity-90" style={{ fontSize: '3.5vw' }}>
          SoberStayHomes.com
        </div>
        <div className="flex items-center justify-center bg-[#14b8a6]/20 text-[#14b8a6] rounded-full font-['Inter'] font-semibold" style={{ padding: '1.5vw 4vw', fontSize: '3vw' }}>
          California
        </div>
      </div>

      {/* Middle Section: Main Copy */}
      <div className="flex flex-col z-10 mt-auto mb-auto" style={{ gap: '5vw' }}>
        <h1 className="font-['Outfit'] font-black text-white leading-tight" style={{ fontSize: '11.5vw' }}>
          <span className="text-[#14b8a6]">450+</span> Homes<br/>
          Already Listed
        </h1>
        
        <p className="font-['Inter'] text-gray-300 font-medium leading-normal w-[85%]" style={{ fontSize: '4.8vw' }}>
          California's fastest-growing directory. Your competitors are getting found online. <span className="text-white font-bold">Are you?</span>
        </p>
      </div>

      {/* Bottom Section: CTA */}
      <div className="z-10">
        <button className="bg-[#22c55e] text-white font-['Outfit'] font-bold rounded-xl flex items-center justify-center uppercase tracking-wide" style={{ padding: '4vw 8vw', fontSize: '5.5vw', width: 'fit-content' }}>
          Claim Your Listing
          <svg className="ml-[2vw]" style={{ width: '6vw', height: '6vw' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
