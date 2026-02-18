import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface LineaBalance {
  concepto: string;
  valor: number;
  nivel: number;
  esBold?: boolean;
}

export default function BalanceGeneral() {
  const [anio, setAnio] = useState("2024");
  const [generado, setGenerado] = useState(false);

  const activos: LineaBalance[] = [
    { concepto: "ACTIVOS", valor: 350000000, nivel: 0, esBold: true },
    { concepto: "ACTIVO CORRIENTE", valor: 150000000, nivel: 0, esBold: true },
    { concepto: "Efectivo y equivalentes", valor: 45000000, nivel: 1 },
    { concepto: "Cuentas por cobrar", valor: 65000000, nivel: 1 },
    { concepto: "Inventarios", valor: 25000000, nivel: 1 },
    { concepto: "Otros activos corrientes", valor: 15000000, nivel: 1 },
    { concepto: "ACTIVO NO CORRIENTE", valor: 200000000, nivel: 0, esBold: true },
    { concepto: "Propiedad, planta y equipo", valor: 180000000, nivel: 1 },
    { concepto: "Intangibles", valor: 12000000, nivel: 1 },
    { concepto: "Otros activos no corrientes", valor: 8000000, nivel: 1 },
  ];

  const pasivosPatrimonio: LineaBalance[] = [
    { concepto: "PASIVOS", valor: 120000000, nivel: 0, esBold: true },
    { concepto: "PASIVO CORRIENTE", valor: 55000000, nivel: 0, esBold: true },
    { concepto: "Cuentas por pagar", valor: 30000000, nivel: 1 },
    { concepto: "Obligaciones laborales", valor: 15000000, nivel: 1 },
    { concepto: "Impuestos por pagar", valor: 10000000, nivel: 1 },
    { concepto: "PASIVO NO CORRIENTE", valor: 65000000, nivel: 0, esBold: true },
    { concepto: "Obligaciones financieras LP", valor: 65000000, nivel: 1 },
    { concepto: "PATRIMONIO", valor: 230000000, nivel: 0, esBold: true },
    { concepto: "Capital social", valor: 100000000, nivel: 1 },
    { concepto: "Reservas", valor: 50000000, nivel: 1 },
    { concepto: "Resultados del ejercicio", valor: 27300000, nivel: 1 },
    { concepto: "Resultados acumulados", valor: 52700000, nivel: 1 },
    { concepto: "TOTAL PASIVO + PATRIMONIO", valor: 350000000, nivel: 0, esBold: true },
  ];

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Balance general generado");
  };

  const renderLineas = (lineas: LineaBalance[]) => (
    <div className="space-y-1">
      {lineas.map((l, i) => (
        <div key={i} className={`flex justify-between py-2 px-3 rounded ${l.esBold ? "bg-muted font-bold" : ""}`} style={{ paddingLeft: `${l.nivel * 24 + 12}px` }}>
          <span className="text-foreground">{l.concepto}</span>
          <span className="font-mono text-foreground">${l.valor.toLocaleString("es-CO")}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Balance General</h1>
          <p className="text-muted-foreground">Situación financiera a una fecha determinada</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Período</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activos</CardTitle>
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
              </div>
            </CardHeader>
            <CardContent>{renderLineas(activos)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pasivos y Patrimonio</CardTitle>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </CardHeader>
            <CardContent>{renderLineas(pasivosPatrimonio)}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
