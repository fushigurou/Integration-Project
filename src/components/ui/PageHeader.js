export function PageHeader({ onCreate }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Administration nationale</p>
        <h1>Régions</h1>
        <p>Créez, modifiez et supprimez les régions de la STEG.</p>
      </div>
      <button className="primary" type="button" onClick={onCreate}>+ Nouvelle région</button>
    </header>
  );
}
