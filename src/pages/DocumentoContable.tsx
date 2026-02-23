import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar as CalendarIcon, Search, Edit, Trash2, FileText, Building2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

// --- Schemas ---
const terceroSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  identificacion: z.string().min(5, "La identificación debe tener al menos 5 caracteres"),
  tipoIdentificacion: z.enum(["NIT", "CC", "CE", "Pasaporte"]),
});

const cuentaContableSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tipo: z.enum(["debito", "credito"]),
  valor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El valor debe ser un número mayor a 0",
  }),
});

const centroCostosSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

const documentoSchema = z.object({
  numeroConsecutivo: z.string().min(1, "El número consecutivo es requerido"),
  fechaCausacion: z.date({ required_error: "La fecha de causación es requerida" }),
  terceroId: z.string().min(1, "Debe seleccionar un tercero"),
  referenciaFactura: z.string().min(1, "La referencia de la factura es requerida"),
  fechaFactura: z.date({ required_error: "La fecha de la factura es requerida" }),
  descripcionGasto: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  centroCostosId: z.string().min(1, "Debe seleccionar un centro de costos"),
  subtotal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "El subtotal debe ser un número mayor a 0" }),
  iva: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "El IVA debe ser un número mayor o igual a 0" }),
  retencionFuente: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "La retención en la fuente debe ser un número mayor o igual a 0" }),
  retencionIVA: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "La retención de IVA debe ser un número mayor o igual a 0" }),
  retencionICA: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "La retención de ICA debe ser un número mayor o igual a 0" }),
});

type DocumentoFormValues = z.infer<typeof documentoSchema>;
type TerceroFormValues = z.infer<typeof terceroSchema>;
type CuentaContableFormValues = z.infer<typeof cuentaContableSchema>;
type CentroCostosFormValues = z.infer<typeof centroCostosSchema>;

interface Tercero {
  id: string;
  nombre: string;
  identificacion: string;
  tipoIdentificacion: string;
}

interface CuentaContable {
  id: string;
  codigo: string;
  nombre: string;
  tipo: "debito" | "credito";
  valor: number;
}

interface CentroCostos {
  id: string;
  codigo: string;
  nombre: string;
}

interface Documento {
  id: string;
  numeroConsecutivo: string;
  fechaCausacion: Date;
  tercero: Tercero;
  referenciaFactura: string;
  fechaFactura: Date;
  descripcionGasto: string;
  centroCostos: CentroCostos;
  subtotal: number;
  iva: number;
  retencionFuente: number;
  retencionIVA: number;
  retencionICA: number;
  total: number;
  cuentas: CuentaContable[];
}

// --- Helper: parse documento from API response ---
function parseDocumento(raw: any): Documento {
  return {
    id: raw.id || raw._id || String(Date.now()),
    numeroConsecutivo: raw.numeroConsecutivo || raw.numero_consecutivo || "",
    fechaCausacion: raw.fechaCausacion ? new Date(raw.fechaCausacion) : new Date(raw.fecha_causacion || Date.now()),
    tercero: raw.tercero || { id: "", nombre: raw.tercero_nombre || "Sin tercero", identificacion: raw.tercero_identificacion || "", tipoIdentificacion: "NIT" },
    referenciaFactura: raw.referenciaFactura || raw.referencia_factura || "",
    fechaFactura: raw.fechaFactura ? new Date(raw.fechaFactura) : new Date(raw.fecha_factura || Date.now()),
    descripcionGasto: raw.descripcionGasto || raw.descripcion_gasto || raw.descripcion || "",
    centroCostos: raw.centroCostos || raw.centro_costos || { id: "", codigo: "", nombre: raw.centro_costos_nombre || "N/A" },
    subtotal: Number(raw.subtotal || 0),
    iva: Number(raw.iva || 0),
    retencionFuente: Number(raw.retencionFuente || raw.retencion_fuente || 0),
    retencionIVA: Number(raw.retencionIVA || raw.retencion_iva || 0),
    retencionICA: Number(raw.retencionICA || raw.retencion_ica || 0),
    total: Number(raw.total || 0),
    cuentas: raw.cuentas || [],
  };
}

