import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TIPOS_DOCUMENTO = ["CC", "CE", "TI", "NIT", "Pasaporte"];
const TIPOS_CONTRATO = ["Término Fijo", "Término Indefinido", "Obra o Labor", "Prestación de Servicios"];
const BANCOS = ["Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Banco Popular", "Banco de Occidente", "Colpatria", "Banco Agrario"];
const EPS_LIST = ["Sura", "Nueva EPS", "Sanitas", "Compensar", "Salud Total", "Coomeva", "Famisanar", "Medimás"];
const ARL_LIST = ["Sura ARL", "Positiva", "Colmena", "Bolívar", "Liberty", "Alfa"];

const empleadoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellidos: z.string().min(1, "Los apellidos son requeridos"),
  tipoDocumento: z.string().min(1, "El tipo de documento es requerido"),
  numeroDocumento: z.string().min(1, "El número de documento es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  tipoContrato: z.string().min(1, "El tipo de contrato es requerido"),
  cargo: z.string().min(1, "El cargo es requerido"),
  salario: z.string().min(1, "El salario es requerido"),
  fechaInicioContrato: z.string().min(1, "La fecha de inicio es requerida"),
  banco: z.string().min(1, "El banco es requerido"),
  tipoCuentaBancaria: z.string().min(1, "El tipo de cuenta es requerido"),
  numeroCuentaBancaria: z.string().min(1, "El número de cuenta es requerido"),
  eps: z.string().min(1, "La EPS es requerida"),
  arl: z.string().min(1, "La ARL es requerida"),
  estado: z.enum(["activo", "inactivo", "vacaciones"]),
});

type EmpleadoForm = z.infer<typeof empleadoSchema>;

interface Empleado extends Omit<EmpleadoForm, "salario"> {
  id: string;
  salario: number;
}

const empleadosData: Empleado[] = [
  {
    id: "1", nombre: "María", apellidos: "González Pérez", tipoDocumento: "CC", numeroDocumento: "1234567890",
    direccion: "Calle 10 #20-30, Bogotá", email: "maria@hotel.com", telefono: "3001234567",
    tipoContrato: "Término Indefinido", cargo: "Recepcionista", salario: 1500000,
    fechaInicioContrato: "2023-01-15", banco: "Bancolombia", tipoCuentaBancaria: "Ahorros",
    numeroCuentaBancaria: "12345678901", eps: "Sura", arl: "Sura ARL", estado: "activo",
  },
  {
    id: "2", nombre: "Carlos", apellidos: "Pérez López", tipoDocumento: "CC", numeroDocumento: "9876543210",
    direccion: "Carrera 5 #15-40, Bogotá", email: "carlos@hotel.com", telefono: "3009876543",
    tipoContrato: "Término Fijo", cargo: "Chef", salario: 2500000,
    fechaInicioContrato: "2022-06-20", banco: "Davivienda", tipoCuentaBancaria: "Corriente",
    numeroCuentaBancaria: "98765432101", eps: "Nueva EPS", arl: "Positiva", estado: "activo",
  },
  {
    id: "3", nombre: "Ana", apellidos: "Martínez Ruiz", tipoDocumento: "CC", numeroDocumento: "5555555555",
    direccion: "Av. 68 #45-12, Bogotá", email: "ana@hotel.com", telefono: "3005555555",
    tipoContrato: "Término Indefinido", cargo: "Camarera", salario: 1200000,
    fechaInicioContrato: "2023-03-10", banco: "BBVA", tipoCuentaBancaria: "Ahorros",
    numeroCuentaBancaria: "55555555501", eps: "Sanitas", arl: "Colmena", estado: "vacaciones",
  },
];

const defaultValues: EmpleadoForm = {
  nombre: "", apellidos: "", tipoDocumento: "", numeroDocumento: "", direccion: "",
  email: "", telefono: "", tipoContrato: "", cargo: "", salario: "",
  fechaInicioContrato: "", banco: "", tipoCuentaBancaria: "", numeroCuentaBancaria: "",
  eps: "", arl: "", estado: "activo",
};

