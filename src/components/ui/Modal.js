import { Button } from './Button';

export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="overlay" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-heading"><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Fermer">×</button></div>
        {children}
        {footer && <div className="modal-actions">{footer}</div>}
      </section>
    </div>
  );
}

export function ConfirmModal({ region, onClose, onConfirm }) {
  return (
    <Modal
      title="Supprimer la région ?"
      onClose={onClose}
      footer={<><Button variant="secondary" type="button" onClick={onClose}>Annuler</Button><Button variant="danger" type="button" onClick={onConfirm}>Supprimer</Button></>}
    >
      <p>Voulez-vous vraiment supprimer <strong>{region.nom}</strong> ? Cette action est irréversible.</p>
      <p className="hint">La suppression sera refusée par le backend lorsqu’une région possède des données liées.</p>
    </Modal>
  );
}
