import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Plus, Search, Eye, FileText, Receipt, CalendarIcon, FileArchive, FileCode, Upload, CheckCircle, Loader2 } from "lucide-react";
import { FacturaModal, FacturaData } from "@/components/facturacion/FacturaModal";
import { api, FacturaElectronica } from "@/services/api";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const facturasMock: FacturaElectronica[] = [
  {
    id: "1", tipo: "factura", numero: "FE-001", prefijo: "FE",
    fecha: new Date().toISOString().split("T")[0], fechaVencimiento: "2024-02-15",
    cufe: "a1b2c3d4e5f6g7h8i9j0",
    cliente: { nombre: "Empresa ABC S.A.S", nit: "900.123.456-7", direccion: "Calle 100 #15-20, Bogotá", telefono: "601 234 5678", email: "contacto@empresaabc.com" },
    items: [
      { id: "1", codigo: "SRV001", descripcion: "Servicio de consultoría", cantidad: 10, valorUnitario: 150000, iva: 285000, total: 1785000 },
      { id: "2", codigo: "SRV002", descripcion: "Implementación de software", cantidad: 1, valorUnitario: 5000000, iva: 950000, total: 5950000 },
    ],
    subtotal: 6500000, iva: 1235000, total: 7735000, estado: "pendiente",
  },
  {
    id: "2", tipo: "factura", numero: "FE-002", prefijo: "FE",
    fecha: new Date().toISOString().split("T")[0], fechaVencimiento: "2024-02-18",
    cufe: "k1l2m3n4o5p6q7r8s9t0",
    cliente: { nombre: "Comercializadora XYZ Ltda", nit: "800.987.654-3", direccion: "Carrera 7 #45-10, Medellín", telefono: "604 567 8901", email: "ventas@xyz.com" },
    items: [
      { id: "1", codigo: "PROD001", descripcion: "Licencia de software anual", cantidad: 5, valorUnitario: 1200000, iva: 1140000, total: 7140000 },
    ],
    subtotal: 6000000, iva: 1140000, total: 7140000, estado: "pagada",
  },
  {
    id: "3", tipo: "nota_credito", numero: "NC-001", prefijo: "NC",
    fecha: "2024-01-20", fechaVencimiento: "2024-01-20",
    cufe: "u1v2w3x4y5z6a7b8c9d0",
    cliente: { nombre: "Empresa ABC S.A.S", nit: "900.123.456-7", direccion: "Calle 100 #15-20, Bogotá", telefono: "601 234 5678", email: "contacto@empresaabc.com" },
    items: [
      { id: "1", codigo: "SRV001", descripcion: "Descuento por pronto pago", cantidad: 1, valorUnitario: 500000, iva: 95000, total: 595000 },
    ],
    subtotal: 500000, iva: 95000, total: 595000, estado: "pagada",
  },
];

