import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const impuestoSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.enum(["venta", "retencion"], {
    required_error: "Seleccione un tipo de impuesto",
  }),
  porcentaje: z.string().min(1, "El porcentaje es requerido"),
  cuentaContable: z.string().min(1, "La cuenta contable es requerida"),
  descripcion: z.string().optional(),
});

type ImpuestoFormData = z.infer<typeof impuestoSchema>;

interface Impuesto extends ImpuestoFormData {
  id: string;
  estado: "activo" | "inactivo";
}

const impuestosData: Impuesto[] = [
  {
    id: "1",
    codigo: "IVA19",
    nombre: "IVA 19%",
    tipo: "venta",
    porcentaje: "19",
    cuentaContable: "2408",
    descripcion: "Impuesto al valor agregado 19%",
    estado: "activo",
  },
  {
    id: "2",
    codigo: "IVA5",
    nombre: "IVA 5%",
    tipo: "venta",
    porcentaje: "5",
    cuentaContable: "2408",
    descripcion: "Impuesto al valor agregado 5%",
    estado: "activo",
  },
  {
    id: "3",
    codigo: "RTEFTE35",
    nombre: "Retención en la Fuente 3.5%",
    tipo: "retencion",
    porcentaje: "3.5",
    cuentaContable: "2365",
    descripcion: "Retención en la fuente servicios",
    estado: "activo",
  },
  {
    id: "4",
    codigo: "RTEICA",
    nombre: "Retención ICA 11.04 por mil",
    tipo: "retencion",
    porcentaje: "1.104",
    cuentaContable: "2368",
    descripcion: "Retención de industria y comercio",
    estado: "activo",
  },
];

export default function Impuestos() {
  const [impuestos, setImpuestos] = useState<Impuesto[]>(impuestosData);
  const [filteredImpuestos, setFilteredImpuestos] = useState<Impuesto[]>(impuestosData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImpuesto, setSelectedImpuesto] = useState<Impuesto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  const form = useForm<ImpuestoFormData>({
    resolver: zodResolver(impuestoSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      tipo: "venta",
      porcentaje: "",
      cuentaContable: "",
      descripcion: "",
    },
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterImpuestos(value, filterTipo);
    setCurrentPage(1);
  };

  const handleFilterTipo = (value: string) => {
    setFilterTipo(value);
    filterImpuestos(searchTerm, value);
    setCurrentPage(1);
  };

  const filterImpuestos = (search: string, tipo: string) => {
    let filtered = impuestos;

    if (search) {
      filtered = filtered.filter(
        (imp) =>
          imp.nombre.toLowerCase().includes(search.toLowerCase()) ||
          imp.codigo.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tipo !== "todos") {
      filtered = filtered.filter((imp) => imp.tipo === tipo);
    }

    setFilteredImpuestos(filtered);
  };

  const handleOpenDialog = (impuesto?: Impuesto) => {
    if (impuesto) {
      setSelectedImpuesto(impuesto);
      form.reset({
        codigo: impuesto.codigo,
        nombre: impuesto.nombre,
        tipo: impuesto.tipo,
        porcentaje: impuesto.porcentaje,
        cuentaContable: impuesto.cuentaContable,
        descripcion: impuesto.descripcion || "",
      });
    } else {
      setSelectedImpuesto(null);
      form.reset({
        codigo: "",
        nombre: "",
        tipo: "venta",
        porcentaje: "",
        cuentaContable: "",
        descripcion: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (impuesto: Impuesto) => {
    setSelectedImpuesto(impuesto);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: ImpuestoFormData) => {
    if (selectedImpuesto) {
      const updatedImpuestos = impuestos.map((imp) =>
        imp.id === selectedImpuesto.id
          ? { ...imp, ...data }
          : imp
      );
      setImpuestos(updatedImpuestos);
      filterImpuestos(searchTerm, filterTipo);
      toast({
        title: "Impuesto actualizado",
        description: "El impuesto ha sido actualizado correctamente.",
      });
    } else {
      const newImpuesto: Impuesto = {
        ...data,
        id: Date.now().toString(),
        estado: "activo",
      };
      const updatedImpuestos = [...impuestos, newImpuesto];
      setImpuestos(updatedImpuestos);
      setFilteredImpuestos(updatedImpuestos);
      toast({
        title: "Impuesto creado",
        description: "El impuesto ha sido creado correctamente.",
      });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = () => {
    if (selectedImpuesto) {
      const updatedImpuestos = impuestos.filter((imp) => imp.id !== selectedImpuesto.id);
      setImpuestos(updatedImpuestos);
      filterImpuestos(searchTerm, filterTipo);
      toast({
        title: "Impuesto eliminado",
        description: "El impuesto ha sido eliminado correctamente.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setSelectedImpuesto(null);
    }
  };

  const totalPages = Math.ceil(filteredImpuestos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImpuestos = filteredImpuestos.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Gestión de Impuestos</CardTitle>
          <CardDescription>
            Administre los impuestos de ventas y retenciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterTipo} onValueChange={handleFilterTipo}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="venta">Ventas</SelectItem>
                  <SelectItem value="retencion">Retenciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleOpenDialog()} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Impuesto
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead>Cuenta Contable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentImpuestos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron impuestos
                    </TableCell>
                  </TableRow>
                ) : (
                  currentImpuestos.map((impuesto) => (
                    <TableRow key={impuesto.id}>
                      <TableCell className="font-medium">{impuesto.codigo}</TableCell>
                      <TableCell>{impuesto.nombre}</TableCell>
                      <TableCell>
                        <Badge variant={impuesto.tipo === "venta" ? "default" : "secondary"}>
                          {impuesto.tipo === "venta" ? "Venta" : "Retención"}
                        </Badge>
                      </TableCell>
                      <TableCell>{impuesto.porcentaje}%</TableCell>
                      <TableCell>{impuesto.cuentaContable}</TableCell>
                      <TableCell>
                        <Badge variant={impuesto.estado === "activo" ? "default" : "secondary"}>
                          {impuesto.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(impuesto)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDeleteDialog(impuesto)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Label>Registros por página:</Label>
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
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedImpuesto ? "Editar Impuesto" : "Adicionar Impuesto"}
            </DialogTitle>
            <DialogDescription>
              {selectedImpuesto
                ? "Modifique los datos del impuesto"
                : "Complete los datos del nuevo impuesto"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input placeholder="IVA19" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Impuesto *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="venta">Impuesto de Venta</SelectItem>
                          <SelectItem value="retencion">Impuesto de Retención</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="IVA 19%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="porcentaje"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="19" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cuentaContable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuenta Contable *</FormLabel>
                      <FormControl>
                        <Input placeholder="2408" {...field} />
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripción del impuesto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedImpuesto ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el impuesto
              <span className="font-semibold"> {selectedImpuesto?.nombre}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
