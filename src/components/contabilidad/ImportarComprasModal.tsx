import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Trash2, Plus, Download, FileText } from "lucide-react";
import { api } from "@/services/api";

interface FacturaItem {
  codigo: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
  ivaPorc: number;
  iva: number;
  total: number;
}

interface FacturaDIAN {
  cufe: string;
  numero: string;
  prefijo: string;
  fecha: string;
  formaPago: string;
  proveedor: {
    nombre: string;
    nit: string;
    direccion: string;
    regimen: string;
  };
  items: FacturaItem[];
  subtotal: number;
  iva: number;
  retencionFuente: number;
  retencionFuentePorc: number;
  retencionIVA: number;
  retencionIVAPorc: number;
  retencionICA: number;
  retencionICAPorc: number;
  total: number;
  totalPagar: number;
}

interface CuentaAsignada {
  id: string;
  codigoCuenta: string;
  nombreCuenta: string;
  tipo: "debito" | "credito";
  valor: number;
  concepto: string;
}

interface ImportarComprasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: (factura: FacturaDIAN, cuentas: CuentaAsignada[]) => void;
}

type Paso = "cufe" | "resultado" | "cuentas";

// Mock de ejemplo de factura de compra electrónica
const MOCK_FACTURA: FacturaDIAN = {
  cufe: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6abcd1234",
  numero: "990042351",
  prefijo: "SETT",
  fecha: "2025-04-05",
  formaPago: "Crédito 30 días",
  proveedor: {
    nombre: "DISTRIBUIDORA EL GRAN PROVEEDOR S.A.S",
    nit: "900.123.456-7",
    direccion: "Cra 45 # 12-30, Bogotá D.C.",
    regimen: "Responsable de IVA",
  },
  items: [
    { codigo: "PRD-001", descripcion: "Papel bond carta x resma 500 hojas", cantidad: 20, valorUnitario: 12500, subtotal: 250000, ivaPorc: 19, iva: 47500, total: 297500 },
    { codigo: "PRD-002", descripcion: "Tóner HP LaserJet 85A compatible", cantidad: 5, valorUnitario: 85000, subtotal: 425000, ivaPorc: 19, iva: 80750, total: 505750 },
    { codigo: "PRD-003", descripcion: "Carpetas legajadoras oficio x 25 und", cantidad: 10, valorUnitario: 35000, subtotal: 350000, ivaPorc: 19, iva: 66500, total: 416500 },
    { codigo: "SRV-001", descripcion: "Servicio de mantenimiento impresora", cantidad: 1, valorUnitario: 180000, subtotal: 180000, ivaPorc: 19, iva: 34200, total: 214200 },
    { codigo: "PRD-004", descripcion: "Resaltadores surtidos x caja 12 und", cantidad: 8, valorUnitario: 22000, subtotal: 176000, ivaPorc: 0, iva: 0, total: 176000 },
  ],
  subtotal: 1381000,
  iva: 228950,
  retencionFuente: 48335,      // 3.5% sobre subtotal gravado (1381000)
  retencionFuentePorc: 3.5,
  retencionIVA: 34342,          // 15% sobre IVA
  retencionIVAPorc: 15,
  retencionICA: 13810,          // 1% sobre subtotal (actividad comercial Bogotá)
  retencionICAPorc: 10,         // 10 x mil
  total: 1609950,
  totalPagar: 1513463,          // total - reteFuente - reteIVA - reteICA
};

