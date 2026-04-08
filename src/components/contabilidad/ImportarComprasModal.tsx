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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Trash2, Plus, Download, FileText } from "lucide-react";
import { api } from "@/services/api";

interface FacturaDIAN {
  cufe: string;
  numero: string;
  prefijo: string;
  fecha: string;
  proveedor: {
    nombre: string;
    nit: string;
    direccion: string;
  };
  items: {
    codigo: string;
    descripcion: string;
    cantidad: number;
    valorUnitario: number;
    iva: number;
    total: number;
  }[];
  subtotal: number;
  iva: number;
  retencionFuente: number;
  retencionIVA: number;
  retencionICA: number;
  total: number;
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

export function ImportarComprasModal({ open, onOpenChange, onImportSuccess }: ImportarComprasModalProps) {
  const [paso, setPaso] = useState<Paso>("cufe");
  const [cufe, setCufe] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<"detallado" | "resumido">("detallado");
  const [loading, setLoading] = useState(false);
  const [factura, setFactura] = useState<FacturaDIAN | null>(null);
  const [cuentas, setCuentas] = useState<CuentaAsignada[]>([]);

  // New account form
  const [nuevaCuenta, setNuevaCuenta] = useState({
    codigoCuenta: "",
    nombreCuenta: "",
    tipo: "debito" as "debito" | "credito",
    valor: "",
    concepto: "",
  });

  const { toast } = useToast();

  const formatCurrency = (val: number) =>
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
        toast({ title: "No encontrado", description: response.error || "No se encontró el documento con el CUFE proporcionado", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Error al consultar el CUFE en la DIAN", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
    setTipoDocumento("detallado");
    setFactura(null);
    setCuentas([]);
    setNuevaCuenta({ codigoCuenta: "", nombreCuenta: "", tipo: "debito", valor: "", concepto: "" });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleReset(); onOpenChange(v); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Importar Compras Electrónicas
          </DialogTitle>
          <DialogDescription>
            Consulte un documento electrónico de la DIAN mediante su CUFE y asigne las cuentas contables
          </DialogDescription>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-4">
          {(["cufe", "resultado", "cuentas"] as Paso[]).map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <Badge variant={paso === p ? "default" : "outline"} className="text-xs">
                {i + 1}. {p === "cufe" ? "CUFE" : p === "resultado" ? "Resultado" : "Cuentas"}
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
              <Label>Tipo de documento a generar</Label>
              <RadioGroup value={tipoDocumento} onValueChange={(v) => setTipoDocumento(v as "detallado" | "resumido")}>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <RadioGroupItem value="detallado" id="detallado" className="mt-1" />
                  <div>
                    <Label htmlFor="detallado" className="font-medium cursor-pointer">Detallado</Label>
                    <p className="text-xs text-muted-foreground">Incluye cada ítem de la factura como línea independiente en el documento contable</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <RadioGroupItem value="resumido" id="resumido" className="mt-1" />
                  <div>
                    <Label htmlFor="resumido" className="font-medium cursor-pointer">Resumido</Label>
                    <p className="text-xs text-muted-foreground">Agrupa todos los ítems en una sola línea con el total de la factura</p>
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

        {/* Step 2: Result */}
        {paso === "resultado" && factura && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Número:</span>
                    <span className="ml-2 font-medium">{factura.prefijo}-{factura.numero}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="ml-2 font-medium">{factura.fecha}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Proveedor:</span>
                    <span className="ml-2 font-medium">{factura.proveedor.nombre} - NIT: {factura.proveedor.nit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {tipoDocumento === "detallado" && factura.items.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">Vr. Unit.</TableHead>
                    <TableHead className="text-right">IVA</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factura.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{item.codigo}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.iva)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <Card><CardContent className="p-3 text-center"><p className="text-muted-foreground text-xs">Subtotal</p><p className="font-bold">{formatCurrency(factura.subtotal)}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-muted-foreground text-xs">IVA</p><p className="font-bold">{formatCurrency(factura.iva)}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-muted-foreground text-xs">Rete Fuente</p><p className="font-bold">{formatCurrency(factura.retencionFuente)}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-muted-foreground text-xs">Rete IVA</p><p className="font-bold">{formatCurrency(factura.retencionIVA)}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-muted-foreground text-xs">Total</p><p className="font-bold text-primary">{formatCurrency(factura.total)}</p></CardContent></Card>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPaso("cufe")}>Atrás</Button>
              <Button onClick={() => setPaso("cuentas")} className="flex-1">Continuar a asignar cuentas</Button>
            </div>
          </div>
        )}

        {/* Step 3: Accounting entries */}
        {paso === "cuentas" && factura && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-1">Factura: <span className="font-medium text-foreground">{factura.prefijo}-{factura.numero}</span> | Proveedor: <span className="font-medium text-foreground">{factura.proveedor.nombre}</span> | Total: <span className="font-bold text-primary">{formatCurrency(factura.total)}</span></p>
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
                      <TableCell className="text-right font-medium">{c.tipo === "debito" ? formatCurrency(c.valor) : ""}</TableCell>
                      <TableCell className="text-right font-medium">{c.tipo === "credito" ? formatCurrency(c.valor) : ""}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => eliminarCuenta(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={3} className="text-right">Totales:</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalDebitos)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalCreditos)}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            )}

            {!estaBalanceado && cuentas.length > 0 && (
              <p className="text-sm text-destructive">⚠ Los débitos y créditos no están balanceados. Diferencia: {formatCurrency(Math.abs(totalDebitos - totalCreditos))}</p>
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
