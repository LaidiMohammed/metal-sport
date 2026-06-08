'use client';

import Image from 'next/image';

interface MetalLogoProps {
  variant?: 'navbar' | 'hero' | 'splash';
  showLabel?: boolean;
}

export function MetalSportLogo({ variant = 'navbar', showLabel = true }: MetalLogoProps) {
  if (variant === 'navbar') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          overflow: 'hidden',
          border: '2px solid rgba(0, 180, 216, 0.3)',
          flexShrink: 0,
        }}>
          <Image
            src="/images/logo.jpg"
            alt="Metal Sport Gym"
            width={40}
            height={40}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </div>
        {showLabel && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{
              fontWeight: 900,
              fontSize: '1.1rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}>
              METAL SPORT GYM
            </span>
            <span style={{
              fontWeight: 600,
              fontSize: '0.5rem',
              color: '#00b4d8',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              PREMIUM FITNESS
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Image
          src="/images/logo.jpg"
          alt="Metal Sport Gym"
          width={120}
          height={120}
          style={{ borderRadius: '50%', border: '2px solid rgba(0, 180, 216, 0.3)', boxShadow: '0 8px 30px rgba(0,180,216,0.15)' }}
        />
        {showLabel && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '2.5rem', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 }}>
              METAL SPORT GYM
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#00b4d8', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: '6px' }}>
              PREMIUM FITNESS
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <Image
        src="/images/logo.jpg"
        alt="Metal Sport Gym"
        width={180}
        height={180}
        style={{ borderRadius: '50%', border: '3px solid rgba(0, 180, 216, 0.3)', boxShadow: '0 12px 40px rgba(0,180,216,0.2)' }}
      />
    </div>
  );
}

export default MetalSportLogo;
