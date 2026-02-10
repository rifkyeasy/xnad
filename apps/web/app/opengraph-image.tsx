import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'XNad - AI Trading Agent for Monad';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #06b6d4, #818cf8, #c084fc)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-2px',
              display: 'flex',
            }}
          >
            XNad
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: '#e2e8f0',
              fontWeight: 500,
              display: 'flex',
            }}
          >
            AI Trading Agent for Monad
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 20,
              color: '#94a3b8',
              maxWidth: 600,
              textAlign: 'center',
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            Social-powered automated trading on nad.fun
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 16,
            }}
          >
            {['X Profile Analysis', 'Auto Trading', 'Stop-Loss'].map((label) => (
              <div
                key={label}
                style={{
                  padding: '10px 24px',
                  borderRadius: 100,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  color: '#94a3b8',
                  fontSize: 16,
                  display: 'flex',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#475569',
            fontSize: 16,
          }}
        >
          <span>xnad.fun</span>
          <span style={{ display: 'flex' }}>|</span>
          <span>Powered by Monad</span>
          <span style={{ display: 'flex' }}>|</span>
          <span>nad.fun</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
