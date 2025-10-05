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

const tipoDocumentoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  prefijo: z.string().min(1, "El prefijo es requerido"),
  consecutivoInicial: z.string().min(1, "El consecutivo inicial es requerido"),
  consecutivoActual: z.string().min(1, "El consecutivo actual es requerido"),
  descripcion: z.string().optional(),
});

type TipoDocumentoFormData = z.infer<typeof tipoDocumentoSchema>;

interface TipoDocumento extends TipoDocumentoFormData {
  id: string;
  bloqueado: boolean;
}

export default function TiposDocumentos() {
  const { toast } = useToast();
  const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([
    {
      id: "1",
      codigo: "FV",
      nombre: "Factura de Venta",
      prefijo: "FV",
      consecutivoInicial: "1",
      consecutivoActual: "150",
      descripcion: "Documento de venta a clientes",
      bloqueado: false,
    },
    {
      id: "2",
      codigo: "RC",
      nombre: "Recibo de Caja",
      prefijo: "RC",
      consecutivoInicial: "1",
      consecutivoActual: "85",
      descripcion: "Recibo de ingresos en efectivo",
      bloqueado: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoDocumento | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const form = useForm<TipoDocumentoFormData>({
    resolver: zodResolver(tipoDocumentoSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      prefijo: "",
      consecutivoInicial: "",
      consecutivoActual: "",
      descripcion: "",
    },
  });

  const filteredTipos = tiposDocumentos.filter((tipo) =>
    tipo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.prefijo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTipos.length / itemsPerPage);
  const paginatedTipos = filteredTipos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (data: TipoDocumentoFormData) => {
    if (editingTipo) {
      setTiposDocumentos(
        tiposDocumentos.map((t) =>
          t.id === editingTipo.id
            ? { ...t, ...data }
            : t
        )
      );
      toast({
        title: "Tipo de documento actualizado",
        description: "El tipo de documento ha sido actualizado exitosamente",
      });
    } else {
      const newTipo: TipoDocumento = {
        ...data,
        id: Date.now().toString(),
        bloqueado: false,
      };
      setTiposDocumentos([...tiposDocumentos, newTipo]);
      toast({
        title: "Tipo de documento creado",
        description: "El tipo de documento ha sido creado exitosamente",
      });
    }
    setIsDialogOpen(false);
    setEditingTipo(null);
    form.reset();
  };

  const handleEdit = (tipo: TipoDocumento) => {
    setEditingTipo(tipo);
    form.reset(tipo);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTiposDocumentos(tiposDocumentos.filter((t) => t.id !== id));
    setDeletingId(null);
    toast({
      title: "Tipo de documento eliminado",
      description: "El tipo de documento ha sido eliminado exitosamente",
      variant: "destructive",
    });
  };

  const handleToggleBloqueo = (id: string) => {
    setTiposDocumentos(
      tiposDocumentos.map((t) =>
        t.id === id ? { ...t, bloqueado: !t.bloqueado } : t
      )
    );
    const tipo = tiposDocumentos.find((t) => t.id === id);
    toast({
      title: tipo?.bloqueado ? "Tipo desbloqueado" : "Tipo bloqueado",
      description: `El tipo de documento ha sido ${tipo?.bloqueado ? "desbloqueado" : "bloqueado"} exitosamente`,
    });
  };

  const handleAddNew = () => {
    setEditingTipo(null);
    form.reset({
      codigo: "",
      nombre: "",
      prefijo: "",
      consecutivoInicial: "",
      consecutivoActual: "",
      descripcion: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tipos de Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los tipos de documentos del sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTipo ? "Editar Tipo de Documento" : "Nuevo Tipo de Documento"}
              </DialogTitle>
              <DialogDescription>
                {editingTipo
                  ? "Modifica los datos del tipo de documento"
                  : "Ingresa los datos del nuevo tipo de documento"}
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
                          <Input placeholder="FV" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prefijo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prefijo</FormLabel>
                        <FormControl>
                          <Input placeholder="FV" {...field} />
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
                        <Input placeholder="Factura de Venta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="consecutivoInicial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consecutivo Inicial</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consecutivoActual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consecutivo Actual</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del tipo de documento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingTipo ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Documentos</CardTitle>
          <CardDescription>
            Lista de tipos de documentos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código, nombre o prefijo..."
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
                <TableHead>Prefijo</TableHead>
                <TableHead>Consecutivo Inicial</TableHead>
                <TableHead>Consecutivo Actual</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTipos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.codigo}</TableCell>
                  <TableCell>{tipo.nombre}</TableCell>
                  <TableCell>{tipo.prefijo}</TableCell>
                  <TableCell>{tipo.consecutivoInicial}</TableCell>
                  <TableCell>{tipo.consecutivoActual}</TableCell>
                  <TableCell>
                    {tipo.bloqueado ? (
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
                        onClick={() => handleEdit(tipo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBloqueo(tipo.id)}
                      >
                        <Lock className={`h-4 w-4 ${tipo.bloqueado ? "text-destructive" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(tipo.id)}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de documento
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
