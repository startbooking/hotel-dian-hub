import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Printer, FileDown, Search, Info } from "lucide-react";
import { toast } from "sonner";

interface LineaResultado {
  concepto: string;
  valorActual: number;
  valorAnterior: number;
  nivel: number;
  esBold?: boolean;
  norma?: string;
}

const lineas: LineaResultado[] = [
  { concepto: "INGRESOS DE ACTIVIDADES ORDINARIAS", valorActual: 120000000, valorAnterior: 110000000, nivel: 0, esBold: true, norma: "NIIF 15" },
  { concepto: "Ingresos por servicios de hospedaje", valorActual: 75000000, valorAnterior: 68000000, nivel: 1 },
  { concepto: "Ingresos por alimentos y bebidas", valorActual: 30000000, valorAnterior: 28000000, nivel: 1 },
  { concepto: "Otros ingresos ordinarios", valorActual: 15000000, valorAnterior: 14000000, nivel: 1 },
  { concepto: "COSTO DE VENTAS", valorActual: -45000000, valorAnterior: -42000000, nivel: 0, esBold: true },
  { concepto: "Costo de servicios prestados", valorActual: -38000000, valorAnterior: -35000000, nivel: 1 },
  { concepto: "Otros costos", valorActual: -7000000, valorAnterior: -7000000, nivel: 1 },
  { concepto: "GANANCIA BRUTA", valorActual: 75000000, valorAnterior: 68000000, nivel: 0, esBold: true },
  { concepto: "Gastos de distribución", valorActual: -10000000, valorAnterior: -9000000, nivel: 1 },
  { concepto: "Gastos de administración", valorActual: -8000000, valorAnterior: -7500000, nivel: 1 },
  { concepto: "Gastos de personal", valorActual: -18000000, valorAnterior: -16000000, nivel: 1, norma: "NIC 19" },
  { concepto: "Depreciación y amortización PP&E", valorActual: -8000000, valorAnterior: -7000000, nivel: 1, norma: "NIC 16/38" },
  { concepto: "Depreciación activos por derecho de uso", valorActual: -3000000, valorAnterior: -2500000, nivel: 1, norma: "NIIF 16" },
  { concepto: "Pérdida por deterioro de valor", valorActual: 0, valorAnterior: -500000, nivel: 1, norma: "NIC 36" },
  { concepto: "Otros gastos operativos", valorActual: -2000000, valorAnterior: -1800000, nivel: 1 },
  { concepto: "GANANCIA (PÉRDIDA) OPERACIONAL", valorActual: 26000000, valorAnterior: 23700000, nivel: 0, esBold: true },
  { concepto: "Ingresos financieros", valorActual: 2000000, valorAnterior: 1800000, nivel: 1, norma: "NIIF 9" },
  { concepto: "Costos financieros", valorActual: -4000000, valorAnterior: -3500000, nivel: 1, norma: "NIIF 9" },
  { concepto: "Intereses por arrendamientos", valorActual: -1000000, valorAnterior: -800000, nivel: 1, norma: "NIIF 16" },
  { concepto: "Diferencia en cambio neta", valorActual: 500000, valorAnterior: -200000, nivel: 1, norma: "NIC 21" },
  { concepto: "GANANCIA ANTES DE IMPUESTOS", valorActual: 23500000, valorAnterior: 21000000, nivel: 0, esBold: true },
  { concepto: "Gasto por impuesto a las ganancias corriente", valorActual: -8225000, valorAnterior: -7350000, nivel: 1, norma: "NIC 12" },
  { concepto: "Impuesto diferido", valorActual: 1500000, valorAnterior: 1200000, nivel: 1, norma: "NIC 12" },
  { concepto: "GANANCIA NETA DEL PERÍODO", valorActual: 16775000, valorAnterior: 14850000, nivel: 0, esBold: true },
  { concepto: "", valorActual: 0, valorAnterior: 0, nivel: 0 },
  { concepto: "OTRO RESULTADO INTEGRAL (ORI)", valorActual: 0, valorAnterior: 0, nivel: 0, esBold: true, norma: "NIC 1" },
  { concepto: "Partidas que no se reclasificarán:", valorActual: 0, valorAnterior: 0, nivel: 1 },
  { concepto: "Superávit por revaluación de PP&E", valorActual: 3000000, valorAnterior: 0, nivel: 2, norma: "NIC 16" },
  { concepto: "Remediciones planes de beneficios definidos", valorActual: -500000, valorAnterior: 0, nivel: 2, norma: "NIC 19" },
  { concepto: "Partidas que podrían reclasificarse:", valorActual: 0, valorAnterior: 0, nivel: 1 },
  { concepto: "Diferencias de cambio en conversión", valorActual: 0, valorAnterior: 0, nivel: 2, norma: "NIC 21" },
  { concepto: "TOTAL OTRO RESULTADO INTEGRAL", valorActual: 2500000, valorAnterior: 0, nivel: 0, esBold: true },
  { concepto: "RESULTADO INTEGRAL TOTAL DEL PERÍODO", valorActual: 19275000, valorAnterior: 14850000, nivel: 0, esBold: true },
];

export default function EstadoResultadoIntegral() {
  const [anio, setAnio] = useState("2024");
  const [mes, setMes] = useState("12");
  const [generado, setGenerado] = useState(false);

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Estado de Resultado Integral generado (NIIF - NIC 1)");
  };

  const formatValor = (valor: number) => {
    if (valor === 0) return "-";
    const abs = Math.abs(valor);
    return `${valor < 0 ? "(" : ""}$${abs.toLocaleString("es-CO")}${valor < 0 ? ")" : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estado de Resultado Integral</h1>
          <p className="text-muted-foreground">NIC 1 — Ganancia o Pérdida y Otro Resultado Integral</p>
        </div>
        <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">NIIF / IFRS</Badge>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Presenta la ganancia o pérdida del período y el otro resultado integral (ORI) con clasificación por naturaleza, según NIC 1 y NIIF 15.
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle>Período</CardTitle></CardHeader>
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
              <label className="text-sm text-muted-foreground">Hasta mes</label>
              <Select value={mes} onValueChange={setMes}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Estado de Resultado Integral — {anio}</CardTitle>
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
                  <span className="w-20 text-right">Norma</span>
                </div>
              </div>
              {lineas.map((l, i) => (
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
                      <span className={`font-mono w-32 text-right text-muted-foreground`}>
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
