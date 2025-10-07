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
  identificacion: z.string().trim().min(1, "La identificación es requerida").max(20, "Máximo 20 caracteres"),
  tipoDocumento: z.enum(["NIT", "CC", "CE", "PAS"], {
    required_error: "El tipo de documento es requerido",
  }),
  nombreEmpresa: z.string().trim().max(100, "Máximo 100 caracteres").optional(),
  primerNombre: z.string().trim().max(50, "Máximo 50 caracteres").optional(),
  segundoNombre: z.string().trim().max(50, "Máximo 50 caracteres").optional(),
  primerApellido: z.string().trim().max(50, "Máximo 50 caracteres").optional(),
  segundoApellido: z.string().trim().max(50, "Máximo 50 caracteres").optional(),
  direccion: z.string().trim().min(1, "La dirección es requerida").max(200, "Máximo 200 caracteres"),
  telefono: z.string().trim().min(7, "Mínimo 7 caracteres").max(20, "Máximo 20 caracteres"),
  correo: z.string().trim().email("Correo electrónico inválido").max(100, "Máximo 100 caracteres"),
  codigoCiiu: z.string().trim().min(1, "El código CIIU es requerido").max(10, "Máximo 10 caracteres"),
  representanteLegal: z.string().trim().min(1, "El representante legal es requerido").max(100, "Máximo 100 caracteres"),
  tipoEmpresa: z.enum(["SAS", "SA", "LTDA", "EU", "PERSONA_NATURAL"], {
    required_error: "El tipo de empresa es requerido",
  }),
  regimenTributario: z.enum(["COMUN", "SIMPLIFICADO", "ESPECIAL"], {
    required_error: "El régimen tributario es requerido",
  }),
}).refine(
  (data) => {
    if (data.tipoDocumento === "NIT") {
      return !!data.nombreEmpresa && data.nombreEmpresa.trim().length > 0;
    } else {
      return !!data.primerNombre && data.primerNombre.trim().length > 0 && 
             !!data.primerApellido && data.primerApellido.trim().length > 0;
    }
  },
  {
    message: "Complete los campos requeridos según el tipo de documento",
    path: ["nombreEmpresa"],
  }
);

type CompaniaFormData = z.infer<typeof companiaSchema>;

interface Compania extends CompaniaFormData {
  id: string;
  estado: "activo" | "bloqueado";
  fechaCreacion: string;
}

const companiasData: Compania[] = [
  {
    id: "1",
    identificacion: "900123456-7",
    tipoDocumento: "NIT",
    nombreEmpresa: "Hotel Costa Azul SAS",
    direccion: "Calle 100 #15-20",
    telefono: "3201234567",
    correo: "info@hotelcostaazul.com",
    codigoCiiu: "5510",
    representanteLegal: "Juan Pérez Gómez",
    tipoEmpresa: "SAS",
    regimenTributario: "COMUN",
    estado: "activo",
    fechaCreacion: "2023-01-15"
  },
  {
    id: "2",
    identificacion: "1234567890",
    tipoDocumento: "CC",
    primerNombre: "María",
    segundoNombre: "Fernanda",
    primerApellido: "López",
    segundoApellido: "Castro",
    direccion: "Carrera 7 #45-30",
    telefono: "3109876543",
    correo: "maria.lopez@email.com",
    codigoCiiu: "5520",
    representanteLegal: "María López Castro",
    tipoEmpresa: "PERSONA_NATURAL",
    regimenTributario: "SIMPLIFICADO",
    estado: "activo",
    fechaCreacion: "2022-08-20"
  },
];

