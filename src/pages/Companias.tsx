import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Building2, Plus, Search, Mail, Phone, MapPin, Edit, Lock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

const companiaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  nit: z.string().trim().min(1, "El NIT es requerido").max(20, "Máximo 20 caracteres"),
  correo: z.string().trim().email("Correo electrónico inválido").max(100, "Máximo 100 caracteres"),
  telefono: z.string().trim().min(7, "Mínimo 7 caracteres").max(20, "Máximo 20 caracteres"),
  direccion: z.string().trim().min(1, "La dirección es requerida").max(200, "Máximo 200 caracteres"),
  ciudad: z.string().trim().min(1, "La ciudad es requerida").max(100, "Máximo 100 caracteres"),
  representanteLegal: z.string().trim().min(1, "El representante legal es requerido").max(100, "Máximo 100 caracteres"),
});

type CompaniaFormData = z.infer<typeof companiaSchema>;

interface Compania extends CompaniaFormData {
  id: string;
  estado: "activo" | "bloqueado";
  fechaCreacion: string;
}

const companiasData: Compania[] = [
  {
    id: "1",
    nombre: "Hotel Costa Azul SAS",
    nit: "900123456-7",
    correo: "info@hotelcostaazul.com",
    telefono: "3201234567",
    direccion: "Calle 100 #15-20",
    ciudad: "Cartagena",
    representanteLegal: "Juan Pérez Gómez",
    estado: "activo",
    fechaCreacion: "2023-01-15"
  },
  {
    id: "2",
    nombre: "Hospedaje El Paraíso Ltda",
    nit: "800456789-3",
    correo: "contacto@elparaiso.com",
    telefono: "3109876543",
    direccion: "Carrera 7 #45-30",
    ciudad: "Bogotá",
    representanteLegal: "María López Castro",
    estado: "activo",
    fechaCreacion: "2022-08-20"
  },
  {
    id: "3",
    nombre: "Resort Playa Dorada SA",
    nit: "900789123-1",
    correo: "reservas@playadorada.com",
    telefono: "3157894561",
    direccion: "Km 5 Vía al Mar",
    ciudad: "Santa Marta",
    representanteLegal: "Carlos Ramírez Soto",
    estado: "bloqueado",
    fechaCreacion: "2021-05-10"
  },
  {
    id: "4",
    nombre: "Hotel Montaña Verde SAS",
    nit: "900321654-9",
    correo: "info@montanaverde.com",
    telefono: "3186549871",
    direccion: "Vereda El Silencio",
    ciudad: "Medellín",
    representanteLegal: "Ana Moreno Díaz",
    estado: "activo",
    fechaCreacion: "2023-03-25"
  },
  {
    id: "5",
    nombre: "Hostal Ciudad Colonial",
    nit: "800654987-2",
    correo: "reservas@ciudadcolonial.com",
    telefono: "3124567890",
    direccion: "Calle 8 #3-45 Centro Histórico",
    ciudad: "Cartagena",
    representanteLegal: "Pedro Martínez Ruiz",
    estado: "activo",
    fechaCreacion: "2022-11-12"
  },
];

