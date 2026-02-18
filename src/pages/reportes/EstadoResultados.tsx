import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface LineaEstado {
  concepto: string;
  valor: number;
  nivel: number;
  esBold?: boolean;
}

export default function EstadoResultados() {
  const [anio, setAnio] = useState("2024");
  const [mes, setMes] = useState("12");
  const [generado, setGenerado] = useState(false);

  const lineas: LineaEstado[] = [
    { concepto: "INGRESOS OPERACIONALES", valor: 120000000, nivel: 0, esBold: true },
    { concepto: "Ingresos por alojamiento", valor: 75000000, nivel: 1 },
    { concepto: "Ingresos por restaurante", valor: 30000000, nivel: 1 },
    { concepto: "Otros ingresos operacionales", valor: 15000000, nivel: 1 },
    { concepto: "COSTOS DE VENTAS", valor: -45000000, nivel: 0, esBold: true },
    { concepto: "Costos de alojamiento", valor: -20000000, nivel: 1 },
    { concepto: "Costos de restaurante", valor: -18000000, nivel: 1 },
    { concepto: "Otros costos", valor: -7000000, nivel: 1 },
    { concepto: "UTILIDAD BRUTA", valor: 75000000, nivel: 0, esBold: true },
    { concepto: "GASTOS OPERACIONALES", valor: -35000000, nivel: 0, esBold: true },
    { concepto: "Gastos de administración", valor: -20000000, nivel: 1 },
    { concepto: "Gastos de ventas", valor: -15000000, nivel: 1 },
    { concepto: "UTILIDAD OPERACIONAL", valor: 40000000, nivel: 0, esBold: true },
    { concepto: "Ingresos no operacionales", valor: 5000000, nivel: 1 },
    { concepto: "Gastos no operacionales", valor: -3000000, nivel: 1 },
    { concepto: "UTILIDAD ANTES DE IMPUESTOS", valor: 42000000, nivel: 0, esBold: true },
    { concepto: "Provisión impuesto de renta", valor: -14700000, nivel: 1 },
    { concepto: "UTILIDAD NETA", valor: 27300000, nivel: 0, esBold: true },
  ];

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Estado de resultados generado");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estado de Resultados</h1>
          <p className="text-muted-foreground">Pérdidas y Ganancias del período</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Período</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Estado de Resultados - {anio}</CardTitle>
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
                  <span className={`font-mono ${l.valor < 0 ? "text-destructive" : "text-foreground"}`}>
                    ${Math.abs(l.valor).toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
