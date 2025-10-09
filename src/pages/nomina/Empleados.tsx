import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, Mail, Phone, Calendar, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const empleadoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  cedula: z.string().min(1, "La cédula es requerida"),
  cargo: z.string().min(1, "El cargo es requerido"),
  departamento: z.string().min(1, "El departamento es requerido"),
  salario: z.string().min(1, "El salario es requerido"),
  fechaIngreso: z.string().min(1, "La fecha de ingreso es requerida"),
  estado: z.enum(["activo", "inactivo", "vacaciones"]),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
});

type EmpleadoForm = z.infer<typeof empleadoSchema>;

interface Empleado extends Omit<EmpleadoForm, 'salario'> {
  id: string;
  salario: number;
}

const empleadosData: Empleado[] = [
  {
    id: "1",
    nombre: "María González",
    cedula: "1234567890",
    cargo: "Recepcionista",
    departamento: "Recepción",
    salario: 1500000,
    fechaIngreso: "2023-01-15",
    estado: "activo",
    email: "maria@hotel.com",
    telefono: "3001234567"
  },
  {
    id: "2",
    nombre: "Carlos Pérez",
    cedula: "9876543210",
    cargo: "Chef",
    departamento: "Cocina",
    salario: 2500000,
    fechaIngreso: "2022-06-20",
    estado: "activo",
    email: "carlos@hotel.com",
    telefono: "3009876543"
  },
  {
    id: "3",
    nombre: "Ana Martínez",
    cedula: "5555555555",
    cargo: "Camarera",
    departamento: "Limpieza",
    salario: 1200000,
    fechaIngreso: "2023-03-10",
    estado: "vacaciones",
    email: "ana@hotel.com",
    telefono: "3005555555"
  }
];

export default function Empleados() {
  const [searchTerm, setSearchTerm] = useState("");
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const { toast } = useToast();

  const form = useForm<EmpleadoForm>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      nombre: "",
      cedula: "",
      cargo: "",
      departamento: "",
      salario: "",
      fechaIngreso: "",
      estado: "activo",
      email: "",
      telefono: "",
    },
  });

  const handleOpenDialog = (empleado?: Empleado) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      form.reset({
        nombre: empleado.nombre,
        cedula: empleado.cedula,
        cargo: empleado.cargo,
        departamento: empleado.departamento,
        salario: empleado.salario.toString(),
        fechaIngreso: empleado.fechaIngreso,
        estado: empleado.estado,
        email: empleado.email,
        telefono: empleado.telefono,
      });
    } else {
      setEditingEmpleado(null);
      form.reset({
        nombre: "",
        cedula: "",
        cargo: "",
        departamento: "",
        salario: "",
        fechaIngreso: "",
        estado: "activo",
        email: "",
        telefono: "",
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: EmpleadoForm) => {
    if (editingEmpleado) {
      setEmpleados(empleados.map(emp =>
        emp.id === editingEmpleado.id
          ? { ...emp, ...data, salario: parseFloat(data.salario) }
          : emp
      ));
      toast({
        title: "Empleado actualizado",
        description: "El empleado ha sido actualizado exitosamente",
      });
    } else {
      const nuevoEmpleado: Empleado = {
        id: Date.now().toString(),
        ...data,
        salario: parseFloat(data.salario),
      };
      setEmpleados([...empleados, nuevoEmpleado]);
      toast({
        title: "Empleado creado",
        description: "El empleado ha sido creado exitosamente",
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEmpleados(empleados.filter(emp => emp.id !== id));
    toast({
      title: "Empleado eliminado",
      description: "El empleado ha sido eliminado exitosamente",
    });
  };

  const filteredEmpleados = empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cedula.includes(searchTerm) ||
    emp.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      activo: { variant: "default", label: "Activo" },
      inactivo: { variant: "secondary", label: "Inactivo" },
      vacaciones: { variant: "outline", label: "Vacaciones" }
    };
    return variants[estado] || variants.activo;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Empleados</h1>
          <p className="text-muted-foreground mt-1">Gestión de personal del hotel</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <UserPlus className="h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cedula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cédula</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="departamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salario</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fechaIngreso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Ingreso</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="activo">Activo</SelectItem>
                            <SelectItem value="inactivo">Inactivo</SelectItem>
                            <SelectItem value="vacaciones">Vacaciones</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEmpleado ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmpleados.map((empleado) => {
              const estadoBadge = getEstadoBadge(empleado.estado);
              return (
                <Card key={empleado.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {empleado.nombre.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{empleado.nombre}</h3>
                            <p className="text-sm text-muted-foreground">CC: {empleado.cedula}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Cargo</p>
                            <p className="font-medium text-foreground">{empleado.cargo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Departamento</p>
                            <p className="font-medium text-foreground">{empleado.departamento}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Salario</p>
                            <p className="font-medium text-foreground">
                              ${empleado.salario.toLocaleString('es-CO')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-foreground">{empleado.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-foreground">{empleado.telefono}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-foreground">{empleado.fechaIngreso}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={estadoBadge.variant}>
                          {estadoBadge.label}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDialog(empleado)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(empleado.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEmpleados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron empleados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
