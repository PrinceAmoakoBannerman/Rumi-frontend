import { Component, type ReactNode } from 'react'

/**
 * Catches a crash anywhere in the shop and shows a calm page instead of the
 * blank white screen React leaves behind when a render throws.
 *
 * A class component because this is the one thing only a class can do — React
 * has no hook for it. The reload button is a plain anchor, so it works even if
 * the app's own router is what broke.
 */
interface State {
  failed: boolean
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    // Left for a real logger later; for now it reaches the browser console
    // so a problem is not completely silent.
    console.error('[shop] a render error was caught:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: 24,
          textAlign: 'center',
          background: '#FAF7F2',
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <p style={{ color: '#D3839E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
          GLOWWITHRUMI
        </p>
        <h1 style={{ color: '#2A2A2A', fontSize: 26, fontWeight: 500, margin: 0 }}>
          Something went wrong on our end
        </h1>
        <p style={{ color: '#4A4A4A', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: 0 }}>
          Sorry — the page ran into a problem. Reloading usually fixes it. If it
          keeps happening, message us on WhatsApp and we will sort it out.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="/"
            style={{
              background: '#2A2A2A',
              color: '#fff',
              textDecoration: 'none',
              padding: '13px 26px',
              borderRadius: 999,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Reload the shop
          </a>
          <a
            href="https://wa.me/233594469052"
            style={{
              border: '1px solid #D3839E',
              color: '#B85E75',
              textDecoration: 'none',
              padding: '13px 26px',
              borderRadius: 999,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Message us
          </a>
        </div>
      </div>
    )
  }
}
