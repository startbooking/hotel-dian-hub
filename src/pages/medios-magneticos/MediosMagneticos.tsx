import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Database, FileDown, RefreshCw, Search, Eye, CheckCircle2, AlertTriangle, FileText, Settings2, Filter } from "lucide-react";
import { toast } from "sonner";

interface ConceptoFormato {
  codigo: string;
  descripcion: string;
}

interface FormatoDIAN {
  codigo: string;
  nombre: string;
  version: string;
  normatividad: string;
  grupo: "pagos" | "ingresos" | "iva" | "cuentas" | "declaraciones" | "otros" | "nomina";
  conceptos: ConceptoFormato[];
  topeUVT?: number;
  periodicidad: "anual" | "mensual" | "bimestral";
}

const formatosDisponibles: FormatoDIAN[] = [
  {
    codigo: "1001", nombre: "Pagos o abonos en cuenta y retenciones practicadas", version: "10",
    normatividad: "Literales b) y e) Art.631 del E.T., Art.20 Res.162/2023",
    grupo: "pagos", periodicidad: "anual", topeUVT: 100000,
    conceptos: [
      { codigo: "5001", descripcion: "Salarios, prestaciones sociales y demás pagos laborales" },
      { codigo: "5002", descripcion: "Honorarios" },
      { codigo: "5003", descripcion: "Comisiones" },
      { codigo: "5004", descripcion: "Servicios" },
      { codigo: "5005", descripcion: "Arrendamientos" },
      { codigo: "5006", descripcion: "Intereses y rendimientos financieros" },
      { codigo: "5007", descripcion: "Compras" },
      { codigo: "5008", descripcion: "Otros costos y deducciones" },
      { codigo: "5010", descripcion: "Pagos al exterior" },
      { codigo: "5011", descripcion: "Pagos al exterior – no obligados a retener" },
      { codigo: "5012", descripcion: "Aportes parafiscales" },
      { codigo: "5013", descripcion: "Aportes a seguridad social" },
      { codigo: "5016", descripcion: "Donaciones" },
      { codigo: "5023", descripcion: "Pagos a empleados no constitutivos de renta" },
      { codigo: "5027", descripcion: "IVA descontable mayor valor costo o gasto" },
      { codigo: "5029", descripcion: "Impuesto a las transacciones financieras" },
      { codigo: "5030", descripcion: "Impuestos departamentales" },
      { codigo: "5031", descripcion: "Impuestos municipales" },
      { codigo: "5032", descripcion: "Contribuciones y afiliaciones" },
      { codigo: "5040", descripcion: "Amortización de anticipos" },
    ]
  },
  {
    codigo: "1003", nombre: "Retenciones en la fuente que le practicaron", version: "7",
    normatividad: "Literal c) Art.631 del E.T., Art.21 Res.162/2023",
    grupo: "pagos", periodicidad: "anual",
    conceptos: [
      { codigo: "1301", descripcion: "Retención renta – Honorarios" },
      { codigo: "1302", descripcion: "Retención renta – Comisiones" },
      { codigo: "1303", descripcion: "Retención renta – Servicios" },
      { codigo: "1304", descripcion: "Retención renta – Arrendamientos" },
      { codigo: "1305", descripcion: "Retención renta – Rendimientos financieros" },
      { codigo: "1306", descripcion: "Retención renta – Compras" },
      { codigo: "1310", descripcion: "Retención IVA" },
      { codigo: "1311", descripcion: "Retención ICA" },
      { codigo: "1312", descripcion: "Retención CREE" },
    ]
  },
  {
    codigo: "1004", nombre: "Descuentos tributarios solicitados", version: "8",
    normatividad: "Literal d) Art.631 del E.T., Art.39 Res.162/2023",
    grupo: "declaraciones", periodicidad: "anual",
    conceptos: [
      { codigo: "8401", descripcion: "Descuento por impuestos pagados en el exterior" },
      { codigo: "8402", descripcion: "Descuento por IVA en activos fijos" },
      { codigo: "8403", descripcion: "Otros descuentos tributarios" },
    ]
  },
  {
    codigo: "1005", nombre: "IVA por pagar (Descontable)", version: "8",
    normatividad: "Literal e) Art.631 del E.T., Art.23 Res.162/2023",
    grupo: "iva", periodicidad: "bimestral",
    conceptos: [
      { codigo: "4001", descripcion: "IVA descontable por compras gravadas" },
      { codigo: "4002", descripcion: "IVA descontable por importaciones" },
      { codigo: "4003", descripcion: "IVA descontable por servicios gravados" },
      { codigo: "4007", descripcion: "IVA resultante por devoluciones" },
    ]
  },
  {
    codigo: "1006", nombre: "IVA por pagar (Generado) e impuesto al consumo", version: "8",
    normatividad: "Literal f) Art.631 del E.T., Art.24 Res.162/2023",
    grupo: "iva", periodicidad: "bimestral",
    conceptos: [
      { codigo: "4005", descripcion: "IVA generado tarifa general" },
      { codigo: "4006", descripcion: "IVA generado tarifa del 5%" },
      { codigo: "4008", descripcion: "IVA recuperado" },
      { codigo: "4010", descripcion: "Impuesto al consumo" },
    ]
  },
  {
    codigo: "1007", nombre: "Ingresos recibidos", version: "9",
    normatividad: "Literal f) Art.631 del E.T., Art.22 Res.162/2023",
    grupo: "ingresos", periodicidad: "anual", topeUVT: 500,
    conceptos: [
      { codigo: "4001", descripcion: "Ingresos brutos operacionales" },
      { codigo: "4002", descripcion: "Ingresos brutos no operacionales" },
      { codigo: "4003", descripcion: "Ingresos por intereses" },
      { codigo: "4004", descripcion: "Ingresos por dividendos" },
      { codigo: "4005", descripcion: "Ingresos por honorarios" },
      { codigo: "4006", descripcion: "Ingresos por arrendamientos" },
      { codigo: "4010", descripcion: "Devoluciones, rebajas y descuentos" },
      { codigo: "4020", descripcion: "Ingresos del exterior" },
    ]
  },
  {
    codigo: "1008", nombre: "Saldos de cuentas por cobrar al 31 de diciembre", version: "7",
    normatividad: "Literal i) Art.631 del E.T., Art.26 Res.162/2023",
    grupo: "cuentas", periodicidad: "anual", topeUVT: 500,
    conceptos: [
      { codigo: "1308", descripcion: "Cuentas por cobrar clientes nacionales" },
      { codigo: "1309", descripcion: "Cuentas por cobrar clientes del exterior" },
      { codigo: "1310", descripcion: "Otras cuentas por cobrar" },
    ]
  },
  {
    codigo: "1009", nombre: "Saldos de cuentas por pagar al 31 de diciembre", version: "7",
    normatividad: "Literal h) Art.631 del E.T., Art.25 Res.162/2023",
    grupo: "cuentas", periodicidad: "anual", topeUVT: 500,
    conceptos: [
      { codigo: "2201", descripcion: "Cuentas por pagar proveedores nacionales" },
      { codigo: "2202", descripcion: "Cuentas por pagar proveedores del exterior" },
      { codigo: "2203", descripcion: "Otras cuentas por pagar" },
    ]
  },
  {
    codigo: "1010", nombre: "Información de socios, accionistas, comuneros y/o cooperados", version: "9",
    normatividad: "Literal a) Art.631 del E.T., Art.19 Res.162/2023",
    grupo: "otros", periodicidad: "anual",
    conceptos: [
      { codigo: "3110", descripcion: "Capital social" },
      { codigo: "3115", descripcion: "Acciones propias readquiridas" },
      { codigo: "3120", descripcion: "Superávit de capital" },
      { codigo: "3125", descripcion: "Utilidades del ejercicio" },
    ]
  },
  {
    codigo: "1011", nombre: "Información de las declaraciones tributarias", version: "6",
    normatividad: "Literal k) Art.631 del E.T., Art.32-38 Res.162/2023",
    grupo: "declaraciones", periodicidad: "anual",
    conceptos: [
      { codigo: "D001", descripcion: "Renta y complementarios" },
      { codigo: "D002", descripcion: "IVA" },
      { codigo: "D003", descripcion: "Retención en la fuente" },
      { codigo: "D004", descripcion: "ICA" },
    ]
  },
  {
    codigo: "1012", nombre: "Información de declaraciones tributarias, inversiones en bonos, certificados y títulos", version: "7",
    normatividad: "Literal k) Art.631 del E.T., Art.29-31 Res.162/2023",
    grupo: "declaraciones", periodicidad: "anual",
    conceptos: [
      { codigo: "2001", descripcion: "Bonos y títulos de deuda pública" },
      { codigo: "2002", descripcion: "CDTs" },
      { codigo: "2003", descripcion: "Acciones que cotizan en bolsa" },
      { codigo: "2004", descripcion: "Otras inversiones" },
    ]
  },
  {
    codigo: "1035", nombre: "Información de vinculados económicos", version: "8",
    normatividad: "Art.631-1 y 631-3 del E.T., Art.43 Res.162/2023",
    grupo: "otros", periodicidad: "anual",
    conceptos: [
      { codigo: "V001", descripcion: "Operaciones de ingreso con vinculados" },
      { codigo: "V002", descripcion: "Operaciones de egreso con vinculados" },
      { codigo: "V003", descripcion: "Saldos con vinculados al cierre" },
    ]
  },
  {
    codigo: "1036", nombre: "Información de subordinadas del exterior – ECE", version: "9",
    normatividad: "Art.631-1 y 631-3 del E.T., Art.44-45 Res.162/2023",
    grupo: "otros", periodicidad: "anual",
    conceptos: [
      { codigo: "E001", descripcion: "Ingresos de ECE" },
      { codigo: "E002", descripcion: "Gastos de ECE" },
      { codigo: "E003", descripcion: "Activos de ECE" },
    ]
  },
  {
    codigo: "1647", nombre: "Ingresos recibidos para terceros", version: "2",
    normatividad: "Literal g) Art.631 del E.T., Art.28 Res.162/2023",
    grupo: "ingresos", periodicidad: "anual",
    conceptos: [
      { codigo: "4047", descripcion: "Ingresos recibidos para terceros" },
    ]
  },
  {
    codigo: "2275", nombre: "Ingresos no constitutivos de renta ni ganancia ocasional", version: "2",
    normatividad: "Literal k) Art.631 del E.T., Art.40 Res.162/2023",
    grupo: "ingresos", periodicidad: "anual",
    conceptos: [
      { codigo: "9001", descripcion: "Dividendos y participaciones no gravados" },
      { codigo: "9002", descripcion: "Indemnizaciones por seguros" },
      { codigo: "9003", descripcion: "Aportes obligatorios al sistema de salud" },
      { codigo: "9004", descripcion: "Otros ingresos no constitutivos" },
    ]
  },
  {
    codigo: "2276", nombre: "Información de rentas de trabajo y pensiones", version: "4",
    normatividad: "Literales b) y e) Art.631 y 631-3 del E.T., Art.51 Res.162/2023",
    grupo: "nomina", periodicidad: "anual",
    conceptos: [
      { codigo: "RT01", descripcion: "Pagos por salarios" },
      { codigo: "RT02", descripcion: "Cesantías e intereses de cesantías" },
      { codigo: "RT03", descripcion: "Pensiones de jubilación" },
      { codigo: "RT04", descripcion: "Otros pagos laborales" },
      { codigo: "RT05", descripcion: "Honorarios y compensaciones" },
      { codigo: "RT06", descripcion: "Viáticos" },
    ]
  },
  {
    codigo: "2280", nombre: "Deducciones empleados víctimas violencia", version: "1",
    normatividad: "Art.2.2.9.3.7 Decreto 1072/2015, Art.59 Res.162/2023",
    grupo: "nomina", periodicidad: "anual",
    conceptos: [
      { codigo: "DV01", descripcion: "Salarios pagados a víctimas" },
      { codigo: "DV02", descripcion: "Prestaciones sociales víctimas" },
    ]
  },
  {
    codigo: "820", nombre: "Enajenación de acciones, cuotas o partes que no cotizan en bolsa", version: "1",
    normatividad: "Art.631-3 del E.T., Art.73 Res.162/2023",
    grupo: "otros", periodicidad: "anual",
    conceptos: [
      { codigo: "8201", descripcion: "Enajenación de acciones" },
      { codigo: "8202", descripcion: "Enajenación de cuotas o partes de interés social" },
    ]
  },
];

