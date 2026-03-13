import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, FileText, Receipt, Download, FileArchive, FileCode } from "lucide-react";
import { FacturaModal, FacturaData } from "@/components/facturacion/FacturaModal";
import { api, FacturaElectronica } from "@/services/api";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

// Datos de fallback
const facturasMock: FacturaElectronica[] = [
  {
    id: "1",
    tipo: "factura",
    numero: "FE-001",
    prefijo: "FE",
    fecha: "2024-01-15",
    fechaVencimiento: "2024-02-15",
    cufe: "a1b2c3d4e5f6g7h8i9j0",
    cliente: {
      nombre: "Empresa ABC S.A.S",
      nit: "900.123.456-7",
      direccion: "Calle 100 #15-20, Bogotá",
      telefono: "601 234 5678",
      email: "contacto@empresaabc.com",
    },
    items: [
      { id: "1", codigo: "SRV001", descripcion: "Servicio de consultoría", cantidad: 10, valorUnitario: 150000, iva: 285000, total: 1785000 },
      { id: "2", codigo: "SRV002", descripcion: "Implementación de software", cantidad: 1, valorUnitario: 5000000, iva: 950000, total: 5950000 },
    ],
    subtotal: 6500000,
    iva: 1235000,
    total: 7735000,
    estado: "pendiente",
  },
  {
    id: "2",
    tipo: "factura",
    numero: "FE-002",
    prefijo: "FE",
    fecha: "2024-01-18",
    fechaVencimiento: "2024-02-18",
    cufe: "k1l2m3n4o5p6q7r8s9t0",
    cliente: {
      nombre: "Comercializadora XYZ Ltda",
      nit: "800.987.654-3",
      direccion: "Carrera 7 #45-10, Medellín",
      telefono: "604 567 8901",
      email: "ventas@xyz.com",
    },
    items: [
      { id: "1", codigo: "PROD001", descripcion: "Licencia de software anual", cantidad: 5, valorUnitario: 1200000, iva: 1140000, total: 7140000 },
    ],
    subtotal: 6000000,
    iva: 1140000,
    total: 7140000,
    estado: "pagada",
  },
  {
    id: "3",
    tipo: "nota_credito",
    numero: "NC-001",
    prefijo: "NC",
    fecha: "2024-01-20",
    fechaVencimiento: "2024-01-20",
    cufe: "u1v2w3x4y5z6a7b8c9d0",
    cliente: {
      nombre: "Empresa ABC S.A.S",
      nit: "900.123.456-7",
      direccion: "Calle 100 #15-20, Bogotá",
      telefono: "601 234 5678",
      email: "contacto@empresaabc.com",
    },
    items: [
      { id: "1", codigo: "SRV001", descripcion: "Descuento por pronto pago", cantidad: 1, valorUnitario: 500000, iva: 95000, total: 595000 },
    ],
    subtotal: 500000,
    iva: 95000,
    total: 595000,
    estado: "pagada",
  },
];

export default function Facturar() {
  const [facturas, setFacturas] = useState<FacturaElectronica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [selectedFactura, setSelectedFactura] = useState<FacturaData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    const fetchFacturas = async () => {
      setIsLoading(true);
      const response = await api.getFacturasElectronicas();
      if (response.success && response.data) {
        setFacturas(response.data);
      } else {
        console.warn("No se pudieron cargar facturas del PMS, usando datos de ejemplo");
        setFacturas(facturasMock);
      }
      setIsLoading(false);
    };
    fetchFacturas();
  }, []);

  const facturasFiltradas = facturas.filter((factura) => {
    const matchSearch =
      factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente.nit.includes(searchTerm);
    const matchTipo = tipoFiltro === "todos" || factura.tipo === tipoFiltro;
    const matchEstado = estadoFiltro === "todos" || factura.estado === estadoFiltro;
    return matchSearch && matchTipo && matchEstado;
  });

  const handleVerFactura = (factura: FacturaElectronica) => {
    const modalData: FacturaData = {
      ...factura,
      observaciones: `CUFE: ${factura.cufe}`,
    };
    setSelectedFactura(modalData);
    setModalOpen(true);
  };

  const handleDownload = (facturaId: string, type: "zip" | "xml" | "pdf") => {
    let url: string;
    switch (type) {
      case "zip":
        url = api.getFacturaZipUrl(facturaId);
        break;
      case "xml":
        url = api.getFacturaXmlUrl(facturaId);
        break;
      case "pdf":
        url = api.getFacturaPdfUrl(facturaId);
        break;
    }
    
    // Open download in new tab
    window.open(url, "_blank");
    toast.success(`Descargando ${type.toUpperCase()}...`);
  };

  const getTipoBadge = (tipo: FacturaElectronica["tipo"]) => {
    switch (tipo) {
      case "factura":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Factura</Badge>;
      case "nota_credito":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Nota Crédito</Badge>;
      case "nota_debito":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Nota Débito</Badge>;
    }
  };

  const getEstadoBadge = (estado: FacturaElectronica["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case "pagada":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pagada</Badge>;
      case "anulada":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Anulada</Badge>;
      case "enviada":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Enviada</Badge>;
    }
  };

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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facturas.filter((f) => f.tipo === "factura").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notas Crédito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facturas.filter((f) => f.tipo === "nota_credito").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {facturas.filter((f) => f.estado === "pendiente").length}
            </div>
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

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente o NIT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="factura">Facturas</SelectItem>
                <SelectItem value="nota_credito">Notas Crédito</SelectItem>
                <SelectItem value="nota_debito">Notas Débito</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="anulada">Anulada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de documentos */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Cargando facturas del PMS...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                {facturasFiltradas.map((factura) => (
                  <TableRow key={factura.id}>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(factura.id, "zip")}
                          title="Descargar ZIP"
                        >
                          <FileArchive className="h-4 w-4 text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(factura.id, "xml")}
                          title="Descargar XML"
                        >
                          <FileCode className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(factura.id, "pdf")}
                          title="Descargar PDF"
                        >
                          <FileText className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerFactura(factura)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {facturasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron documentos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <FacturaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        factura={selectedFactura}
      />
    </div>
  );
}