export default function DocumentoContable() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  const [centrosCostos, setCentrosCostos] = useState<CentroCostos[]>([]);
  const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [terceroDialogOpen, setTerceroDialogOpen] = useState(false);
  const [centroCostosDialogOpen, setCentroCostosDialogOpen] = useState(false);
  const [cuentaDialogOpen, setCuentaDialogOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [documentoAEliminar, setDocumentoAEliminar] = useState<string | null>(null);
  const [editandoDocumento, setEditandoDocumento] = useState<Documento | null>(null);
  const { toast } = useToast();

  // --- Forms ---
  const form = useForm<DocumentoFormValues>({
    resolver: zodResolver(documentoSchema),
    defaultValues: {
      numeroConsecutivo: "", fechaCausacion: new Date(), terceroId: "",
      referenciaFactura: "", fechaFactura: new Date(), descripcionGasto: "",
      centroCostosId: "", subtotal: "0", iva: "0", retencionFuente: "0",
      retencionIVA: "0", retencionICA: "0",
    },
  });

  const terceroForm = useForm<TerceroFormValues>({
    resolver: zodResolver(terceroSchema),
    defaultValues: { nombre: "", identificacion: "", tipoIdentificacion: "NIT" },
  });

  const centroCostosForm = useForm<CentroCostosFormValues>({
    resolver: zodResolver(centroCostosSchema),
    defaultValues: { codigo: "", nombre: "" },
  });

  const cuentaForm = useForm<CuentaContableFormValues>({
    resolver: zodResolver(cuentaContableSchema),
    defaultValues: { codigo: "", nombre: "", tipo: "debito", valor: "0" },
  });

  // --- Calculated values ---
  const subtotal = Number(form.watch("subtotal") || 0);
  const iva = Number(form.watch("iva") || 0);
  const retencionFuente = Number(form.watch("retencionFuente") || 0);
  const retencionIVA = Number(form.watch("retencionIVA") || 0);
  const retencionICA = Number(form.watch("retencionICA") || 0);
  const totalCalculado = subtotal + iva - retencionFuente - retencionIVA - retencionICA;

  const totalDebitos = cuentasContables.filter(c => c.tipo === "debito").reduce((sum, c) => sum + c.valor, 0);
  const totalCreditos = cuentasContables.filter(c => c.tipo === "credito").reduce((sum, c) => sum + c.valor, 0);

  // --- Fetch documentos from API ---
  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      const response = await api.getDocumentosContables();
      if (response.success && response.data) {
        setDocumentos(response.data.map(parseDocumento));
      } else {
        toast({ title: "Aviso", description: "No se pudieron cargar los documentos del servidor. Usando datos locales.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocumentos(); }, []);

  // --- Handlers ---
  const onSubmitTercero = (data: TerceroFormValues) => {
    const nuevoTercero: Tercero = { id: Date.now().toString(), nombre: data.nombre, identificacion: data.identificacion, tipoIdentificacion: data.tipoIdentificacion };
    setTerceros([...terceros, nuevoTercero]);
    toast({ title: "Éxito", description: "Tercero agregado correctamente" });
    terceroForm.reset();
    setTerceroDialogOpen(false);
  };

  const onSubmitCentroCostos = (data: CentroCostosFormValues) => {
    const nuevoCentro: CentroCostos = { id: Date.now().toString(), codigo: data.codigo, nombre: data.nombre };
    setCentrosCostos([...centrosCostos, nuevoCentro]);
    toast({ title: "Éxito", description: "Centro de costos agregado correctamente" });
    centroCostosForm.reset();
    setCentroCostosDialogOpen(false);
  };

  const onSubmitCuenta = (data: CuentaContableFormValues) => {
    const nuevaCuenta: CuentaContable = { id: Date.now().toString(), codigo: data.codigo, nombre: data.nombre, tipo: data.tipo, valor: Number(data.valor) };
    setCuentasContables([...cuentasContables, nuevaCuenta]);
    toast({ title: "Éxito", description: "Cuenta contable agregada correctamente" });
    cuentaForm.reset();
    setCuentaDialogOpen(false);
  };

  const onSubmitDocumento = async (data: DocumentoFormValues) => {
    const tercero = terceros.find(t => t.id === data.terceroId);
    const centroCostos = centrosCostos.find(c => c.id === data.centroCostosId);
    if (!tercero || !centroCostos) {
      toast({ title: "Error", description: "Datos incompletos", variant: "destructive" });
      return;
    }

    const payload = {
      numeroConsecutivo: data.numeroConsecutivo,
      fechaCausacion: data.fechaCausacion.toISOString(),
      tercero,
      referenciaFactura: data.referenciaFactura,
      fechaFactura: data.fechaFactura.toISOString(),
      descripcionGasto: data.descripcionGasto,
      centroCostos,
      subtotal: Number(data.subtotal),
      iva: Number(data.iva),
      retencionFuente: Number(data.retencionFuente),
      retencionIVA: Number(data.retencionIVA),
      retencionICA: Number(data.retencionICA),
      total: totalCalculado,
      cuentas: [...cuentasContables],
    };

    if (editandoDocumento) {
      const response = await api.updateDocumentoContable(editandoDocumento.id, payload);
      if (response.success) {
        toast({ title: "Éxito", description: "Documento actualizado correctamente" });
      } else {
        // Fallback local update
        setDocumentos(prev => prev.map(d => d.id === editandoDocumento.id ? { ...payload, id: editandoDocumento.id, fechaCausacion: data.fechaCausacion, fechaFactura: data.fechaFactura } as Documento : d));
        toast({ title: "Actualizado localmente", description: "El documento fue actualizado (sin conexión al servidor)" });
      }
    } else {
      const response = await api.createDocumentoContable(payload);
      if (response.success) {
        toast({ title: "Éxito", description: "Documento registrado correctamente" });
      } else {
        // Fallback local
        const nuevoDocumento: Documento = { ...payload, id: Date.now().toString(), fechaCausacion: data.fechaCausacion, fechaFactura: data.fechaFactura };
        setDocumentos(prev => [...prev, nuevoDocumento]);
        toast({ title: "Guardado localmente", description: "El documento fue registrado (sin conexión al servidor)" });
      }
    }

    await fetchDocumentos();
    closeDialog();
  };

  const eliminarDocumento = async (id: string) => {
    const response = await api.deleteDocumentoContable(id);
    if (response.success) {
      toast({ title: "Éxito", description: "Documento eliminado correctamente" });
    } else {
      setDocumentos(prev => prev.filter(d => d.id !== id));
      toast({ title: "Eliminado localmente", description: "El documento fue eliminado (sin conexión al servidor)" });
    }
    await fetchDocumentos();
    setDocumentoAEliminar(null);
  };

  const editarDocumento = (doc: Documento) => {
    setEditandoDocumento(doc);
    // Pre-fill the terceros and centros if not present
    if (!terceros.find(t => t.id === doc.tercero.id) && doc.tercero.id) {
      setTerceros(prev => [...prev, doc.tercero]);
    }
    if (!centrosCostos.find(c => c.id === doc.centroCostos.id) && doc.centroCostos.id) {
      setCentrosCostos(prev => [...prev, doc.centroCostos]);
    }
    setCuentasContables(doc.cuentas || []);
    form.reset({
      numeroConsecutivo: doc.numeroConsecutivo,
      fechaCausacion: doc.fechaCausacion,
      terceroId: doc.tercero.id,
      referenciaFactura: doc.referenciaFactura,
      fechaFactura: doc.fechaFactura,
      descripcionGasto: doc.descripcionGasto,
      centroCostosId: doc.centroCostos.id,
      subtotal: String(doc.subtotal),
      iva: String(doc.iva),
      retencionFuente: String(doc.retencionFuente),
      retencionIVA: String(doc.retencionIVA),
      retencionICA: String(doc.retencionICA),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditandoDocumento(null);
    form.reset();
    setCuentasContables([]);
  };

  const eliminarCuenta = (id: string) => {
    setCuentasContables(cuentasContables.filter(c => c.id !== id));
  };

  const documentosFiltrados = documentos.filter((d) =>
    d.numeroConsecutivo.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.tercero.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.descripcionGasto.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Number input handler ---
  const numericOnChange = (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value.replace(/[^0-9]/g, ""));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documento Contable</h1>
          <p className="text-muted-foreground mt-1">Comprobante de causación y registro de cuentas por pagar</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80" onClick={() => { setEditandoDocumento(null); form.reset(); setCuentasContables([]); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por consecutivo, tercero o descripción..." className="pl-10" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </CardHeader>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Registrados ({documentosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Cargando documentos...</span>
            </div>
          ) : documentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No se encontraron documentos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Consecutivo</TableHead>
                    <TableHead>Fecha Causación</TableHead>
                    <TableHead>Tercero</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Centro Costos</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">IVA</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentosFiltrados.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline">{doc.numeroConsecutivo}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{format(doc.fechaCausacion, "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{doc.tercero.nombre}</p>
                          <p className="text-xs text-muted-foreground">{doc.tercero.identificacion}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{doc.referenciaFactura}</TableCell>
                      <TableCell className="text-sm">{doc.centroCostos.nombre}</TableCell>
                      <TableCell className="text-right text-sm">${doc.subtotal.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">${doc.iva.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-primary">${doc.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => editarDocumento(doc)} title="Editar documento">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDocumentoAEliminar(doc.id)} title="Eliminar documento" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editandoDocumento ? "Editar Documento de Causación" : "Registrar Documento de Causación"}</DialogTitle>
            <DialogDescription>Complete toda la información requerida para el comprobante contable</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitDocumento)} className="space-y-6">
              {/* Identificación */}
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" />Identificación</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="numeroConsecutivo" render={({ field }) => (
                    <FormItem><FormLabel>Número Consecutivo *</FormLabel><FormControl><Input placeholder="DOC-001" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fechaCausacion" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Fecha de Causación *</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="pointer-events-auto" /></PopoverContent>
                      </Popover><FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Tercero */}
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" />Beneficiario/Proveedor</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <FormField control={form.control} name="terceroId" render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel>Tercero *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Seleccione tercero" /></SelectTrigger></FormControl>
                          <SelectContent>{terceros.map((t) => <SelectItem key={t.id} value={t.id}>{t.nombre} - {t.identificacion}</SelectItem>)}</SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <Dialog open={terceroDialogOpen} onOpenChange={setTerceroDialogOpen}>
                      <DialogTrigger asChild><Button type="button" variant="outline" className="mt-8"><Plus className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent><DialogHeader><DialogTitle>Agregar Tercero</DialogTitle></DialogHeader>
                        <Form {...terceroForm}><form onSubmit={terceroForm.handleSubmit(onSubmitTercero)} className="space-y-4">
                          <FormField control={terceroForm.control} name="tipoIdentificacion" render={({ field }) => (
                            <FormItem><FormLabel>Tipo Identificación</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="NIT">NIT</SelectItem><SelectItem value="CC">Cédula Ciudadanía</SelectItem><SelectItem value="CE">Cédula Extranjería</SelectItem><SelectItem value="Pasaporte">Pasaporte</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={terceroForm.control} name="identificacion" render={({ field }) => (<FormItem><FormLabel>Número Identificación</FormLabel><FormControl><Input placeholder="123456789" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={terceroForm.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input placeholder="Nombre del tercero" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setTerceroDialogOpen(false)}>Cancelar</Button><Button type="submit">Agregar</Button></div>
                        </form></Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Detalles */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Detalles de la Transacción</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="referenciaFactura" render={({ field }) => (<FormItem><FormLabel>Número de Factura *</FormLabel><FormControl><Input placeholder="FACT-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="fechaFactura" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Fecha Factura *</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="pointer-events-auto" /></PopoverContent>
                      </Popover><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="descripcionGasto" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Descripción del Gasto (Glosa) *</FormLabel><FormControl><Textarea placeholder="Descripción detallada del bien o servicio adquirido" className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Centro de Costos */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Centro de Costos</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <FormField control={form.control} name="centroCostosId" render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel>Centro de Costos *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Seleccione centro de costos" /></SelectTrigger></FormControl>
                          <SelectContent>{centrosCostos.map((c) => <SelectItem key={c.id} value={c.id}>{c.codigo} - {c.nombre}</SelectItem>)}</SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <Dialog open={centroCostosDialogOpen} onOpenChange={setCentroCostosDialogOpen}>
                      <DialogTrigger asChild><Button type="button" variant="outline" className="mt-8"><Plus className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent><DialogHeader><DialogTitle>Agregar Centro de Costos</DialogTitle></DialogHeader>
                        <Form {...centroCostosForm}><form onSubmit={centroCostosForm.handleSubmit(onSubmitCentroCostos)} className="space-y-4">
                          <FormField control={centroCostosForm.control} name="codigo" render={({ field }) => (<FormItem><FormLabel>Código</FormLabel><FormControl><Input placeholder="CC-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={centroCostosForm.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre</FormLabel><FormControl><Input placeholder="Nombre del centro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setCentroCostosDialogOpen(false)}>Cancelar</Button><Button type="submit">Agregar</Button></div>
                        </form></Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Valores e Impuestos */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Valores e Impuestos</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(["subtotal", "iva", "retencionFuente", "retencionIVA", "retencionICA"] as const).map((name) => {
                    const labels: Record<string, string> = { subtotal: "Subtotal (antes de impuestos) *", iva: "IVA *", retencionFuente: "Retención en la Fuente *", retencionIVA: "Retención IVA *", retencionICA: "Retención ICA *" };
                    return (
                      <FormField key={name} control={form.control} name={name} render={({ field }) => (
                        <FormItem><FormLabel>{labels[name]}</FormLabel><FormControl>
                          <Input type="text" placeholder="0" {...field} onChange={numericOnChange(field)} />
                        </FormControl>
                        {field.value && <p className="text-sm text-muted-foreground">${Number(field.value).toLocaleString()}</p>}
                        <FormMessage /></FormItem>
                      )} />
                    );
                  })}
                  <div className="flex items-end">
                    <div className="w-full p-4 bg-primary/10 rounded-lg border-2 border-primary">
                      <p className="text-sm font-medium text-muted-foreground">Total a Pagar</p>
                      <p className="text-2xl font-bold text-primary">${totalCalculado.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Distribución Contable */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Distribución Contable (PUC)</CardTitle>
                    <Dialog open={cuentaDialogOpen} onOpenChange={setCuentaDialogOpen}>
                      <DialogTrigger asChild><Button type="button" variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Agregar Cuenta</Button></DialogTrigger>
                      <DialogContent><DialogHeader><DialogTitle>Agregar Cuenta Contable</DialogTitle></DialogHeader>
                        <Form {...cuentaForm}><form onSubmit={cuentaForm.handleSubmit(onSubmitCuenta)} className="space-y-4">
                          <FormField control={cuentaForm.control} name="codigo" render={({ field }) => (<FormItem><FormLabel>Código Cuenta PUC</FormLabel><FormControl><Input placeholder="1105" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={cuentaForm.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre de la Cuenta</FormLabel><FormControl><Input placeholder="Caja" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={cuentaForm.control} name="tipo" render={({ field }) => (
                            <FormItem><FormLabel>Tipo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="debito">Débito</SelectItem><SelectItem value="credito">Crédito</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                          )} />
                          <FormField control={cuentaForm.control} name="valor" render={({ field }) => (
                            <FormItem><FormLabel>Valor</FormLabel><FormControl><Input type="text" placeholder="0" {...field} onChange={numericOnChange(field)} /></FormControl>
                            {field.value && <p className="text-sm text-muted-foreground">${Number(field.value).toLocaleString()}</p>}<FormMessage /></FormItem>
                          )} />
                          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setCuentaDialogOpen(false)}>Cancelar</Button><Button type="submit">Agregar</Button></div>
                        </form></Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {cuentasContables.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No hay cuentas agregadas. Agregue al menos una cuenta contable.</div>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Cuenta</TableHead><TableHead>Débito</TableHead><TableHead>Crédito</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {cuentasContables.map((cuenta) => (
                          <TableRow key={cuenta.id}>
                            <TableCell className="font-mono">{cuenta.codigo}</TableCell>
                            <TableCell>{cuenta.nombre}</TableCell>
                            <TableCell>{cuenta.tipo === "debito" ? `$${cuenta.valor.toLocaleString()}` : "-"}</TableCell>
                            <TableCell>{cuenta.tipo === "credito" ? `$${cuenta.valor.toLocaleString()}` : "-"}</TableCell>
                            <TableCell className="text-right"><Button type="button" variant="ghost" size="sm" onClick={() => eliminarCuenta(cuenta.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold bg-muted/50">
                          <TableCell colSpan={2}>TOTALES</TableCell>
                          <TableCell>${totalDebitos.toLocaleString()}</TableCell>
                          <TableCell>${totalCreditos.toLocaleString()}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                  {cuentasContables.length > 0 && totalDebitos !== totalCreditos && (
                    <p className="text-destructive text-sm mt-2">⚠️ Los débitos y créditos deben estar balanceados (igual monto).</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
                <Button type="submit" disabled={cuentasContables.length === 0 || totalDebitos !== totalCreditos}>
                  {editandoDocumento ? "Actualizar Documento" : "Guardar Documento"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!documentoAEliminar} onOpenChange={() => setDocumentoAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El documento será eliminado permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => documentoAEliminar && eliminarDocumento(documentoAEliminar)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
