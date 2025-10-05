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
import { Textarea } from "@/components/ui/textarea";

const centroCostoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  responsable: z.string().min(1, "El responsable es requerido"),
  descripcion: z.string().optional(),
});

type CentroCostoFormData = z.infer<typeof centroCostoSchema>;

interface CentroCosto extends CentroCostoFormData {
  id: string;
  bloqueado: boolean;
}

export default function CentrosDeCosto() {
  const { toast } = useToast();
  const [centros, setCentros] = useState<CentroCosto[]>([
    {
      id: "1",
      codigo: "CC001",
      nombre: "Administración",
      responsable: "Juan Pérez",
      descripcion: "Centro de costos para gastos administrativos",
      bloqueado: false,
    },
    {
      id: "2",
      codigo: "CC002",
      nombre: "Habitaciones",
      responsable: "María García",
      descripcion: "Centro de costos para habitaciones del hotel",
      bloqueado: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroCosto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const form = useForm<CentroCostoFormData>({
    resolver: zodResolver(centroCostoSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      responsable: "",
      descripcion: "",
    },
  });

  const filteredCentros = centros.filter((centro) =>
    centro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCentros.length / itemsPerPage);
  const paginatedCentros = filteredCentros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (data: CentroCostoFormData) => {
    if (editingCentro) {
      setCentros(
        centros.map((c) =>
          c.id === editingCentro.id
            ? { ...c, ...data }
            : c
        )
      );
      toast({
        title: "Centro de costo actualizado",
        description: "El centro de costo ha sido actualizado exitosamente",
      });
    } else {
      const newCentro: CentroCosto = {
        ...data,
        id: Date.now().toString(),
        bloqueado: false,
      };
      setCentros([...centros, newCentro]);
      toast({
        title: "Centro de costo creado",
        description: "El centro de costo ha sido creado exitosamente",
      });
    }
    setIsDialogOpen(false);
    setEditingCentro(null);
    form.reset();
  };

  const handleEdit = (centro: CentroCosto) => {
    setEditingCentro(centro);
    form.reset(centro);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCentros(centros.filter((c) => c.id !== id));
    setDeletingId(null);
    toast({
      title: "Centro de costo eliminado",
      description: "El centro de costo ha sido eliminado exitosamente",
      variant: "destructive",
    });
  };

  const handleToggleBloqueo = (id: string) => {
    setCentros(
      centros.map((c) =>
        c.id === id ? { ...c, bloqueado: !c.bloqueado } : c
      )
    );
    const centro = centros.find((c) => c.id === id);
    toast({
      title: centro?.bloqueado ? "Centro desbloqueado" : "Centro bloqueado",
      description: `El centro de costo ha sido ${centro?.bloqueado ? "desbloqueado" : "bloqueado"} exitosamente`,
    });
  };

  const handleAddNew = () => {
    setEditingCentro(null);
    form.reset({
      codigo: "",
      nombre: "",
      responsable: "",
      descripcion: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Centros de Costo</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los centros de costo del sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Centro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCentro ? "Editar Centro de Costo" : "Nuevo Centro de Costo"}
              </DialogTitle>
              <DialogDescription>
                {editingCentro
                  ? "Modifica los datos del centro de costo"
                  : "Ingresa los datos del nuevo centro de costo"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="CC001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Administración" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responsable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsable</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del centro de costo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingCentro ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centros de Costo</CardTitle>
          <CardDescription>
            Lista de centros de costo registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código, nombre o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCentros.map((centro) => (
                <TableRow key={centro.id}>
                  <TableCell className="font-medium">{centro.codigo}</TableCell>
                  <TableCell>{centro.nombre}</TableCell>
                  <TableCell>{centro.responsable}</TableCell>
                  <TableCell className="max-w-xs truncate">{centro.descripcion}</TableCell>
                  <TableCell>
                    {centro.bloqueado ? (
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
                        onClick={() => handleEdit(centro)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBloqueo(centro.id)}
                      >
                        <Lock className={`h-4 w-4 ${centro.bloqueado ? "text-destructive" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(centro.id)}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el centro de costo
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