function generarCuentasResumido(factura: FacturaDIAN): CuentaAsignada[] {
  const cuentas: CuentaAsignada[] = [];
  let id = 1;

  // Débito: Compras / Gastos (subtotal productos)
  cuentas.push({
    id: String(id++),
    codigoCuenta: "620501",
    nombreCuenta: "Compras de mercancías",
    tipo: "debito",
    valor: factura.subtotal,
    concepto: `Compra según Fac. ${factura.prefijo}-${factura.numero}`,
  });

  // Débito: IVA descontable
  if (factura.iva > 0) {
    cuentas.push({
      id: String(id++),
      codigoCuenta: "240810",
      nombreCuenta: "IVA descontable en compras",
      tipo: "debito",
      valor: factura.iva,
      concepto: `IVA Fac. ${factura.prefijo}-${factura.numero}`,
    });
  }

  // Crédito: Retención en la fuente por pagar
  if (factura.retencionFuente > 0) {
    cuentas.push({
      id: String(id++),
      codigoCuenta: "236540",
      nombreCuenta: `Retención en la fuente (${factura.retencionFuentePorc}%)`,
      tipo: "credito",
      valor: factura.retencionFuente,
      concepto: `ReteFte ${factura.retencionFuentePorc}% Fac. ${factura.prefijo}-${factura.numero}`,
    });
  }

  // Crédito: Retención de IVA por pagar
  if (factura.retencionIVA > 0) {
    cuentas.push({
      id: String(id++),
      codigoCuenta: "236701",
      nombreCuenta: `Retención de IVA (${factura.retencionIVAPorc}%)`,
      tipo: "credito",
      valor: factura.retencionIVA,
      concepto: `ReteIVA ${factura.retencionIVAPorc}% Fac. ${factura.prefijo}-${factura.numero}`,
    });
  }

  // Crédito: Retención de ICA por pagar
  if (factura.retencionICA > 0) {
    cuentas.push({
      id: String(id++),
      codigoCuenta: "236805",
      nombreCuenta: `Retención de ICA (${factura.retencionICAPorc}‰)`,
      tipo: "credito",
      valor: factura.retencionICA,
      concepto: `ReteICA ${factura.retencionICAPorc}‰ Fac. ${factura.prefijo}-${factura.numero}`,
    });
  }

  // Crédito: Cuenta por pagar al proveedor (neto a pagar)
  cuentas.push({
    id: String(id++),
    codigoCuenta: "220501",
    nombreCuenta: "Proveedores nacionales",
    tipo: "credito",
    valor: factura.totalPagar,
    concepto: `CxP ${factura.proveedor.nombre} Fac. ${factura.prefijo}-${factura.numero}`,
  });

  return cuentas;
}

