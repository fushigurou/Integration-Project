export function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>STEG</span> Missions</div>
        <nav aria-label="Navigation principale">
          <span className="nav-item active">Régions</span>
        </nav>
        <p className="test-mode">Mode test · API Laravel</p>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}