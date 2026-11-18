import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Region } from '../data/types'
import { Button } from '../components/ui/Button'
import { ConfirmModal, Modal } from '../components/ui/Modal'
import { DataTable } from '../components/ui/DataTable'
import { Field, Input } from '../components/ui/Field'
import { PageHeader } from '../components/ui/PageHeader'

const empty = (): Region => ({ id: '', nom: '', adresse: '' })

export function Regions() {
  const { db, save, del, toast } = useApp()
  const [form, setForm] = useState<Region | null>(null)
  const [removeId, setRemoveId] = useState<string | null>(null)

  const openNew = () => setForm(empty())
  const openEdit = (r: Region) => setForm({ ...r })

  const submit = async () => {
    if (!form) return
    if (!form.nom.trim() || !form.adresse.trim()) {
      toast('Veuillez remplir tous les champs.', 'error')
      return
    }
    try {
      await save('regions', {
        ...form,
        id: form.id || '',
        nom: form.nom.trim(),
        adresse: form.adresse.trim(),
      })
      toast(form.id ? 'Région mise à jour.' : 'Région créée.')
      setForm(null)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.', 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Régions"
        subtitle="Gérez les régions de la STEG."
        actions={
          <Button onClick={openNew}>
            <Plus className="size-4" /> Nouvelle région
          </Button>
        }
      />

      <DataTable
        rows={db.regions}
        searchKeys={[(r) => r.nom, (r) => r.adresse]}
        columns={[
          {
            key: 'nom',
            header: 'Nom',
            render: (r) => <span className="font-semibold text-slate-900">{r.nom}</span>,
          },
          { key: 'adresse', header: 'Adresse', render: (r) => r.adresse },
          {
            key: 'vehicles',
            header: 'Véhicules',
            render: (r) => db.vehicles.filter((v) => v.regionId === r.id).length,
          },
          {
            key: 'dr',
            header: 'Directeur régional',
            render: (r) => {
              const dr = db.drs.find((d) => d.regionId === r.id)
              return dr ? `${dr.prenom} ${dr.nom}` : 'Non assigné'
            },
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (r) => (
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  aria-label="Modifier"
                  title="Modifier"
                  onClick={() => openEdit(r)}
                  className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Supprimer"
                  title="Supprimer"
                  onClick={() => setRemoveId(r.id)}
                  className="cursor-pointer rounded-lg p-2 text-red-700 hover:bg-red-50"
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
        title={form?.id ? 'Modifier la région' : 'Nouvelle région'}
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
          <div className="space-y-4">
            <Field label="Nom" required>
              <Input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </Field>
            <Field label="Adresse" required>
              <Input
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              />
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
              await del('regions', removeId)
              toast('Région supprimée.')
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
