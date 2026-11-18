import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Directeur } from '../data/types'
import { Button } from '../components/ui/Button'
import { ConfirmModal, Modal } from '../components/ui/Modal'
import { DataTable } from '../components/ui/DataTable'
import { Field, Input, Select } from '../components/ui/Field'
import { PageHeader } from '../components/ui/PageHeader'

const empty = (): Directeur => ({
  id: '',
  nom: '',
  prenom: '',
  email: '',
  tel: '',
  adresse: '',
  cin: '',
  regionId: '',
})

export function Directeurs() {
  const { db, save, del, toast } = useApp()
  const [form, setForm] = useState<Directeur | null>(null)
  const [removeId, setRemoveId] = useState<string | null>(null)

  const rows = useMemo(() => db.drs, [db.drs])

  const submit = async () => {
    if (!form) return
    if (!form.nom || !form.prenom || !form.email || !form.regionId || !form.cin || !form.tel) {
      toast('Veuillez remplir les champs obligatoires.', 'error')
      return
    }
    try {
      await save('drs', { ...form, id: form.id || '' })
      toast(form.id ? 'Directeur mis à jour.' : 'Directeur créé.')
      setForm(null)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.', 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Directeurs régionaux"
        subtitle="Assignez un directeur à chaque région."
        actions={
          <Button onClick={() => setForm(empty())}>
            <Plus className="size-4" /> Nouveau directeur
          </Button>
        }
      />

      <DataTable
        rows={rows}
        searchKeys={[
          (d) => `${d.prenom} ${d.nom}`,
          (d) => d.email,
          (d) => db.regions.find((r) => r.id === d.regionId)?.nom ?? '',
        ]}
        columns={[
          {
            key: 'nom',
            header: 'Nom',
            render: (d) => (
              <span className="font-semibold text-slate-900">
                {d.prenom} {d.nom}
              </span>
            ),
          },
          { key: 'email', header: 'Email', render: (d) => d.email },
          { key: 'tel', header: 'Téléphone', render: (d) => d.tel },
          {
            key: 'region',
            header: 'Région',
            render: (d) => db.regions.find((r) => r.id === d.regionId)?.nom ?? '—',
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (d) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Modifier"
                  className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  onClick={() => setForm({ ...d })}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Supprimer"
                  className="cursor-pointer rounded-lg p-2 text-red-700 hover:bg-red-50"
                  onClick={() => setRemoveId(d.id)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={!!form}
        title={form?.id ? 'Modifier le directeur' : 'Nouveau directeur'}
        onClose={() => setForm(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setForm(null)}>
              Annuler
            </Button>
            <Button onClick={submit}>Enregistrer</Button>
          </>
        }
      >
        {form && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" required>
              <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
            </Field>
            <Field label="Nom" required>
              <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </Field>
            <Field label="Email" required>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Téléphone">
              <Input value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} />
            </Field>
            <Field label="CIN">
              <Input value={form.cin} onChange={(e) => setForm({ ...form, cin: e.target.value })} />
            </Field>
            <Field label="Région" required>
              <Select value={form.regionId} onChange={(e) => setForm({ ...form, regionId: e.target.value })}>
                <option value="">Choisir…</option>
                {db.regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nom}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Adresse">
              <Input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
            </Field>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!removeId}
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          if (removeId) {
            try {
              await del('drs', removeId)
              toast('Directeur supprimé.')
            } catch (e) {
              toast(e instanceof Error ? e.message : 'Suppression impossible.', 'error')
            }
          }
          setRemoveId(null)
        }}
      />
    </>
  )
}