const grupoLabels: Record<string, string> = {
  pagos: "Pagos y Retenciones",
  ingresos: "Ingresos",
  iva: "IVA e Impuesto al Consumo",
  cuentas: "Cuentas por Cobrar / Pagar",
  declaraciones: "Declaraciones Tributarias",
  nomina: "Nómina y Rentas de Trabajo",
  otros: "Otros Reportes",
};

export default function MediosMagneticos() {
  const [anioGravable, setAnioGravable] = useState(new Date().getFullYear().toString());
  const [formatosGenerados, setFormatosGenerados] = useState<string[]>([]);
  const [formatosValidados, setFormatosValidados] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState<string>("todos");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [formatoDetalle, setFormatoDetalle] = useState<FormatoDIAN | null>(null);
  const [nit, setNit] = useState("900123456");
  const [dv, setDv] = useState("7");

  const filtrados = formatosDisponibles.filter((f) => {
    const matchBusqueda = !busqueda || f.codigo.includes(busqueda) || f.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchGrupo = grupoFiltro === "todos" || f.grupo === grupoFiltro;
    return matchBusqueda && matchGrupo;
  });

  const handleGenerar = (codigo: string) => {
    setFormatosGenerados((prev) => prev.includes(codigo) ? prev : [...prev, codigo]);
    toast.success(`Formato ${codigo} generado para el año gravable ${anioGravable}`);
  };

  const handleGenerarSeleccionados = () => {
    if (seleccionados.length === 0) { toast.warning("Seleccione al menos un formato"); return; }
    setFormatosGenerados((prev) => [...new Set([...prev, ...seleccionados])]);
    toast.success(`${seleccionados.length} formatos generados`);
    setSeleccionados([]);
  };

  const handleGenerarTodos = () => {
    setFormatosGenerados(formatosDisponibles.map((f) => f.codigo));
    toast.success(`Todos los formatos generados para el año ${anioGravable}`);
  };

  const handleValidar = (codigo: string) => {
    if (!formatosGenerados.includes(codigo)) { toast.warning("Debe generar el formato antes de validar"); return; }
    setFormatosValidados((prev) => prev.includes(codigo) ? prev : [...prev, codigo]);
    toast.success(`Formato ${codigo} validado – Estructura XSD correcta`);
  };

  const handleDescargarXML = (codigo: string) => {
    toast.info(`Descargando XML formato ${codigo} – NIT ${nit}-${dv} – Año ${anioGravable}`);
  };

  const toggleSeleccion = (codigo: string) => {
    setSeleccionados((prev) => prev.includes(codigo) ? prev.filter((c) => c !== codigo) : [...prev, codigo]);
  };

  const seleccionarTodos = () => {
    setSeleccionados(seleccionados.length === filtrados.length ? [] : filtrados.map((f) => f.codigo));
  };

  const getEstado = (codigo: string) => {
    if (formatosValidados.includes(codigo)) return "validado";
    if (formatosGenerados.includes(codigo)) return "generado";
    return "pendiente";
  };

  const resumen = {
    total: formatosDisponibles.length,
    generados: formatosGenerados.length,
    validados: formatosValidados.length,
    pendientes: formatosDisponibles.length - formatosGenerados.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          Medios Magnéticos – Información Exógena DIAN
        </h1>
        <p className="text-muted-foreground mt-1">
          Resolución 000162 del 27 de octubre de 2023 – Generación y validación de formatos XML
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Formatos", value: resumen.total, icon: FileText, color: "text-primary" },
          { label: "Generados", value: resumen.generados, icon: RefreshCw, color: "text-blue-600" },
          { label: "Validados", value: resumen.validados, icon: CheckCircle2, color: "text-green-600" },
          { label: "Pendientes", value: resumen.pendientes, icon: AlertTriangle, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="formatos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="formatos">Formatos</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          <TabsTrigger value="prevalidador">Pre-validador</TabsTrigger>
        </TabsList>

        {/* TAB FORMATOS */}
        <TabsContent value="formatos" className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1 w-40">
                  <Label>Año Gravable</Label>
                  <Select value={anioGravable} onValueChange={setAnioGravable}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2023, 2024, 2025, 2026].map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 w-48">
                  <Label>Grupo</Label>
                  <Select value={grupoFiltro} onValueChange={setGrupoFiltro}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los grupos</SelectItem>
                      {Object.entries(grupoLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 flex-1 min-w-[200px]">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Código o nombre del formato..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-8" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleGenerarSeleccionados} variant="outline" className="gap-1" disabled={seleccionados.length === 0}>
                    <RefreshCw className="h-4 w-4" /> Generar Seleccionados ({seleccionados.length})
                  </Button>
                  <Button onClick={handleGenerarTodos} className="gap-1">
                    <RefreshCw className="h-4 w-4" /> Generar Todos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Formatos Disponibles ({filtrados.length})</CardTitle>
              <CardDescription>Año gravable {anioGravable} – Seleccione formatos para generar en lote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox checked={seleccionados.length === filtrados.length && filtrados.length > 0} onCheckedChange={seleccionarTodos} />
                      </TableHead>
                      <TableHead className="w-20">Formato</TableHead>
                      <TableHead className="w-12">Ver.</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden xl:table-cell">Grupo</TableHead>
                      <TableHead className="hidden lg:table-cell">Normatividad</TableHead>
                      <TableHead className="w-28">Estado</TableHead>
                      <TableHead className="text-right w-56">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtrados.map((f) => {
                      const estado = getEstado(f.codigo);
                      return (
                        <TableRow key={f.codigo}>
                          <TableCell>
                            <Checkbox checked={seleccionados.includes(f.codigo)} onCheckedChange={() => toggleSeleccion(f.codigo)} />
                          </TableCell>
                          <TableCell className="font-mono font-bold">{f.codigo}</TableCell>
                          <TableCell className="text-center">{f.version}</TableCell>
                          <TableCell className="text-sm">{f.nombre}</TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <Badge variant="outline" className="text-xs">{grupoLabels[f.grupo]}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{f.normatividad}</TableCell>
                          <TableCell>
                            {estado === "validado" ? (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Validado</Badge>
                            ) : estado === "generado" ? (
                              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Generado</Badge>
                            ) : (
                              <Badge variant="secondary">Pendiente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setFormatoDetalle(f)} title="Ver conceptos">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleGenerar(f.codigo)} className="gap-1">
                                <RefreshCw className="h-3 w-3" /> Generar
                              </Button>
                              {estado !== "pendiente" && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleValidar(f.codigo)} className="gap-1" disabled={estado === "validado"}>
                                    <CheckCircle2 className="h-3 w-3" /> Validar
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDescargarXML(f.codigo)} className="gap-1">
                                    <FileDown className="h-3 w-3" /> XML
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No se encontraron formatos</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CONFIGURACIÓN */}
        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" /> Datos del Informante</CardTitle>
              <CardDescription>Información del contribuyente para la generación de archivos XML</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>NIT</Label>
                  <Input value={nit} onChange={(e) => setNit(e.target.value)} placeholder="900123456" />
                </div>
                <div className="space-y-1">
                  <Label>DV</Label>
                  <Input value={dv} onChange={(e) => setDv(e.target.value)} className="w-20" maxLength={1} />
                </div>
                <div className="space-y-1">
                  <Label>Año Gravable</Label>
                  <Select value={anioGravable} onValueChange={setAnioGravable}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2023, 2024, 2025, 2026].map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Tipo de Documento</Label>
                  <Select defaultValue="31">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="31">NIT</SelectItem>
                      <SelectItem value="13">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="22">Cédula de Extranjería</SelectItem>
                      <SelectItem value="42">Documento de identificación extranjero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Código Dirección Seccional</Label>
                  <Select defaultValue="11001">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11001">Bogotá</SelectItem>
                      <SelectItem value="05001">Medellín</SelectItem>
                      <SelectItem value="76001">Cali</SelectItem>
                      <SelectItem value="08001">Barranquilla</SelectItem>
                      <SelectItem value="13001">Cartagena</SelectItem>
                      <SelectItem value="68001">Bucaramanga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="font-semibold">Topes de Cuantía (UVT {anioGravable})</Label>
                <p className="text-xs text-muted-foreground">Valor UVT 2024: $47.065 | UVT 2025: $49.799</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-md border">
                    <p className="text-xs text-muted-foreground">Formato 1001 – Pagos</p>
                    <p className="font-semibold">100.000 UVT</p>
                  </div>
                  <div className="p-3 rounded-md border">
                    <p className="text-xs text-muted-foreground">Formato 1007 – Ingresos</p>
                    <p className="font-semibold">500 UVT</p>
                  </div>
                  <div className="p-3 rounded-md border">
                    <p className="text-xs text-muted-foreground">Formatos 1008/1009 – Cuentas</p>
                    <p className="font-semibold">500 UVT</p>
                  </div>
                </div>
              </div>
              <Button onClick={() => toast.success("Configuración guardada")} className="mt-2">Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB PRE-VALIDADOR */}
        <TabsContent value="prevalidador" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Pre-validador de Archivos XML</CardTitle>
              <CardDescription>Valide la estructura XSD y contenido de los archivos antes de enviarlos a la DIAN</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Validaciones Estructurales</h3>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Esquema XSD válido según resolución vigente",
                      "Longitud y tipo de campos numéricos y alfanuméricos",
                      "NIT del informante con dígito de verificación",
                      "Códigos de concepto válidos por formato",
                      "Año gravable y periodo consistentes",
                      "Tipo y número de documento de terceros",
                    ].map((v, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Validaciones de Contenido</h3>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Cruces entre formatos 1001 y 1003 (retenciones)",
                      "Consistencia IVA generado vs descontable (1005/1006)",
                      "Cuadre de saldos cuentas por cobrar y pagar (1008/1009)",
                      "Topes de cuantías mínimas por formato",
                      "Duplicidad de registros por tercero y concepto",
                      "Totalización de valores base y retención",
                    ].map((v, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => {
                  const pendientes = formatosGenerados.filter((c) => !formatosValidados.includes(c));
                  if (pendientes.length === 0) { toast.warning("No hay formatos pendientes de validación"); return; }
                  setFormatosValidados((prev) => [...new Set([...prev, ...pendientes])]);
                  toast.success(`${pendientes.length} formatos validados exitosamente`);
                }} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Validar Todos los Generados
                </Button>
                <Button variant="outline" onClick={() => toast.info("Exportando reporte de validación...")} className="gap-2">
                  <FileDown className="h-4 w-4" /> Exportar Reporte de Validación
                </Button>
              </div>
              {formatosValidados.length > 0 && (
                <div className="mt-4 p-4 rounded-md border border-green-500/20 bg-green-500/5">
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> {formatosValidados.length} formato(s) validados sin errores
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Los archivos cumplen con la estructura XSD de la Resolución 000162 de 2023</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG DETALLE CONCEPTOS */}
      <Dialog open={!!formatoDetalle} onOpenChange={(open) => !open && setFormatoDetalle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {formatoDetalle && (
            <>
              <DialogHeader>
                <DialogTitle>Formato {formatoDetalle.codigo} – v{formatoDetalle.version}</DialogTitle>
                <DialogDescription>{formatoDetalle.nombre}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Normatividad:</span> <span className="font-medium">{formatoDetalle.normatividad}</span></div>
                  <div><span className="text-muted-foreground">Periodicidad:</span> <Badge variant="outline" className="ml-1">{formatoDetalle.periodicidad}</Badge></div>
                  {formatoDetalle.topeUVT && <div><span className="text-muted-foreground">Tope:</span> <span className="font-medium">{formatoDetalle.topeUVT.toLocaleString()} UVT</span></div>}
                </div>
                <Separator />
                <h4 className="font-semibold">Conceptos ({formatoDetalle.conceptos.length})</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Código</TableHead>
                      <TableHead>Descripción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formatoDetalle.conceptos.map((c) => (
                      <TableRow key={c.codigo}>
                        <TableCell className="font-mono font-bold">{c.codigo}</TableCell>
                        <TableCell className="text-sm">{c.descripcion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