export default function Facturar() {
  const [facturas, setFacturas] = useState<FacturaElectronica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFactura, setSelectedFactura] = useState<FacturaData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { company } = useCompany();

  const [filterCliente, setFilterCliente] = useState("");
  const [filterNumero, setFilterNumero] = useState("");

  const [histFechaDesde, setHistFechaDesde] = useState<Date | undefined>();
  const [histFechaHasta, setHistFechaHasta] = useState<Date | undefined>();
  const [histNumeroDesde, setHistNumeroDesde] = useState("");
  const [histNumeroHasta, setHistNumeroHasta] = useState("");
  const [histCliente, setHistCliente] = useState("");
  const [histFacturas, setHistFacturas] = useState<FacturaElectronica[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importando, setImportando] = useState(false);

  useEffect(() => {
    const fetchFacturas = async () => {
      setIsLoading(true);
      const response = await api.getFacturasElectronicas();
      if (response.success && response.data) {
        setFacturas(response.data);
      } else {
        setFacturas(facturasMock);
      }
      setIsLoading(false);
    };
    fetchFacturas();
  }, []);

  const hoy = new Date().toISOString().split("T")[0];

  const facturasDelDia = facturas
    .filter((f) => f.fecha === hoy)
    .filter((f) => {
      const matchCliente = !filterCliente || f.cliente.nombre.toLowerCase().includes(filterCliente.toLowerCase());
      const matchNumero = !filterNumero || f.numero.toLowerCase().includes(filterNumero.toLowerCase());
      return matchCliente && matchNumero;
    });

  const handleBuscarHistorico = () => {
    setHistLoading(true);
    setSelectedIds(new Set());
    const resultado = facturas.filter((f) => {
      const fechaFactura = new Date(f.fecha);
      const matchDesde = !histFechaDesde || fechaFactura >= histFechaDesde;
      const matchHasta = !histFechaHasta || fechaFactura <= histFechaHasta;
      const matchNumDesde = !histNumeroDesde || f.numero >= histNumeroDesde;
      const matchNumHasta = !histNumeroHasta || f.numero <= histNumeroHasta;
      const matchCliente = !histCliente || f.cliente.nombre.toLowerCase().includes(histCliente.toLowerCase());
      return matchDesde && matchHasta && matchNumDesde && matchNumHasta && matchCliente;
    });
    setHistFacturas(resultado);
    setHistLoading(false);
    toast.success(`Se encontraron ${resultado.length} facturas`);
  };

  const handleVerFactura = (factura: FacturaElectronica) => {
    setSelectedFactura({ ...factura, observaciones: `CUFE: ${factura.cufe}` });
    setModalOpen(true);
  };

  const handleDownload = (facturaId: string, type: "zip" | "xml" | "pdf") => {
    const urlMap = { zip: api.getFacturaZipUrl(facturaId), xml: api.getFacturaXmlUrl(facturaId), pdf: api.getFacturaPdfUrl(facturaId) };
    window.open(urlMap[type], "_blank");
    toast.success(`Descargando ${type.toUpperCase()}...`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (data: FacturaElectronica[]) => {
    const seleccionables = data.filter((f) => (f as any).estado !== "contabilizada");
    if (seleccionables.length > 0 && seleccionables.every((f) => selectedIds.has(f.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(seleccionables.map((f) => f.id)));
    }
  };

  const handleImportarContabilidad = async () => {
    if (selectedIds.size === 0) {
      toast.error("Seleccione al menos una factura para importar");
      return;
    }

    const facturasSeleccionadas = histFacturas.filter((f) => selectedIds.has(f.id));
    setImportando(true);

    try {
      const importResult = await api.importarFacturasContabilidad(facturasSeleccionadas);

      if (!importResult.success) {
        toast.error(importResult.error || "Error al importar facturas a contabilidad");
        setImportando(false);
        return;
      }

      const ids = Array.from(selectedIds);
      const updateResult = await api.actualizarEstadoFacturasPMS(ids);

      if (updateResult.success) {
        setFacturas((prev) =>
          prev.map((f) => (selectedIds.has(f.id) ? { ...f, estado: "contabilizada" as any } : f))
        );
        setHistFacturas((prev) =>
          prev.map((f) => (selectedIds.has(f.id) ? { ...f, estado: "contabilizada" as any } : f))
        );
        setSelectedIds(new Set());
        toast.success(`${ids.length} factura(s) importada(s) a contabilidad exitosamente`);
      } else {
        toast.warning("Facturas importadas pero no se pudo actualizar el estado en el PMS");
      }
    } catch {
      toast.error("Error inesperado al importar facturas");
    } finally {
      setImportando(false);
    }
  };

  const getTipoBadge = (tipo: FacturaElectronica["tipo"]) => {
    const map = {
      factura: <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Factura</Badge>,
      nota_credito: <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Nota Crédito</Badge>,
      nota_debito: <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Nota Débito</Badge>,
    };
    return map[tipo];
  };

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, JSX.Element> = {
      pendiente: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>,
      pagada: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pagada</Badge>,
      anulada: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Anulada</Badge>,
      enviada: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Enviada</Badge>,
      contabilizada: <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1 inline" />Contabilizada</Badge>,
    };
    return map[estado] || <Badge variant="outline">{estado}</Badge>;
  };

  const renderFacturasTable = (data: FacturaElectronica[], loading: boolean, showSelect = false) => (
    loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Cargando facturas...</div>
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            {showSelect && (
              <TableHead className="w-10">
                <Checkbox
                  checked={data.filter((f) => (f as any).estado !== "contabilizada").length > 0 && data.filter((f) => (f as any).estado !== "contabilizada").every((f) => selectedIds.has(f.id))}
                  onCheckedChange={() => toggleSelectAll(data)}
                />
              </TableHead>
            )}
            <TableHead>Tipo</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>NIT</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Descargas</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((factura) => {
            const contabilizada = (factura as any).estado === "contabilizada";
            return (
              <TableRow key={factura.id} className={contabilizada ? "opacity-60" : ""}>
                {showSelect && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(factura.id)}
                      onCheckedChange={() => toggleSelect(factura.id)}
                      disabled={contabilizada}
                    />
                  </TableCell>
                )}
                <TableCell>{getTipoBadge(factura.tipo)}</TableCell>
                <TableCell className="font-medium">{factura.numero}</TableCell>
                <TableCell>{factura.fecha}</TableCell>
                <TableCell>{factura.cliente.nombre}</TableCell>
                <TableCell>{factura.cliente.nit}</TableCell>
                <TableCell className="text-right font-medium">
                  ${factura.total.toLocaleString("es-CO")}
                </TableCell>
                <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(factura.id, "zip")} title="Descargar ZIP">
                      <FileArchive className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(factura.id, "xml")} title="Descargar XML">
                      <FileCode className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(factura.id, "pdf")} title="Descargar PDF">
                      <FileText className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" onClick={() => handleVerFactura(factura)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={showSelect ? 10 : 9} className="text-center py-8 text-muted-foreground">
                No se encontraron documentos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facturación Electrónica</h1>
          <p className="text-muted-foreground mt-1">
            {company ? `${company.empresa} - NIT: ${company.nit}` : "Gestión de facturas electrónicas"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            Nueva Nota Crédito
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturas.filter((f) => f.tipo === "factura").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notas Crédito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturas.filter((f) => f.tipo === "nota_credito").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{facturas.filter((f) => f.estado === "pendiente").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${facturas.filter((f) => f.tipo === "factura").reduce((acc, f) => acc + f.total, 0).toLocaleString("es-CO")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hoy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hoy">Facturas del Día</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Facturas</TabsTrigger>
        </TabsList>

        <TabsContent value="hoy" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filtrar por cliente..." value={filterCliente} onChange={(e) => setFilterCliente(e.target.value)} className="pl-10" />
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filtrar por número de factura..." value={filterNumero} onChange={(e) => setFilterNumero(e.target.value)} className="pl-10" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              {renderFacturasTable(facturasDelDia, isLoading)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Fecha Desde</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !histFechaDesde && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {histFechaDesde ? format(histFechaDesde, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={histFechaDesde} onSelect={setHistFechaDesde} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fecha Hasta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !histFechaHasta && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {histFechaHasta ? format(histFechaHasta, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={histFechaHasta} onSelect={setHistFechaHasta} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Factura Desde</Label>
                  <Input placeholder="Ej: FE-001" value={histNumeroDesde} onChange={(e) => setHistNumeroDesde(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Factura Hasta</Label>
                  <Input placeholder="Ej: FE-100" value={histNumeroHasta} onChange={(e) => setHistNumeroHasta(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input placeholder="Nombre del cliente" value={histCliente} onChange={(e) => setHistCliente(e.target.value)} />
                </div>
                <Button onClick={handleBuscarHistorico} className="h-10">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {histFacturas.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedIds.size > 0
                  ? `${selectedIds.size} factura(s) seleccionada(s)`
                  : "Seleccione facturas para importar a contabilidad"}
              </p>
              <Button
                onClick={handleImportarContabilidad}
                disabled={selectedIds.size === 0 || importando}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {importando ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {importando ? "Importando..." : "Importar a Contabilidad"}
              </Button>
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              {renderFacturasTable(histFacturas, histLoading, true)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FacturaModal open={modalOpen} onOpenChange={setModalOpen} factura={selectedFactura} />
    </div>
  );
}