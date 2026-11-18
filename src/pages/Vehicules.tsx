import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Vehicle, VehicleEtat } from '../data/types'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import { ConfirmModal, Modal } from '../components/ui/Modal'
import { DataTable } from '../components/ui/DataTable'
import { Field, Input, Select } from '../components/ui/Field'
import { PageHeader } from '../components/ui/PageHeader'

const empty = (regionId = ''): Vehicle => ({
  id: '',
  matricule: '',
  marque: '',
  regionId,
  etat: 'AVAILABLE',
})

export function Vehicules() {
  const { db, save, del, toast, scopedRegionId, session } = useApp()
  const [form, setForm] = useState<Vehicle | null>(null)
  const [removeId, setRemoveId] = useState<string | null>(null)

  const rows = useMemo(
    () => db.vehicles.filter((v) => !scopedRegionId || v.regionId === scopedRegionId),
    [db.vehicles, scopedRegionId],
  )

  const submit = async () => {
    if (!form) return
    if (!form.matricule || !form.marque || !form.regionId) {
      toast('Veuillez remplir les champs obligatoires.', 'error')
      return
    }
    try {
      await save('vehicles', { ...form, id: form.id || '' })
      toast(form.id ? 'Véhicule mis à jour.' : 'Véhicule ajouté.')
      setForm(null)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.', 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Véhicules"
        subtitle="Parc véhicules de la STEG."
        actions={
          <Button
            onClick={() =>
              setForm(empty(session?.role === 'dr' ? session.regionId ?? '' : ''))
            }
          >
            <Plus className="size-4" /> Nouveau véhicule
          </Button>
        }
      />

      <DataTable
        rows={rows}
        searchKeys={[
          (v) => v.matricule,
          (v) => v.marque,
          (v) => db.regions.find((r) => r.id === v.regionId)?.nom ?? '',
        ]}
        columns={[
          {
            key: 'matricule',
            header: 'Matricule',
            render: (v) => <span className="font-semibold text-slate-900">{v.matricule}</span>,
          },
          { key: 'marque', header: 'Marque', render: (v) => v.marque },
          {
            key: 'region',
            header: 'Région',
            render: (v) => db.regions.find((r) => r.id === v.regionId)?.nom ?? '—',
          },
          {
            key: 'etat',
            header: 'État',
            render: (v) => <StatusBadge s={v.etat} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (v) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Modifier"
                  className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  onClick={() => setForm({ ...v })}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Supprimer"
                  className="cursor-pointer rounded-lg p-2 text-red-700 hover:bg-red-50"
                  onClick={() => setRemoveId(v.id)}
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
        title={form?.id ? 'Modifier le véhicule' : 'Nouveau véhicule'}
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
            <Field label="Matricule" required>
              <Input
                value={form.matricule}
                onChange={(e) => setForm({ ...form, matricule: e.target.value })}
              />
            </Field>
            <Field label="Marque" required>
              <Input
                value={form.marque}
                onChange={(e) => setForm({ ...form, marque: e.target.value })}
              />
            </Field>
            <Field label="Région" required>
              <Select
                value={form.regionId}
                disabled={session?.role === 'dr'}
                onChange={(e) => setForm({ ...form, regionId: e.target.value })}
              >
                <option value="">Choisir…</option>
                {db.regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nom}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="État">
              <Select
                value={form.etat}
                onChange={(e) => setForm({ ...form, etat: e.target.value as VehicleEtat })}
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="ON_MISSION">En mission</option>
                <option value="UNDER_MAINTENANCE">En maintenance</option>
                <option value="UNAVAILABLE">Indisponible</option>
              </Select>
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
              await del('vehicles', removeId)
              toast('Véhicule supprimé.')
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
