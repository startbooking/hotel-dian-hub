import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, Printer, FileDown, Search, Info } from "lucide-react";
import { toast } from "sonner";

interface LineaFlujo {
  concepto: string;
  valorActual: number;
  valorAnterior: number;
  nivel: number;
  esBold?: boolean;
  norma?: string;
}

const metodoIndirecto: LineaFlujo[] = [
  { concepto: "FLUJOS DE EFECTIVO POR ACTIVIDADES DE OPERACIÓN", valorActual: 0, valorAnterior: 0, nivel: 0, esBold: true, norma: "NIC 7.18(b)" },
  { concepto: "Ganancia del período", valorActual: 16775000, valorAnterior: 14850000, nivel: 1 },
  { concepto: "Ajustes para conciliar con efectivo generado:", valorActual: 0, valorAnterior: 0, nivel: 1, esBold: true },
  { concepto: "Depreciación PP&E", valorActual: 8000000, valorAnterior: 7000000, nivel: 2, norma: "NIC 16" },
  { concepto: "Depreciación activos por derecho de uso", valorActual: 3000000, valorAnterior: 2500000, nivel: 2, norma: "NIIF 16" },
  { concepto: "Amortización de intangibles", valorActual: 1000000, valorAnterior: 900000, nivel: 2, norma: "NIC 38" },
  { concepto: "Pérdida por deterioro de valor", valorActual: 0, valorAnterior: 500000, nivel: 2, norma: "NIC 36" },
  { concepto: "Gasto por impuesto diferido", valorActual: -1500000, valorAnterior: -1200000, nivel: 2, norma: "NIC 12" },
  { concepto: "Costos financieros reconocidos en resultados", valorActual: 5000000, valorAnterior: 4300000, nivel: 2 },
  { concepto: "Cambios en el capital de trabajo:", valorActual: 0, valorAnterior: 0, nivel: 1, esBold: true },
  { concepto: "(Aumento) disminución en deudores comerciales", valorActual: -5000000, valorAnterior: -3000000, nivel: 2 },
  { concepto: "(Aumento) disminución en inventarios", valorActual: -2000000, valorAnterior: -1000000, nivel: 2 },
  { concepto: "Aumento (disminución) en acreedores comerciales", valorActual: 3000000, valorAnterior: 2000000, nivel: 2 },
  { concepto: "Aumento (disminución) en beneficios a empleados", valorActual: 2000000, valorAnterior: 1500000, nivel: 2, norma: "NIC 19" },
  { concepto: "Impuesto a las ganancias pagado", valorActual: -8225000, valorAnterior: -7350000, nivel: 1, norma: "NIC 7.35" },
  { concepto: "Efectivo neto generado por actividades de operación", valorActual: 22050000, valorAnterior: 21000000, nivel: 0, esBold: true },
  { concepto: "FLUJOS DE EFECTIVO POR ACTIVIDADES DE INVERSIÓN", valorActual: 0, valorAnterior: 0, nivel: 0, esBold: true, norma: "NIC 7.21" },
  { concepto: "Adquisición de propiedades, planta y equipo", valorActual: -15000000, valorAnterior: -12000000, nivel: 1, norma: "NIC 16" },
  { concepto: "Producto de la venta de PP&E", valorActual: 2000000, valorAnterior: 1000000, nivel: 1 },
  { concepto: "Adquisición de intangibles", valorActual: -2000000, valorAnterior: -1500000, nivel: 1, norma: "NIC 38" },
  { concepto: "Efectivo neto usado en actividades de inversión", valorActual: -15000000, valorAnterior: -12500000, nivel: 0, esBold: true },
  { concepto: "FLUJOS DE EFECTIVO POR ACTIVIDADES DE FINANCIACIÓN", valorActual: 0, valorAnterior: 0, nivel: 0, esBold: true, norma: "NIC 7.27" },
  { concepto: "Pago de obligaciones financieras - principal", valorActual: -3000000, valorAnterior: -5000000, nivel: 1 },
  { concepto: "Intereses pagados", valorActual: -4000000, valorAnterior: -3500000, nivel: 1, norma: "NIC 7.31" },
  { concepto: "Pago de pasivos por arrendamientos - principal", valorActual: -3000000, valorAnterior: -2500000, nivel: 1, norma: "NIIF 16" },
  { concepto: "Intereses pagados arrendamientos", valorActual: -1000000, valorAnterior: -800000, nivel: 1, norma: "NIIF 16" },
  { concepto: "Dividendos pagados", valorActual: -5000000, valorAnterior: -4000000, nivel: 1, norma: "NIC 7.34" },
  { concepto: "Efectivo neto usado en actividades de financiación", valorActual: -16000000, valorAnterior: -15800000, nivel: 0, esBold: true },
  { concepto: "", valorActual: 0, valorAnterior: 0, nivel: 0 },
  { concepto: "AUMENTO (DISMINUCIÓN) NETO EN EFECTIVO", valorActual: -8950000, valorAnterior: -7300000, nivel: 0, esBold: true },
  { concepto: "Efectivo y equivalentes al inicio del período", valorActual: 53950000, valorAnterior: 45575000, nivel: 1 },
  { concepto: "EFECTIVO Y EQUIVALENTES AL FINAL DEL PERÍODO", valorActual: 45000000, valorAnterior: 38275000, nivel: 0, esBold: true, norma: "NIC 7.45" },
];

