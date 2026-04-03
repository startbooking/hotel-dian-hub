import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const cuentaNIIFSchema = z.object({
  codigoNIIF: z.string().min(1, "El código NIIF es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  grupoNIIF: z.enum(["activos", "pasivos", "patrimonio", "ingresos", "gastos", "costos", "otro_resultado_integral"]),
  clasificacionIFRS: z.enum([
    "IFRS_1", "IFRS_2", "IFRS_3", "IFRS_4", "IFRS_5", "IFRS_6", "IFRS_7", "IFRS_8",
    "IFRS_9", "IFRS_10", "IFRS_11", "IFRS_12", "IFRS_13", "IFRS_14", "IFRS_15", "IFRS_16", "IFRS_17",
    "IAS_1", "IAS_2", "IAS_7", "IAS_8", "IAS_10", "IAS_12", "IAS_16", "IAS_19", "IAS_20",
    "IAS_21", "IAS_23", "IAS_24", "IAS_26", "IAS_27", "IAS_28", "IAS_29", "IAS_32", "IAS_33",
    "IAS_34", "IAS_36", "IAS_37", "IAS_38", "IAS_39", "IAS_40", "IAS_41",
    "ninguna"
  ]),
  nivel: z.string().min(1, "El nivel es requerido"),
  cuentaLocalMapeo: z.string().optional(),
});

type CuentaNIIFFormData = z.infer<typeof cuentaNIIFSchema>;

interface CuentaNIIF extends CuentaNIIFFormData {
  id: string;
}

const grupoLabels: Record<string, string> = {
  activos: "Activos",
  pasivos: "Pasivos",
  patrimonio: "Patrimonio",
  ingresos: "Ingresos",
  gastos: "Gastos",
  costos: "Costos",
  otro_resultado_integral: "Otro Resultado Integral",
};

const ifrsOptions = [
  { value: "ninguna", label: "Sin clasificación" },
  { value: "IFRS_1", label: "NIIF 1 - Adopción primera vez" },
  { value: "IFRS_2", label: "NIIF 2 - Pagos basados en acciones" },
  { value: "IFRS_3", label: "NIIF 3 - Combinaciones de negocios" },
  { value: "IFRS_5", label: "NIIF 5 - Activos mantenidos para venta" },
  { value: "IFRS_7", label: "NIIF 7 - Instrumentos financieros revelaciones" },
  { value: "IFRS_9", label: "NIIF 9 - Instrumentos financieros" },
  { value: "IFRS_13", label: "NIIF 13 - Medición valor razonable" },
  { value: "IFRS_15", label: "NIIF 15 - Ingresos contratos con clientes" },
  { value: "IFRS_16", label: "NIIF 16 - Arrendamientos" },
  { value: "IAS_1", label: "NIC 1 - Presentación estados financieros" },
  { value: "IAS_2", label: "NIC 2 - Inventarios" },
  { value: "IAS_7", label: "NIC 7 - Estado de flujos de efectivo" },
  { value: "IAS_12", label: "NIC 12 - Impuesto a las ganancias" },
  { value: "IAS_16", label: "NIC 16 - Propiedad, planta y equipo" },
  { value: "IAS_19", label: "NIC 19 - Beneficios a empleados" },
  { value: "IAS_21", label: "NIC 21 - Efectos variaciones tipo cambio" },
  { value: "IAS_36", label: "NIC 36 - Deterioro de activos" },
  { value: "IAS_37", label: "NIC 37 - Provisiones y contingencias" },
  { value: "IAS_38", label: "NIC 38 - Activos intangibles" },
  { value: "IAS_40", label: "NIC 40 - Propiedades de inversión" },
];

export default function PlanCuentasNIIF() {
  const { toast } = useToast();
  const [cuentas, setCuentas] = useState<CuentaNIIF[]>([
    { id: "1", codigoNIIF: "1.1.01", nombre: "Efectivo y equivalentes de efectivo", grupoNIIF: "activos", clasificacionIFRS: "IAS_7", nivel: "3", cuentaLocalMapeo: "1105" },
    { id: "2", codigoNIIF: "1.1.02", nombre: "Cuentas por cobrar comerciales", grupoNIIF: "activos", clasificacionIFRS: "IFRS_9", nivel: "3", cuentaLocalMapeo: "1305" },
    { id: "3", codigoNIIF: "1.2.01", nombre: "Propiedad, planta y equipo", grupoNIIF: "activos", clasificacionIFRS: "IAS_16", nivel: "3", cuentaLocalMapeo: "1520" },
    { id: "4", codigoNIIF: "2.1.01", nombre: "Cuentas por pagar comerciales", grupoNIIF: "pasivos", clasificacionIFRS: "IFRS_9", nivel: "3", cuentaLocalMapeo: "2205" },
    { id: "5", codigoNIIF: "3.1.01", nombre: "Capital emitido", grupoNIIF: "patrimonio", clasificacionIFRS: "IAS_1", nivel: "3", cuentaLocalMapeo: "3105" },
    { id: "6", codigoNIIF: "4.1.01", nombre: "Ingresos por actividades ordinarias", grupoNIIF: "ingresos", clasificacionIFRS: "IFRS_15", nivel: "3", cuentaLocalMapeo: "4135" },
    { id: "7", codigoNIIF: "1.2.02", nombre: "Activos por derecho de uso", grupoNIIF: "activos", clasificacionIFRS: "IFRS_16", nivel: "3", cuentaLocalMapeo: "" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrupo, setFilterGrupo] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<CuentaNIIF | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const form = useForm<CuentaNIIFFormData>({
    resolver: zodResolver(cuentaNIIFSchema),
    defaultValues: { codigoNIIF: "", nombre: "", grupoNIIF: "activos", clasificacionIFRS: "ninguna", nivel: "", cuentaLocalMapeo: "" },
  });

  const filtered = cuentas.filter((c) => {
    const matchSearch = c.codigoNIIF.toLowerCase().includes(searchTerm.toLowerCase()) || c.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrupo = filterGrupo === "todos" || c.grupoNIIF === filterGrupo;
    return matchSearch && matchGrupo;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = (data: CuentaNIIFFormData) => {
    if (editingCuenta) {
      setCuentas(cuentas.map((c) => (c.id === editingCuenta.id ? { ...c, ...data } : c)));
      toast({ title: "Cuenta NIIF actualizada", description: "La cuenta ha sido actualizada exitosamente" });
    } else {
      setCuentas([...cuentas, { ...data, id: Date.now().toString() }]);
      toast({ title: "Cuenta NIIF creada", description: "La cuenta ha sido creada exitosamente" });
    }
    setIsDialogOpen(false);
    setEditingCuenta(null);
    form.reset();
  };

  const handleEdit = (cuenta: CuentaNIIF) => {
    setEditingCuenta(cuenta);
    form.reset(cuenta);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCuentas(cuentas.filter((c) => c.id !== id));
    setDeletingId(null);
    toast({ title: "Cuenta NIIF eliminada", description: "La cuenta ha sido eliminada", variant: "destructive" });
  };

  const handleAddNew = () => {
    setEditingCuenta(null);
    form.reset({ codigoNIIF: "", nombre: "", grupoNIIF: "activos", clasificacionIFRS: "ninguna", nivel: "", cuentaLocalMapeo: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plan de Cuentas NIIF</h1>
          <p className="text-muted-foreground mt-2">Catálogo de cuentas bajo Normas Internacionales de Información Financiera</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" />Nueva Cuenta NIIF</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCuenta ? "Editar Cuenta NIIF" : "Nueva Cuenta NIIF"}</DialogTitle>
              <DialogDescription>
                {editingCuenta ? "Modifica los datos de la cuenta NIIF" : "Ingresa los datos de la nueva cuenta NIIF"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="codigoNIIF" render={({ field }) => (
                    <FormItem><FormLabel>Código NIIF</FormLabel><FormControl><Input placeholder="1.1.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="nivel" render={({ field }) => (
                    <FormItem><FormLabel>Nivel</FormLabel><FormControl><Input placeholder="3" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="nombre" render={({ field }) => (
                  <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input placeholder="Efectivo y equivalentes" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="grupoNIIF" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo NIIF</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.entries(grupoLabels).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="clasificacionIFRS" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clasificación IFRS/NIC</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {ifrsOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="cuentaLocalMapeo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mapeo Cuenta Local (PUC)</FormLabel>
                    <FormControl><Input placeholder="1105 (código PUC local)" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit">{editingCuenta ? "Actualizar" : "Crear"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cuentas NIIF</CardTitle>
          <CardDescription>Catálogo de cuentas bajo normas IFRS con mapeo al PUC local</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar por código o nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterGrupo} onValueChange={setFilterGrupo}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filtrar por grupo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los grupos</SelectItem>
                {Object.entries(grupoLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código NIIF</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>IFRS/NIC</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Mapeo PUC</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((cuenta) => (
                <TableRow key={cuenta.id}>
                  <TableCell className="font-medium font-mono">{cuenta.codigoNIIF}</TableCell>
                  <TableCell>{cuenta.nombre}</TableCell>
                  <TableCell><Badge variant="secondary">{grupoLabels[cuenta.grupoNIIF]}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{cuenta.clasificacionIFRS === "ninguna" ? "—" : cuenta.clasificacionIFRS.replace("_", " ")}</Badge></TableCell>
                  <TableCell>{cuenta.nivel}</TableCell>
                  <TableCell>
                    {cuenta.cuentaLocalMapeo ? (
                      <span className="flex items-center gap-1 text-primary"><Link2 className="h-3 w-3" />{cuenta.cuentaLocalMapeo}</span>
                    ) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cuenta)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingId(cuenta.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">{filtered.length} cuentas encontradas</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
              <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción eliminará permanentemente la cuenta NIIF del sistema.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && handleDelete(deletingId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
