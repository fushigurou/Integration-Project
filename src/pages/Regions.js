import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { Field } from '../components/ui/Field';
import { ConfirmModal, Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Toast } from '../components/ui/Toast';

const API_PATH = '/api/regions';
const emptyRegion = () => ({ id: '', nom: '', adresse: '' });
const toRegion = (region) => ({ ...region, id: String(region.id_r) });

async function api(path = '', options) {
  const response = await fetch(`${API_PATH}${path}`, {
    headers: { Accept: 'application/json', ...(options?.body ? { 'Content-Type': 'application/json' } : {}) },
    ...options,
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.message || Object.values(body?.errors || {}).flat().join(' ') || 'La requête a échoué.');
  return body;
}

export function Regions() {
  const [regions, setRegions] = useState([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const loadRegions = async () => {
    setLoading(true);
    try { setRegions((await api()).map(toRegion)); }
    catch (error) { setMessage(error.message || 'Impossible de joindre le backend Laravel.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadRegions(); }, []);

  const visibleRegions = useMemo(() => {
    const value = query.trim().toLocaleLowerCase('fr');
    return value ? regions.filter((region) => `${region.nom} ${region.adresse}`.toLocaleLowerCase('fr').includes(value)) : regions;
  }, [query, regions]);

  const save = async (event) => {
    event.preventDefault();
    const nom = form.nom.trim();
    const adresse = form.adresse.trim();
    const nextErrors = {
      ...(nom ? {} : { nom: 'Le nom est obligatoire.' }),
      ...(adresse ? {} : { adresse: 'L’adresse est obligatoire.' }),
    };
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage('Veuillez corriger les champs obligatoires.');
      return;
    }
    setErrors({});
    try {
      const saved = await api(form.id ? `/${form.id}` : '', { method: form.id ? 'PUT' : 'POST', body: JSON.stringify({ nom, adresse }) });
      setRegions((current) => form.id ? current.map((region) => region.id === form.id ? toRegion(saved) : region) : [...current, toRegion(saved)].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')));
      setMessage(form.id ? 'Région mise à jour dans la base de données.' : 'Région créée dans la base de données.');
      setForm(null);
    } catch (error) {
      setMessage(error.message || 'Erreur lors de l’enregistrement.');
    }
  };

  const remove = async () => {
    try {
      await api(`/${toDelete.id}`, { method: 'DELETE' });
      setRegions((current) => current.filter((region) => region.id !== toDelete.id));
      setToDelete(null);
      setMessage('Région supprimée de la base de données.');
    } catch (error) { setMessage(error.message || 'Suppression impossible.');

    }
  };

  return <AppLayout>
    <PageHeader onCreate={() => { setMessage(''); setErrors({}); setForm(emptyRegion()); }} />
    <Toast message={message} onClose={() => setMessage('')} />
    <DataTable rows={visibleRegions} loading={loading} query={query} onQueryChange={setQuery} onRefresh={loadRegions} onEdit={(region) => { setMessage(''); setErrors({}); setForm({ ...region }); }} onDelete={setToDelete} />
    {form && <Modal title={form.id ? 'Modifier la région' : 'Nouvelle région'} onClose={() => setForm(null)} footer={<><Button variant="secondary" type="button" onClick={() => setForm(null)}>Annuler</Button><Button className="primary" type="submit" form="region-form">Enregistrer</Button></>}>
      <form id="region-form" onSubmit={save}>
        <Field label="Nom" error={errors.nom}>
          <input autoFocus aria-invalid={Boolean(errors.nom)} className={errors.nom ? 'field-input-error' : ''} value={form.nom} onChange={(event) => { setForm({ ...form, nom: event.target.value }); setErrors((current) => ({ ...current, nom: '' })); }} />
        </Field>
        <Field label="Adresse" error={errors.adresse}>
          <input aria-invalid={Boolean(errors.adresse)} className={errors.adresse ? 'field-input-error' : ''} value={form.adresse} onChange={(event) => { setForm({ ...form, adresse: event.target.value }); setErrors((current) => ({ ...current, adresse: '' })); }} />
        </Field>
      </form>
    </Modal>}
    {toDelete && <ConfirmModal region={toDelete} onClose={() => setToDelete(null)} onConfirm={remove} />}
  </AppLayout>;
}
