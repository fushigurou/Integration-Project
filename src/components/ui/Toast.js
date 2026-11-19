export function Toast({ message, onClose }) {
  if (!message) return null;
  return <div className="notice" role="status">{message}<button type="button" onClick={onClose} aria-label="Fermer">×</button></div>;
}