export default function Companias() {
  const [companias, setCompanias] = useState<Compania[]>(companiasData);
  const [searchIdentificacion, setSearchIdentificacion] = useState("");
  const [searchNombre, setSearchNombre] = useState("");
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
    watch,
  } = useForm<CompaniaFormData>({
    resolver: zodResolver(companiaSchema),
    defaultValues: {
      tipoDocumento: "NIT",
      tipoEmpresa: "SAS",
      regimenTributario: "COMUN",
    },
  });

  const tipoDocumento = watch("tipoDocumento");

  const getNombreCompleto = (compania: Compania) => {
    if (compania.tipoDocumento === "NIT") {
      return compania.nombreEmpresa || "";
    }
    return `${compania.primerNombre || ""} ${compania.segundoNombre || ""} ${compania.primerApellido || ""} ${compania.segundoApellido || ""}`.trim();
  };

  const filteredCompanias = companias.filter((comp) => {
    const nombreCompleto = getNombreCompleto(comp);
    const matchIdentificacion = comp.identificacion.includes(searchIdentificacion);
    const matchNombre = nombreCompleto.toLowerCase().includes(searchNombre.toLowerCase());
    const matchCorreo = comp.correo.toLowerCase().includes(searchCorreo.toLowerCase());
    return matchIdentificacion && matchNombre && matchCorreo;
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
        identificacion: "",
        tipoDocumento: "NIT",
        nombreEmpresa: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        direccion: "",
        telefono: "",
        correo: "",
        codigoCiiu: "",
        representanteLegal: "",
        tipoEmpresa: "SAS",
        regimenTributario: "COMUN",
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
        title: "Tercero actualizado",
        description: "Los datos se han actualizado correctamente.",
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
        title: "Tercero creado",
        description: "El nuevo tercero/compañía se ha registrado correctamente.",
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
      title: compania?.estado === "activo" ? "Tercero bloqueado" : "Tercero activado",
      description: `El tercero ha sido ${compania?.estado === "activo" ? "bloqueado" : "activado"} correctamente.`,
    });
  };

  const handleDelete = () => {
    if (companiaToDelete) {
      setCompanias(companias.filter(c => c.id !== companiaToDelete));
      toast({
        title: "Tercero eliminado",
        description: "El tercero ha sido eliminado correctamente.",
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
          <h1 className="text-3xl font-bold text-foreground">Terceros / Compañías</h1>
          <p className="text-muted-foreground mt-1">Gestión de terceros y empresas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Nuevo Tercero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCompania ? "Modificar Tercero/Compañía" : "Nuevo Tercero/Compañía"}
              </DialogTitle>
              <DialogDescription>
                {editingCompania 
                  ? "Actualiza la información del tercero o compañía." 
                  : "Registra un nuevo tercero o compañía en el sistema."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select 
                    onValueChange={(value) => {
                      reset({
                        ...watch(),
                        tipoDocumento: value as "NIT" | "CC" | "CE" | "PAS",
                        nombreEmpresa: "",
                        primerNombre: "",
                        segundoNombre: "",
                        primerApellido: "",
                        segundoApellido: "",
                      });
                    }} 
                    value={tipoDocumento}
                  >
                    <SelectTrigger id="tipoDocumento">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="PAS">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoDocumento && (
                    <p className="text-sm text-destructive">{errors.tipoDocumento.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identificacion">Identificación *</Label>
                  <Input
                    id="identificacion"
                    {...register("identificacion")}
                    placeholder="Número de identificación"
                  />
                  {errors.identificacion && (
                    <p className="text-sm text-destructive">{errors.identificacion.message}</p>
                  )}
                </div>
              </div>

              {tipoDocumento === "NIT" ? (
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
                  <Input
                    id="nombreEmpresa"
                    {...register("nombreEmpresa")}
                    placeholder="Razón social de la empresa"
                  />
                  {errors.nombreEmpresa && (
                    <p className="text-sm text-destructive">{errors.nombreEmpresa.message}</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primerNombre">Primer Nombre *</Label>
                    <Input
                      id="primerNombre"
                      {...register("primerNombre")}
                      placeholder="Primer nombre"
                    />
                    {errors.primerNombre && (
                      <p className="text-sm text-destructive">{errors.primerNombre.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segundoNombre">Segundo Nombre</Label>
                    <Input
                      id="segundoNombre"
                      {...register("segundoNombre")}
                      placeholder="Segundo nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primerApellido">Primer Apellido *</Label>
                    <Input
                      id="primerApellido"
                      {...register("primerApellido")}
                      placeholder="Primer apellido"
                    />
                    {errors.primerApellido && (
                      <p className="text-sm text-destructive">{errors.primerApellido.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                    <Input
                      id="segundoApellido"
                      {...register("segundoApellido")}
                      placeholder="Segundo apellido"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico *</Label>
                  <Input
                    id="correo"
                    type="email"
                    {...register("correo")}
                    placeholder="correo@ejemplo.com"
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
                  <Label htmlFor="codigoCiiu">Código CIIU *</Label>
                  <Input
                    id="codigoCiiu"
                    {...register("codigoCiiu")}
                    placeholder="5510"
                  />
                  {errors.codigoCiiu && (
                    <p className="text-sm text-destructive">{errors.codigoCiiu.message}</p>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoEmpresa">Tipo de Empresa *</Label>
                  <Select 
                    onValueChange={(value) => {
                      reset({
                        ...watch(),
                        tipoEmpresa: value as "SAS" | "SA" | "LTDA" | "EU" | "PERSONA_NATURAL",
                      });
                    }}
                    value={watch("tipoEmpresa")}
                  >
                    <SelectTrigger id="tipoEmpresa">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAS">SAS</SelectItem>
                      <SelectItem value="SA">SA</SelectItem>
                      <SelectItem value="LTDA">LTDA</SelectItem>
                      <SelectItem value="EU">Empresa Unipersonal</SelectItem>
                      <SelectItem value="PERSONA_NATURAL">Persona Natural</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoEmpresa && (
                    <p className="text-sm text-destructive">{errors.tipoEmpresa.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regimenTributario">Régimen Tributario *</Label>
                  <Select 
                    onValueChange={(value) => {
                      reset({
                        ...watch(),
                        regimenTributario: value as "COMUN" | "SIMPLIFICADO" | "ESPECIAL",
                      });
                    }}
                    value={watch("regimenTributario")}
                  >
                    <SelectTrigger id="regimenTributario">
                      <SelectValue placeholder="Seleccione régimen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMUN">Común</SelectItem>
                      <SelectItem value="SIMPLIFICADO">Simplificado</SelectItem>
                      <SelectItem value="ESPECIAL">Especial</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.regimenTributario && (
                    <p className="text-sm text-destructive">{errors.regimenTributario.message}</p>
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
              <Label htmlFor="searchIdentificacion">Identificación</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchIdentificacion"
                  placeholder="Buscar por identificación..."
                  value={searchIdentificacion}
                  onChange={(e) => {
                    setSearchIdentificacion(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchNombre">Nombre / Razón Social</Label>
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
              Terceros Registrados ({filteredCompanias.length})
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
                          <h3 className="font-semibold text-lg text-foreground">{getNombreCompleto(compania)}</h3>
                          <Badge variant={compania.estado === "activo" ? "default" : "secondary"}>
                            {compania.estado === "activo" ? "Activo" : "Bloqueado"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tipo Doc</p>
                            <p className="font-medium text-foreground">{compania.tipoDocumento}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Identificación</p>
                            <p className="font-medium text-foreground">{compania.identificacion}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="text-foreground truncate">{compania.correo}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-foreground">{compania.telefono}</p>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-foreground">{compania.direccion}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tipo Empresa</p>
                            <p className="font-medium text-foreground">{compania.tipoEmpresa}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">CIIU</p>
                            <p className="font-medium text-foreground">{compania.codigoCiiu}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(compania)}
                        title="Modificar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleBlock(compania.id)}
                        title={compania.estado === "activo" ? "Bloquear" : "Activar"}
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCompaniaToDelete(compania.id);
                          setDeleteDialogOpen(true);
                        }}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
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
              <p className="text-muted-foreground">No se encontraron terceros con los filtros aplicados</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCompanias.length)} de {filteredCompanias.length} registros
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
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
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el tercero/compañía del sistema.
              Esta acción no se puede deshacer.
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
