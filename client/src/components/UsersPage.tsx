'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, fetchUsers, updateUser, User } from "@/lib/api";

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phoneNumber: ""
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la información");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const isEditMode = useMemo(() => selectedId !== null, [selectedId]);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setSelectedId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      if (isEditMode && selectedId !== null) {
        await updateUser(selectedId, form);
      } else {
        await createUser(form);
      }
      await loadUsers();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(user: User) {
    setSelectedId(user.id);
    setForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm("¿Eliminar este usuario?");
    if (!confirmDelete) {
      return;
    }
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">Usuarios</h1>
        <p className="text-sm text-slate-600">Administra los usuarios creados en el backend</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Correo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Teléfono</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading && (
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-500" colSpan={4}>
                      Cargando...
                    </td>
                  </tr>
                )}
                {!loading && users.length === 0 && (
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-500" colSpan={4}>
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
                {!loading &&
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-900">{user.fullName}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{user.phoneNumber}</td>
                      <td className="px-4 py-4 text-sm text-right">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="mr-2 rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="rounded bg-rose-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-rose-700"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{isEditMode ? "Editar usuario" : "Crear usuario"}</h2>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Nombre completo</span>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ej. María Pérez"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Correo</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="correo@ejemplo.com"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>Teléfono</span>
              <input
                type="tel"
                required
                value={form.phoneNumber}
                onChange={(event) => handleChange("phoneNumber", event.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="999999999"
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isEditMode ? "Guardar cambios" : "Crear"}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
