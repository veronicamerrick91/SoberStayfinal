import React from 'react';

export default function PainPoint() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0f172a] flex flex-col justify-center relative box-border" style={{ padding: '8vw' }}>
      {/* Abstract geometric accents (flat colors) */}
      <div className="absolute top-0 right-0 bg-[#14b8a6]" style={{ width: '40vw', height: '40vw', borderBottomLeftRadius: '100%' }}></div>
      <div className="absolute bottom-0 left-0 bg-[#22c55e]" style={{ width: '50vw', height: '50vw', borderTopRightRadius: '100%' }}></div>
      <div className="absolute top-[15vw] right-[45vw] bg-[#22c55e] rounded-full" style={{ width: '5vw', height: '5vw' }}></div>
      <div className="absolute bottom-[40vw] right-[15vw] bg-[#14b8a6] rounded-full" style={{ width: '8vw', height: '8vw' }}></div>

      <div className="relative z-10 flex flex-col" style={{ gap: '6vw' }}>
        <h1 className="font-['Outfit'] font-extrabold text-white uppercase leading-[0.9] tracking-tighter" style={{ fontSize: '18vw' }}>
          Empty<br/>
          <span className="text-[#14b8a6]">Beds?</span>
        </h1>

        <div className="bg-[#ffffff]" style={{ width: '15vw', height: '1.5vw' }}></div>

        <p className="font-['Inter'] text-white font-medium leading-[1.3] opacity-90" style={{ fontSize: '6vw', width: '75vw', maxWidth: '80vw' }}>
          Thousands search for sober living homes online every month.
          If you're not listed, they can't find you.
        </p>

        <div style={{ marginTop: '6vw' }}>
          <div className="bg-[#14b8a6] text-white font-['Outfit'] font-bold uppercase tracking-wide inline-flex items-center justify-center rounded-2xl" style={{ padding: '4vw 7vw', fontSize: '5.5vw' }}>
            List Your Home — $49/mo
          </div>
        </div>
      </div>

      <div className="absolute z-10 bottom-[6vw] right-[6vw] font-['Outfit'] text-white font-bold tracking-widest opacity-80" style={{ fontSize: '3vw' }}>
        SoberStayHomes.com
      </div>
    </div>
  );
}
