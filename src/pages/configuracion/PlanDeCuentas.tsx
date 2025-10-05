import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Lock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const cuentaSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.enum(["activo", "pasivo", "patrimonio", "ingreso", "gasto"]),
  naturaleza: z.enum(["debito", "credito"]),
  nivel: z.string().min(1, "El nivel es requerido"),
  cuentaPadre: z.string().optional(),
});

type CuentaFormData = z.infer<typeof cuentaSchema>;

interface Cuenta extends CuentaFormData {
  id: string;
  bloqueado: boolean;
}

export default function PlanDeCuentas() {
  const { toast } = useToast();
  const [cuentas, setCuentas] = useState<Cuenta[]>([
    {
      id: "1",
      codigo: "1105",
      nombre: "Caja",
      tipo: "activo",
      naturaleza: "debito",
      nivel: "4",
      cuentaPadre: "11",
      bloqueado: false,
    },
    {
      id: "2",
      codigo: "1110",
      nombre: "Bancos",
      tipo: "activo",
      naturaleza: "debito",
      nivel: "4",
      cuentaPadre: "11",
      bloqueado: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<Cuenta | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const form = useForm<CuentaFormData>({
    resolver: zodResolver(cuentaSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      tipo: "activo",
      naturaleza: "debito",
      nivel: "",
      cuentaPadre: "",
    },
  });

  const filteredCuentas = cuentas.filter((cuenta) => {
    const matchesSearch =
      cuenta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "todos" || cuenta.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const totalPages = Math.ceil(filteredCuentas.length / itemsPerPage);
  const paginatedCuentas = filteredCuentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (data: CuentaFormData) => {
    if (editingCuenta) {
      setCuentas(
        cuentas.map((c) =>
          c.id === editingCuenta.id
            ? { ...c, ...data }
            : c
        )
      );
      toast({
        title: "Cuenta actualizada",
        description: "La cuenta ha sido actualizada exitosamente",
      });
    } else {
      const newCuenta: Cuenta = {
        ...data,
        id: Date.now().toString(),
        bloqueado: false,
      };
      setCuentas([...cuentas, newCuenta]);
      toast({
        title: "Cuenta creada",
        description: "La cuenta ha sido creada exitosamente",
      });
    }
    setIsDialogOpen(false);
    setEditingCuenta(null);
    form.reset();
  };

  const handleEdit = (cuenta: Cuenta) => {
    setEditingCuenta(cuenta);
    form.reset(cuenta);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCuentas(cuentas.filter((c) => c.id !== id));
    setDeletingId(null);
    toast({
      title: "Cuenta eliminada",
      description: "La cuenta ha sido eliminada exitosamente",
      variant: "destructive",
    });
  };

  const handleToggleBloqueo = (id: string) => {
    setCuentas(
      cuentas.map((c) =>
        c.id === id ? { ...c, bloqueado: !c.bloqueado } : c
      )
    );
    const cuenta = cuentas.find((c) => c.id === id);
    toast({
      title: cuenta?.bloqueado ? "Cuenta desbloqueada" : "Cuenta bloqueada",
      description: `La cuenta ha sido ${cuenta?.bloqueado ? "desbloqueada" : "bloqueada"} exitosamente`,
    });
  };

  const handleAddNew = () => {
    setEditingCuenta(null);
    form.reset({
      codigo: "",
      nombre: "",
      tipo: "activo",
      naturaleza: "debito",
      nivel: "",
      cuentaPadre: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plan de Cuentas (PUC)</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona el plan único de cuentas contables
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCuenta ? "Editar Cuenta" : "Nueva Cuenta"}
              </DialogTitle>
              <DialogDescription>
                {editingCuenta
                  ? "Modifica los datos de la cuenta contable"
                  : "Ingresa los datos de la nueva cuenta contable"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input placeholder="1105" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nivel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel</FormLabel>
                        <FormControl>
                          <Input placeholder="4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Caja" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="pasivo">Pasivo</SelectItem>
                            <SelectItem value="patrimonio">Patrimonio</SelectItem>
                            <SelectItem value="ingreso">Ingreso</SelectItem>
                            <SelectItem value="gasto">Gasto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="naturaleza"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naturaleza</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona naturaleza" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="debito">Débito</SelectItem>
                            <SelectItem value="credito">Crédito</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="cuentaPadre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuenta Padre (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingCuenta ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cuentas Contables</CardTitle>
          <CardDescription>
            Lista de cuentas del plan único de cuentas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="pasivo">Pasivo</SelectItem>
                <SelectItem value="patrimonio">Patrimonio</SelectItem>
                <SelectItem value="ingreso">Ingreso</SelectItem>
                <SelectItem value="gasto">Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Naturaleza</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCuentas.map((cuenta) => (
                <TableRow key={cuenta.id}>
                  <TableCell className="font-medium">{cuenta.codigo}</TableCell>
                  <TableCell>{cuenta.nombre}</TableCell>
                  <TableCell className="capitalize">{cuenta.tipo}</TableCell>
                  <TableCell className="capitalize">{cuenta.naturaleza}</TableCell>
                  <TableCell>{cuenta.nivel}</TableCell>
                  <TableCell>
                    {cuenta.bloqueado ? (
                      <span className="text-destructive">Bloqueado</span>
                    ) : (
                      <span className="text-green-600">Activo</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(cuenta)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBloqueo(cuenta.id)}
                      >
                        <Lock className={`h-4 w-4 ${cuenta.bloqueado ? "text-destructive" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(cuenta.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Label>Mostrar</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Label>registros por página</Label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
