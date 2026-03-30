import React from 'react';

export default function ProviderClaim() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Outfit', sans-serif",
    }}>
      {/* Full-bleed hero image */}
      <img
        src="/__mockup/images/ad-provider-claim.png"
        alt="California sober living home"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Top gradient for logo readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '35%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
      }} />

      {/* Bottom gradient for text readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
      }} />

      {/* Top-left logo */}
      <div style={{
        position: 'absolute',
        top: '5vw',
        left: '5vw',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5vw',
      }}>
        {/* Teal dot accent */}
        <div style={{
          width: '2.5vw',
          height: '2.5vw',
          borderRadius: '50%',
          background: '#14b8a6',
        }} />
        <span style={{
          color: 'white',
          fontSize: '3.2vw',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
        }}>
          SoberStayHomes.com
        </span>
      </div>

      {/* "UNCLAIMED" badge — top right */}
      <div style={{
        position: 'absolute',
        top: '5vw',
        right: '5vw',
        zIndex: 10,
        background: '#f59e0b',
        color: 'white',
        fontSize: '2.8vw',
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '1.5vw 3vw',
        borderRadius: '1.5vw',
      }}>
        Unclaimed
      </div>

      {/* Main text block — bottom */}
      <div style={{
        position: 'absolute',
        bottom: '6vw',
        left: '6vw',
        right: '6vw',
        zIndex: 10,
      }}>
        {/* Eyebrow */}
        <p style={{
          color: '#14b8a6',
          fontSize: '3.5vw',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '2vw',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}>
          Your facility is already on our site
        </p>

        {/* Headline */}
        <h1 style={{
          color: 'white',
          fontSize: '13vw',
          fontWeight: 900,
          lineHeight: 0.92,
          margin: '0 0 3vw 0',
          textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          letterSpacing: '-0.02em',
        }}>
          CLAIM<br />
          <span style={{ color: '#14b8a6' }}>IT FREE</span>
        </h1>

        {/* Subtext */}
        <p style={{
          color: 'rgba(255,255,255,0.88)',
          fontSize: '4.8vw',
          fontWeight: 400,
          lineHeight: 1.35,
          marginBottom: '5vw',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          500+ tenants searching your city right now.
        </p>

        {/* CTA */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2vw',
          background: '#14b8a6',
          color: 'white',
          fontSize: '5vw',
          fontWeight: 800,
          padding: '3.5vw 6vw',
          borderRadius: '2vw',
          letterSpacing: '0.02em',
        }}>
          Claim Your Listing →
        </div>
      </div>
    </div>
  );
}