export default function Empleados() {
  const [searchTerm, setSearchTerm] = useState("");
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const { toast } = useToast();

  const form = useForm<EmpleadoForm>({
    resolver: zodResolver(empleadoSchema),
    defaultValues,
  });

  const handleOpenDialog = (empleado?: Empleado) => {
    if (empleado) {
      setEditingEmpleado(empleado);
      form.reset({ ...empleado, salario: empleado.salario.toString() });
    } else {
      setEditingEmpleado(null);
      form.reset(defaultValues);
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: EmpleadoForm) => {
    if (editingEmpleado) {
      setEmpleados(empleados.map(emp =>
        emp.id === editingEmpleado.id ? { ...emp, ...data, salario: parseFloat(data.salario) } : emp
      ));
      toast({ title: "Empleado actualizado", description: "El empleado ha sido actualizado exitosamente" });
    } else {
      setEmpleados([...empleados, { id: Date.now().toString(), ...data, salario: parseFloat(data.salario) }]);
      toast({ title: "Empleado creado", description: "El empleado ha sido creado exitosamente" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEmpleados(empleados.filter(emp => emp.id !== id));
    toast({ title: "Empleado eliminado", description: "El empleado ha sido eliminado exitosamente" });
  };

  const filteredEmpleados = empleados.filter(emp =>
    `${emp.nombre} ${emp.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.numeroDocumento.includes(searchTerm) ||
    emp.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      activo: { variant: "default", label: "Activo" },
      inactivo: { variant: "secondary", label: "Inactivo" },
      vacaciones: { variant: "outline", label: "Vacaciones" },
    };
    return variants[estado] || variants.activo;
  };

  const fmtMoney = (v: number) => `$${v.toLocaleString("es-CO")}`;

  const renderSelectField = (name: keyof EmpleadoForm, label: string, options: string[]) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder={`Seleccionar ${label.toLowerCase()}`} /></SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderInputField = (name: keyof EmpleadoForm, label: string, type = "text") => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl><Input type={type} {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Empleados</h1>
          <p className="text-muted-foreground mt-1">Gestión de personal</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <UserPlus className="h-4 w-4" /> Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="laboral">Laboral</TabsTrigger>
                    <TabsTrigger value="bancario">Bancario</TabsTrigger>
                    <TabsTrigger value="seguridad">Seguridad Social</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("nombre", "Nombre")}
                      {renderInputField("apellidos", "Apellidos")}
                      {renderSelectField("tipoDocumento", "Tipo Documento", TIPOS_DOCUMENTO)}
                      {renderInputField("numeroDocumento", "Número Documento")}
                      {renderInputField("direccion", "Dirección")}
                      {renderInputField("email", "Correo Electrónico", "email")}
                      {renderInputField("telefono", "Teléfono")}
                      {renderSelectField("estado", "Estado", ["activo", "inactivo", "vacaciones"])}
                    </div>
                  </TabsContent>

                  <TabsContent value="laboral" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {renderSelectField("tipoContrato", "Tipo de Contrato", TIPOS_CONTRATO)}
                      {renderInputField("cargo", "Cargo")}
                      {renderInputField("salario", "Salario", "number")}
                      {renderInputField("fechaInicioContrato", "Fecha Inicio Contrato", "date")}
                    </div>
                  </TabsContent>

                  <TabsContent value="bancario" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {renderSelectField("banco", "Banco", BANCOS)}
                      {renderSelectField("tipoCuentaBancaria", "Tipo de Cuenta", ["Ahorros", "Corriente"])}
                      {renderInputField("numeroCuentaBancaria", "Número de Cuenta")}
                    </div>
                  </TabsContent>

                  <TabsContent value="seguridad" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {renderSelectField("eps", "EPS", EPS_LIST)}
                      {renderSelectField("arl", "ARL", ARL_LIST)}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">{editingEmpleado ? "Actualizar" : "Crear"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, documento o cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>EPS</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpleados.map((emp) => {
                const badge = getEstadoBadge(emp.estado);
                return (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.nombre} {emp.apellidos}</TableCell>
                    <TableCell>{emp.tipoDocumento} {emp.numeroDocumento}</TableCell>
                    <TableCell>{emp.cargo}</TableCell>
                    <TableCell>{emp.tipoContrato}</TableCell>
                    <TableCell>{fmtMoney(emp.salario)}</TableCell>
                    <TableCell>{emp.eps}</TableCell>
                    <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(emp)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(emp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