export default function Companias() {
  const [companias, setCompanias] = useState<Compania[]>(companiasData);
  const [searchNombre, setSearchNombre] = useState("");
  const [searchNit, setSearchNit] = useState("");
  const [searchCorreo, setSearchCorreo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompania, setEditingCompania] = useState<Compania | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companiaToDelete, setCompaniaToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompaniaFormData>({
    resolver: zodResolver(companiaSchema),
  });

  const filteredCompanias = companias.filter((comp) => {
    const matchNombre = comp.nombre.toLowerCase().includes(searchNombre.toLowerCase());
    const matchNit = comp.nit.includes(searchNit);
    const matchCorreo = comp.correo.toLowerCase().includes(searchCorreo.toLowerCase());
    return matchNombre && matchNit && matchCorreo;
  });

  const totalPages = Math.ceil(filteredCompanias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanias = filteredCompanias.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenDialog = (compania?: Compania) => {
    if (compania) {
      setEditingCompania(compania);
      reset(compania);
    } else {
      setEditingCompania(null);
      reset({
        nombre: "",
        nit: "",
        correo: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        representanteLegal: "",
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: CompaniaFormData) => {
    if (editingCompania) {
      setCompanias(companias.map(c => 
        c.id === editingCompania.id 
          ? { ...c, ...data }
          : c
      ));
      toast({
        title: "Compañía actualizada",
        description: "Los datos de la compañía se han actualizado correctamente.",
      });
    } else {
      const newCompania: Compania = {
        ...data,
        id: Date.now().toString(),
        estado: "activo",
        fechaCreacion: new Date().toISOString().split('T')[0],
      };
      setCompanias([newCompania, ...companias]);
      toast({
        title: "Compañía creada",
        description: "La nueva compañía se ha registrado correctamente.",
      });
    }
    setDialogOpen(false);
    setEditingCompania(null);
  };

  const handleToggleBlock = (id: string) => {
    setCompanias(companias.map(c => 
      c.id === id 
        ? { ...c, estado: c.estado === "activo" ? "bloqueado" : "activo" }
        : c
    ));
    const compania = companias.find(c => c.id === id);
    toast({
      title: compania?.estado === "activo" ? "Compañía bloqueada" : "Compañía activada",
      description: `La compañía ha sido ${compania?.estado === "activo" ? "bloqueada" : "activada"} correctamente.`,
    });
  };

  const handleDelete = () => {
    if (companiaToDelete) {
      setCompanias(companias.filter(c => c.id !== companiaToDelete));
      toast({
        title: "Compañía eliminada",
        description: "La compañía ha sido eliminada correctamente.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setCompaniaToDelete(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Datos Compañía</h1>
          <p className="text-muted-foreground mt-1">Gestión de compañías hoteleras</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Nueva Compañía
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCompania ? "Modificar Compañía" : "Nueva Compañía"}
              </DialogTitle>
              <DialogDescription>
                {editingCompania 
                  ? "Actualiza la información de la compañía." 
                  : "Registra una nueva compañía en el sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...register("nombre")}
                    placeholder="Nombre de la compañía"
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive">{errors.nombre.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nit">NIT *</Label>
                  <Input
                    id="nit"
                    {...register("nit")}
                    placeholder="900123456-7"
                  />
                  {errors.nit && (
                    <p className="text-sm text-destructive">{errors.nit.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico *</Label>
                  <Input
                    id="correo"
                    type="email"
                    {...register("correo")}
                    placeholder="info@compania.com"
                  />
                  {errors.correo && (
                    <p className="text-sm text-destructive">{errors.correo.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    {...register("telefono")}
                    placeholder="3001234567"
                  />
                  {errors.telefono && (
                    <p className="text-sm text-destructive">{errors.telefono.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  {...register("direccion")}
                  placeholder="Calle 100 #15-20"
                />
                {errors.direccion && (
                  <p className="text-sm text-destructive">{errors.direccion.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    {...register("ciudad")}
                    placeholder="Bogotá"
                  />
                  {errors.ciudad && (
                    <p className="text-sm text-destructive">{errors.ciudad.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representanteLegal">Representante Legal *</Label>
                  <Input
                    id="representanteLegal"
                    {...register("representanteLegal")}
                    placeholder="Nombre completo"
                  />
                  {errors.representanteLegal && (
                    <p className="text-sm text-destructive">{errors.representanteLegal.message}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCompania ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="searchNombre">Nombre Compañía</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchNombre"
                  placeholder="Buscar por nombre..."
                  value={searchNombre}
                  onChange={(e) => {
                    setSearchNombre(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchNit">NIT</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchNit"
                  placeholder="Buscar por NIT..."
                  value={searchNit}
                  onChange={(e) => {
                    setSearchNit(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchCorreo">Correo Electrónico</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchCorreo"
                  placeholder="Buscar por correo..."
                  value={searchCorreo}
                  onChange={(e) => {
                    setSearchCorreo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Compañías Registradas ({filteredCompanias.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="itemsPerPage" className="text-sm">Registros por página:</Label>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger id="itemsPerPage" className="w-20">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedCompanias.map((compania) => (
              <Card key={compania.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-foreground">{compania.nombre}</h3>
                          <Badge variant={compania.estado === "activo" ? "default" : "secondary"}>
                            {compania.estado === "activo" ? "Activo" : "Bloqueado"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">NIT</p>
                            <p className="font-medium text-foreground">{compania.nit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="text-foreground">{compania.correo}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-foreground">{compania.telefono}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-foreground">{compania.direccion}, {compania.ciudad}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Representante Legal</p>
                            <p className="font-medium text-foreground">{compania.representanteLegal}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fecha de Registro</p>
                            <p className="text-foreground">{compania.fechaCreacion}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleOpenDialog(compania)}
                      >
                        <Edit className="h-4 w-4" />
                        Modificar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleToggleBlock(compania.id)}
                      >
                        <Lock className="h-4 w-4" />
                        {compania.estado === "activo" ? "Bloquear" : "Activar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                          setCompaniaToDelete(compania.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanias.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron compañías</p>
            </div>
          )}

          {filteredCompanias.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCompanias.length)} de {filteredCompanias.length} registros
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la compañía del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
