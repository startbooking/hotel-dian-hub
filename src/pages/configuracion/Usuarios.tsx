import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, KeyRound, Lock, Unlock, UserPlus, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

type Rol = "admin" | "contador" | "auxiliar" | "consultor";
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  bloqueado: boolean;
  ultimoAcceso: string;
}

const ROLES: Rol[] = ["admin", "contador", "auxiliar", "consultor"];

const MOCK: Usuario[] = [
  { id: "1", nombre: "Ana López", email: "ana@hotel.co", rol: "admin", bloqueado: false, ultimoAcceso: "2026-05-28" },
  { id: "2", nombre: "Carlos Pérez", email: "carlos@hotel.co", rol: "contador", bloqueado: false, ultimoAcceso: "2026-05-27" },
  { id: "3", nombre: "Diana Ruiz", email: "diana@hotel.co", rol: "auxiliar", bloqueado: true, ultimoAcceso: "2026-04-15" },
  { id: "4", nombre: "Jorge Mesa", email: "jorge@hotel.co", rol: "consultor", bloqueado: false, ultimoAcceso: "2026-05-20" },
];

type DialogMode = null | "create" | "edit" | "password";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK);
  const [mode, setMode] = useState<DialogMode>(null);
  const [current, setCurrent] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", rol: "auxiliar" as Rol });
  const [password, setPassword] = useState({ nueva: "", confirmar: "" });

  const openCreate = () => {
    setCurrent(null);
    setForm({ nombre: "", email: "", rol: "auxiliar" });
    setMode("create");
  };
  const openEdit = (u: Usuario) => {
    setCurrent(u);
    setForm({ nombre: u.nombre, email: u.email, rol: u.rol });
    setMode("edit");
  };
  const openPassword = (u: Usuario) => {
    setCurrent(u);
    setPassword({ nueva: "", confirmar: "" });
    setMode("password");
  };

  const toggleBloqueo = (u: Usuario) => {
    setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, bloqueado: !x.bloqueado } : x)));
    toast.success(u.bloqueado ? `Usuario ${u.nombre} desbloqueado` : `Usuario ${u.nombre} bloqueado`);
  };

  const saveUser = () => {
    if (!form.nombre || !form.email) {
      toast.error("Nombre y email son obligatorios");
      return;
    }
    if (mode === "create") {
      setUsuarios((prev) => [
        ...prev,
        { id: String(Date.now()), ...form, bloqueado: false, ultimoAcceso: "—" },
      ]);
      toast.success("Usuario creado");
    } else if (mode === "edit" && current) {
      setUsuarios((prev) => prev.map((x) => (x.id === current.id ? { ...x, ...form } : x)));
      toast.success("Usuario actualizado");
    }
    setMode(null);
  };

  const savePassword = () => {
    if (!password.nueva || password.nueva.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password.nueva !== password.confirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    toast.success(`Contraseña actualizada para ${current?.nombre}`);
    setMode(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UsersIcon className="h-7 w-7 text-primary" />
            Usuarios
          </h1>
          <p className="text-muted-foreground">Gestiona los usuarios y sus permisos</p>
        </div>
        <Button onClick={openCreate}>
          <UserPlus className="h-4 w-4" />
          Adicionar usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.rol}</TableCell>
                  <TableCell>
                    {u.bloqueado ? (
                      <Badge variant="destructive">Bloqueado</Badge>
                    ) : (
                      <Badge variant="secondary">Activo</Badge>
                    )}
                  </TableCell>
                  <TableCell>{u.ultimoAcceso}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                        <Pencil className="h-4 w-4" /> Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openPassword(u)}>
                        <KeyRound className="h-4 w-4" /> Contraseña
                      </Button>
                      <Button
                        size="sm"
                        variant={u.bloqueado ? "secondary" : "destructive"}
                        onClick={() => toggleBloqueo(u)}
                      >
                        {u.bloqueado ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        {u.bloqueado ? "Desbloquear" : "Bloquear"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={mode === "create" || mode === "edit"} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Adicionar usuario" : "Editar usuario"}</DialogTitle>
            <DialogDescription>Complete la información del usuario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={form.rol} onValueChange={(v) => setForm({ ...form, rol: v as Rol })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode(null)}>Cancelar</Button>
            <Button onClick={saveUser}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mode === "password"} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>{current?.nombre} ({current?.email})</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nueva contraseña</Label>
              <Input type="password" value={password.nueva} onChange={(e) => setPassword({ ...password, nueva: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Confirmar contraseña</Label>
              <Input type="password" value={password.confirmar} onChange={(e) => setPassword({ ...password, confirmar: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode(null)}>Cancelar</Button>
            <Button onClick={savePassword}>Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
