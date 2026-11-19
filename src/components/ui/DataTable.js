export function DataTable({ rows, loading, query, onQueryChange, onRefresh, onEdit, onDelete }) {
  return (
    <section className="card" aria-label="Liste des régions">
      <div className="table-tools">
        <label>
          <span className="sr-only">Rechercher une région</span>
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Rechercher par nom ou adresse…" />
        </label>
        <button className="link-button" type="button" onClick={onRefresh}>Actualiser</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nom</th><th>Adresse</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="3" className="empty">Chargement des régions…</td></tr> : rows.length ? rows.map((region) => (
              <tr key={region.id}>
                <td><strong>{region.nom}</strong></td><td>{region.adresse}</td>
                <td className="actions"><button type="button" onClick={() => onEdit(region)}>Modifier</button><button className="danger-link" type="button" onClick={() => onDelete(region)}>Supprimer</button></td>
              </tr>
            )) : <tr><td colSpan="3" className="empty">Aucune région trouvée.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="count">{rows.length} région{rows.length !== 1 ? 's' : ''}</p>
    </section>
  );
}
