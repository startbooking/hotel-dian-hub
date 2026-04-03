import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface LineaFlujo {
  concepto: string;
  valor: number;
  nivel: number;
  esBold?: boolean;
}

const lineasLocal: LineaFlujo[] = [
  { concepto: "ACTIVIDADES DE OPERACIÓN", valor: 0, nivel: 0, esBold: true },
  { concepto: "Utilidad neta del período", valor: 27300000, nivel: 1 },
  { concepto: "Depreciaciones y amortizaciones", valor: 8000000, nivel: 1 },
  { concepto: "Cambios en cuentas por cobrar", valor: -5000000, nivel: 1 },
  { concepto: "Cambios en inventarios", valor: -2000000, nivel: 1 },
  { concepto: "Cambios en cuentas por pagar", valor: 3000000, nivel: 1 },
  { concepto: "Efectivo neto de operación", valor: 31300000, nivel: 0, esBold: true },
  { concepto: "ACTIVIDADES DE INVERSIÓN", valor: 0, nivel: 0, esBold: true },
  { concepto: "Adquisición de propiedad y equipo", valor: -15000000, nivel: 1 },
  { concepto: "Venta de activos", valor: 2000000, nivel: 1 },
  { concepto: "Efectivo neto de inversión", valor: -13000000, nivel: 0, esBold: true },
  { concepto: "ACTIVIDADES DE FINANCIACIÓN", valor: 0, nivel: 0, esBold: true },
  { concepto: "Pagos de obligaciones financieras", valor: -8000000, nivel: 1 },
  { concepto: "Dividendos pagados", valor: -5000000, nivel: 1 },
  { concepto: "Efectivo neto de financiación", valor: -13000000, nivel: 0, esBold: true },
  { concepto: "AUMENTO NETO EN EFECTIVO", valor: 5300000, nivel: 0, esBold: true },
  { concepto: "Efectivo al inicio del período", valor: 39700000, nivel: 1 },
  { concepto: "EFECTIVO AL FINAL DEL PERÍODO", valor: 45000000, nivel: 0, esBold: true },
];

const lineasNIIF: LineaFlujo[] = [
  { concepto: "FLUJOS DE EFECTIVO POR ACTIVIDADES DE OPERACIÓN (NIC 7)", valor: 0, nivel: 0, esBold: true },
  { concepto: "Ganancia del período", valor: 25225000, nivel: 1 },
  { concepto: "Ajustes por:", valor: 0, nivel: 1 },
  { concepto: "Depreciación PP&E (NIC 16)", valor: 8000000, nivel: 2 },
  { concepto: "Depreciación activos por derecho de uso (NIIF 16)", valor: 3000000, nivel: 2 },
  { concepto: "Amortización intangibles (NIC 38)", valor: 1000000, nivel: 2 },
  { concepto: "Gasto por impuesto diferido (NIC 12)", valor: -1500000, nivel: 2 },
  { concepto: "Costos financieros reconocidos en resultados", valor: 5000000, nivel: 2 },
  { concepto: "Cambios en capital de trabajo:", valor: 0, nivel: 1 },
  { concepto: "(Aumento) en deudores comerciales", valor: -5000000, nivel: 2 },
  { concepto: "(Aumento) en inventarios", valor: -2000000, nivel: 2 },
  { concepto: "Aumento en acreedores comerciales", valor: 3000000, nivel: 2 },
  { concepto: "Efectivo neto generado por actividades de operación", valor: 36725000, nivel: 0, esBold: true },
  { concepto: "FLUJOS DE EFECTIVO POR ACTIVIDADES DE INVERSIÓN", valor: 0, nivel: 0, esBold: true },
  { concepto: "Adquisición de PP&E (NIC 16)", valor: -15000000, nivel: 1 },
  { concepto: "Producto de venta de PP&E", valor: 2000000, nivel: 1 },
  { concepto: "Efectivo neto usado en actividades de inversión", valor: -13000000, nivel: 0, esBold: true },
  { concepto: "FLUJOS DE EFECTIVO POR ACTIVIDADES DE FINANCIACIÓN", valor: 0, nivel: 0, esBold: true },
  { concepto: "Pago de obligaciones financieras", valor: -8000000, nivel: 1 },
  { concepto: "Pago de pasivos por arrendamientos (NIIF 16)", valor: -4000000, nivel: 1 },
  { concepto: "Dividendos pagados", valor: -5000000, nivel: 1 },
  { concepto: "Efectivo neto usado en actividades de financiación", valor: -17000000, nivel: 0, esBold: true },
  { concepto: "AUMENTO (DISMINUCIÓN) NETO EN EFECTIVO", valor: 6725000, nivel: 0, esBold: true },
  { concepto: "Efectivo al inicio del período", valor: 38275000, nivel: 1 },
  { concepto: "EFECTIVO Y EQUIVALENTES AL FINAL DEL PERÍODO", valor: 45000000, nivel: 0, esBold: true },
];

export default function FlujosEfectivo() {
  const [anio, setAnio] = useState("2024");
  const [generado, setGenerado] = useState(false);
  const [norma, setNorma] = useState<"local" | "niif">("local");

  const lineas = norma === "niif" ? lineasNIIF : lineasLocal;

  const handleGenerar = () => {
    setGenerado(true);
    toast.success(`Flujo de efectivo generado (${norma === "niif" ? "NIIF" : "Local"})`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowDownUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flujos de Efectivo</h1>
          <p className="text-muted-foreground">Estado de flujos de efectivo del período</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Período y Normatividad</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Tabs value={norma} onValueChange={(v) => setNorma(v as "local" | "niif")} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="local" className="flex-1">Local</TabsTrigger>
                <TabsTrigger value="niif" className="flex-1">NIIF</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {norma === "niif" ? "Estado de Flujos de Efectivo (NIC 7)" : "Flujo de Efectivo"} - {anio}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {lineas.map((l, i) => (
                <div key={i} className={`flex justify-between py-2 px-3 rounded ${l.esBold ? "bg-muted font-bold" : ""}`} style={{ paddingLeft: `${l.nivel * 24 + 12}px` }}>
                  <span className="text-foreground">{l.concepto}</span>
                  {l.valor !== 0 && (
                    <span className={`font-mono ${l.valor < 0 ? "text-destructive" : "text-foreground"}`}>
                      ${Math.abs(l.valor).toLocaleString("es-CO")}
                    </span>
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