export default function EstadoFlujosEfectivoNIIF() {
  const [anio, setAnio] = useState("2024");
  const [generado, setGenerado] = useState(false);
  const [metodo, setMetodo] = useState<"indirecto" | "directo">("indirecto");

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Estado de Flujos de Efectivo generado (NIC 7)");
  };

  const formatValor = (valor: number) => {
    if (valor === 0) return "-";
    const abs = Math.abs(valor);
    return `${valor < 0 ? "(" : ""}$${abs.toLocaleString("es-CO")}${valor < 0 ? ")" : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowDownUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estado de Flujos de Efectivo</h1>
          <p className="text-muted-foreground">NIC 7 — Estado de Flujos de Efectivo</p>
        </div>
        <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">NIIF / IFRS</Badge>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Clasifica los flujos en operación, inversión y financiación. Incluye separación de intereses y pagos de arrendamientos (NIIF 16) según NIC 7.
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle>Parámetros</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Año</label>
              <Select value={anio} onValueChange={setAnio}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Método</label>
              <Tabs value={metodo} onValueChange={(v) => setMetodo(v as any)} className="w-56">
                <TabsList className="w-full">
                  <TabsTrigger value="indirecto" className="flex-1">Indirecto</TabsTrigger>
                  <TabsTrigger value="directo" className="flex-1">Directo</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Flujos de Efectivo (Método {metodo === "indirecto" ? "Indirecto" : "Directo"}) — {anio}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0.5">
              <div className="flex justify-between py-2 px-3 bg-primary/10 rounded font-semibold text-sm">
                <span>Concepto</span>
                <div className="flex gap-12">
                  <span className="w-32 text-right">{anio}</span>
                  <span className="w-32 text-right">{Number(anio) - 1}</span>
                  <span className="w-20 text-right">Ref.</span>
                </div>
              </div>
              {metodoIndirecto.map((l, i) => (
                <div
                  key={i}
                  className={`flex justify-between py-2 px-3 rounded text-sm ${l.esBold ? "bg-muted font-bold" : "hover:bg-muted/30"} ${l.concepto === "" ? "h-4" : ""}`}
                  style={{ paddingLeft: `${l.nivel * 24 + 12}px` }}
                >
                  <span className="text-foreground flex-1">{l.concepto}</span>
                  {l.concepto && (
                    <div className="flex gap-12 items-center">
                      <span className={`font-mono w-32 text-right ${l.valorActual < 0 ? "text-destructive" : "text-foreground"}`}>
                        {formatValor(l.valorActual)}
                      </span>
                      <span className="font-mono w-32 text-right text-muted-foreground">
                        {formatValor(l.valorAnterior)}
                      </span>
                      <span className="w-20 text-right">
                        {l.norma && <Badge variant="outline" className="text-[10px] px-1">{l.norma}</Badge>}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