export function ImportarComprasModal({ open, onOpenChange, onImportSuccess }: ImportarComprasModalProps) {
  const [paso, setPaso] = useState<Paso>("cufe");
  const [cufe, setCufe] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<"detallado" | "resumido">("resumido");
  const [loading, setLoading] = useState(false);
  const [factura, setFactura] = useState<FacturaDIAN | null>(null);
  const [cuentas, setCuentas] = useState<CuentaAsignada[]>([]);

  const [nuevaCuenta, setNuevaCuenta] = useState({
    codigoCuenta: "",
    nombreCuenta: "",
    tipo: "debito" as "debito" | "credito",
    valor: "",
    concepto: "",
  });

  const { toast } = useToast();

  const fmt = (val: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

  const handleConsultarCUFE = async () => {
    if (!cufe.trim()) {
      toast({ title: "Error", description: "Ingrese el CUFE del documento", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const response = await api.consultarCUFE(cufe.trim(), tipoDocumento);
      if (response.success && response.data) {
        setFactura(response.data);
        setPaso("resultado");
        toast({ title: "Documento encontrado", description: `Factura ${response.data.numero} de ${response.data.proveedor.nombre}` });
      } else {
        // Usar mock como fallback para demostración
        setFactura(MOCK_FACTURA);
        setPaso("resultado");
        toast({ title: "Modo demo", description: "Se cargó una factura de ejemplo para demostración" });
      }
    } catch {
      // Fallback al mock
      setFactura(MOCK_FACTURA);
      setPaso("resultado");
      toast({ title: "Modo demo", description: "Se cargó una factura de ejemplo para demostración" });
    } finally {
      setLoading(false);
    }
  };

  const handleContinuarACuentas = () => {
    if (!factura) return;
    if (tipoDocumento === "resumido") {
      setCuentas(generarCuentasResumido(factura));
    }
    setPaso("cuentas");
  };

  const handleAgregarCuenta = () => {
    if (!nuevaCuenta.codigoCuenta || !nuevaCuenta.nombreCuenta || !nuevaCuenta.valor) {
      toast({ title: "Error", description: "Complete todos los campos de la cuenta", variant: "destructive" });
      return;
    }
    const valor = Number(nuevaCuenta.valor);
    if (isNaN(valor) || valor <= 0) {
      toast({ title: "Error", description: "El valor debe ser mayor a 0", variant: "destructive" });
      return;
    }
    setCuentas(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        codigoCuenta: nuevaCuenta.codigoCuenta,
        nombreCuenta: nuevaCuenta.nombreCuenta,
        tipo: nuevaCuenta.tipo,
        valor,
        concepto: nuevaCuenta.concepto || nuevaCuenta.nombreCuenta,
      },
    ]);
    setNuevaCuenta({ codigoCuenta: "", nombreCuenta: "", tipo: "debito", valor: "", concepto: "" });
  };

  const eliminarCuenta = (id: string) => setCuentas(prev => prev.filter(c => c.id !== id));

  const totalDebitos = cuentas.filter(c => c.tipo === "debito").reduce((s, c) => s + c.valor, 0);
  const totalCreditos = cuentas.filter(c => c.tipo === "credito").reduce((s, c) => s + c.valor, 0);
  const estaBalanceado = totalDebitos === totalCreditos && totalDebitos > 0;

  const handleImportar = () => {
    if (!estaBalanceado) {
      toast({ title: "Error", description: "Los débitos y créditos deben estar balanceados", variant: "destructive" });
      return;
    }
    if (factura) {
      onImportSuccess?.(factura, cuentas);
      toast({ title: "Importado", description: "El documento fue importado a contabilidad exitosamente" });
      handleReset();
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setPaso("cufe");
    setCufe("");
    setTipoDocumento("resumido");
    setFactura(null);
    setCuentas([]);
    setNuevaCuenta({ codigoCuenta: "", nombreCuenta: "", tipo: "debito", valor: "", concepto: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); onOpenChange(v); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Importar Compras Electrónicas
          </DialogTitle>
          <DialogDescription>
            Consulte un documento electrónico de la DIAN mediante su CUFE y genere el asiento contable
          </DialogDescription>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-4">
          {(["cufe", "resultado", "cuentas"] as Paso[]).map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <Badge variant={paso === p ? "default" : "outline"} className="text-xs">
                {i + 1}. {p === "cufe" ? "CUFE" : p === "resultado" ? "Factura" : "Contabilización"}
              </Badge>
              {i < 2 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>

        {/* Step 1: CUFE */}
        {paso === "cufe" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cufe">CUFE del documento electrónico</Label>
              <Input
                id="cufe"
                placeholder="Ingrese el CUFE de la factura electrónica..."
                value={cufe}
                onChange={(e) => setCufe(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                El CUFE (Código Único de Factura Electrónica) es un identificador único asignado por la DIAN
              </p>
            </div>

            <div className="space-y-3">
              <Label>Tipo de contabilización</Label>
              <RadioGroup value={tipoDocumento} onValueChange={(v) => setTipoDocumento(v as "detallado" | "resumido")}>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <RadioGroupItem value="resumido" id="resumido" className="mt-1" />
                  <div>
                    <Label htmlFor="resumido" className="font-medium cursor-pointer">Resumido</Label>
                    <p className="text-xs text-muted-foreground">Genera líneas por: productos, IVA, retenciones (fuente, IVA, ICA) y cuenta por pagar al proveedor</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <RadioGroupItem value="detallado" id="detallado" className="mt-1" />
                  <div>
                    <Label htmlFor="detallado" className="font-medium cursor-pointer">Detallado</Label>
                    <p className="text-xs text-muted-foreground">Incluye cada ítem como línea independiente en el documento contable</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleConsultarCUFE} disabled={loading || !cufe.trim()} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Consultar CUFE
            </Button>
          </div>
        )}

        {/* Step 2: Invoice result with products and taxes */}
        {paso === "resultado" && factura && (
          <div className="space-y-4">
            {/* Provider info */}
            <Card>
              <CardContent className="pt-4 space-y-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div><span className="text-muted-foreground">Número:</span> <span className="font-medium">{factura.prefijo}-{factura.numero}</span></div>
                  <div><span className="text-muted-foreground">Fecha:</span> <span className="font-medium">{factura.fecha}</span></div>
                  <div><span className="text-muted-foreground">Proveedor:</span> <span className="font-medium">{factura.proveedor.nombre}</span></div>
                  <div><span className="text-muted-foreground">NIT:</span> <span className="font-medium">{factura.proveedor.nit}</span></div>
                  <div><span className="text-muted-foreground">Dirección:</span> <span className="font-medium">{factura.proveedor.direccion}</span></div>
                  <div><span className="text-muted-foreground">Régimen:</span> <span className="font-medium">{factura.proveedor.regimen}</span></div>
                  <div><span className="text-muted-foreground">Forma de pago:</span> <span className="font-medium">{factura.formaPago}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Products table */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Productos / Servicios</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right w-16">Cant.</TableHead>
                    <TableHead className="text-right">Vr. Unitario</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right w-16">IVA %</TableHead>
                    <TableHead className="text-right">IVA $</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factura.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                      <TableCell className="text-sm">{item.descripcion}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right">{fmt(item.valorUnitario)}</TableCell>
                      <TableCell className="text-right">{fmt(item.subtotal)}</TableCell>
                      <TableCell className="text-right">{item.ivaPorc}%</TableCell>
                      <TableCell className="text-right">{fmt(item.iva)}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">Totales:</TableCell>
                    <TableCell className="text-right font-bold">{fmt(factura.subtotal)}</TableCell>
                    <TableCell />
                    <TableCell className="text-right font-bold">{fmt(factura.iva)}</TableCell>
                    <TableCell className="text-right font-bold">{fmt(factura.subtotal + factura.iva)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            {/* Tax and retention summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-muted-foreground text-xs">Subtotal</p>
                  <p className="font-bold text-sm">{fmt(factura.subtotal)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-muted-foreground text-xs">IVA (19%)</p>
                  <p className="font-bold text-sm">{fmt(factura.iva)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-muted-foreground text-xs">Total Bruto</p>
                  <p className="font-bold text-sm">{fmt(factura.total)}</p>
                </CardContent>
              </Card>
              <Card className="border-primary/30">
                <CardContent className="p-3 text-center">
                  <p className="text-muted-foreground text-xs">Total a Pagar</p>
                  <p className="font-bold text-sm text-primary">{fmt(factura.totalPagar)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Retentions detail */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-2">Retenciones aplicadas</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">ReteFuente ({factura.retencionFuentePorc}%)</span>
                    <span className="font-medium text-destructive">-{fmt(factura.retencionFuente)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">ReteIVA ({factura.retencionIVAPorc}%)</span>
                    <span className="font-medium text-destructive">-{fmt(factura.retencionIVA)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">ReteICA ({factura.retencionICAPorc}‰)</span>
                    <span className="font-medium text-destructive">-{fmt(factura.retencionICA)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setPaso("cufe"); setCuentas([]); }}>Atrás</Button>
              <Button onClick={handleContinuarACuentas} className="flex-1">Continuar a contabilización</Button>
            </div>
          </div>
        )}

        {/* Step 3: Accounting entries */}
        {paso === "cuentas" && factura && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>Factura: <strong>{factura.prefijo}-{factura.numero}</strong></span>
                  <span>Proveedor: <strong>{factura.proveedor.nombre}</strong></span>
                  <span>Total: <strong className="text-primary">{fmt(factura.total)}</strong></span>
                  <Badge variant="outline">{tipoDocumento === "resumido" ? "Resumido" : "Detallado"}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Add account form */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
              <div>
                <Label className="text-xs">Código cuenta</Label>
                <Input placeholder="5135" value={nuevaCuenta.codigoCuenta} onChange={(e) => setNuevaCuenta(p => ({ ...p, codigoCuenta: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">Nombre cuenta</Label>
                <Input placeholder="Servicios" value={nuevaCuenta.nombreCuenta} onChange={(e) => setNuevaCuenta(p => ({ ...p, nombreCuenta: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">Tipo</Label>
                <Select value={nuevaCuenta.tipo} onValueChange={(v) => setNuevaCuenta(p => ({ ...p, tipo: v as "debito" | "credito" }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debito">Débito</SelectItem>
                    <SelectItem value="credito">Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Valor</Label>
                <Input type="number" placeholder="0" value={nuevaCuenta.valor} onChange={(e) => setNuevaCuenta(p => ({ ...p, valor: e.target.value }))} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">Concepto</Label>
                <Input placeholder="Concepto" value={nuevaCuenta.concepto} onChange={(e) => setNuevaCuenta(p => ({ ...p, concepto: e.target.value }))} className="text-sm" />
              </div>
              <Button size="sm" onClick={handleAgregarCuenta}>
                <Plus className="h-4 w-4 mr-1" /> Agregar
              </Button>
            </div>

            {/* Accounts table */}
            {cuentas.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                    <TableHead className="text-center w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuentas.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.codigoCuenta}</TableCell>
                      <TableCell className="text-sm">{c.nombreCuenta}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.concepto}</TableCell>
                      <TableCell className="text-right font-medium">{c.tipo === "debito" ? fmt(c.valor) : ""}</TableCell>
                      <TableCell className="text-right font-medium">{c.tipo === "credito" ? fmt(c.valor) : ""}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => eliminarCuenta(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Totales:</TableCell>
                    <TableCell className="text-right font-bold">{fmt(totalDebitos)}</TableCell>
                    <TableCell className="text-right font-bold">{fmt(totalCreditos)}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            )}

            {!estaBalanceado && cuentas.length > 0 && (
              <p className="text-sm text-destructive">⚠ Los débitos y créditos no están balanceados. Diferencia: {fmt(Math.abs(totalDebitos - totalCreditos))}</p>
            )}
            {estaBalanceado && (
              <p className="text-sm text-green-600">✓ El documento está balanceado</p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPaso("resultado")}>Atrás</Button>
              <Button onClick={handleImportar} disabled={!estaBalanceado} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Importar a Contabilidad
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
