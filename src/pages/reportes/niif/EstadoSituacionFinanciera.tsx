import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Scale, Printer, FileDown, Search, Info } from "lucide-react";
import { toast } from "sonner";

interface LineaEstado {
  concepto: string;
  valorActual: number;
  valorAnterior: number;
  nivel: number;
  esBold?: boolean;
  norma?: string;
}

const activos: LineaEstado[] = [
  { concepto: "ACTIVOS", valorActual: 362000000, valorAnterior: 340000000, nivel: 0, esBold: true },
  { concepto: "ACTIVOS CORRIENTES", valorActual: 148000000, valorAnterior: 135000000, nivel: 0, esBold: true },
  { concepto: "Efectivo y equivalentes de efectivo", valorActual: 45000000, valorAnterior: 38275000, nivel: 1, norma: "NIC 7" },
  { concepto: "Deudores comerciales y otras cuentas por cobrar", valorActual: 63000000, valorAnterior: 58000000, nivel: 1, norma: "NIIF 9 / NIIF 15" },
  { concepto: "Inventarios", valorActual: 24000000, valorAnterior: 22000000, nivel: 1, norma: "NIC 2" },
  { concepto: "Activos por impuestos corrientes", valorActual: 8000000, valorAnterior: 7000000, nivel: 1, norma: "NIC 12" },
  { concepto: "Otros activos financieros corrientes", valorActual: 8000000, valorAnterior: 9725000, nivel: 1, norma: "NIIF 9" },
  { concepto: "ACTIVOS NO CORRIENTES", valorActual: 214000000, valorAnterior: 205000000, nivel: 0, esBold: true },
  { concepto: "Propiedades, planta y equipo", valorActual: 175000000, valorAnterior: 170000000, nivel: 1, norma: "NIC 16" },
  { concepto: "Activos por derecho de uso", valorActual: 18000000, valorAnterior: 15000000, nivel: 1, norma: "NIIF 16" },
  { concepto: "Propiedades de inversión", valorActual: 0, valorAnterior: 0, nivel: 1, norma: "NIC 40" },
  { concepto: "Activos intangibles", valorActual: 12000000, valorAnterior: 11000000, nivel: 1, norma: "NIC 38" },
  { concepto: "Activos por impuestos diferidos", valorActual: 9000000, valorAnterior: 9000000, nivel: 1, norma: "NIC 12" },
];

const pasivosPatrimonio: LineaEstado[] = [
  { concepto: "PASIVOS", valorActual: 132000000, valorAnterior: 125000000, nivel: 0, esBold: true },
  { concepto: "PASIVOS CORRIENTES", valorActual: 60000000, valorAnterior: 53000000, nivel: 0, esBold: true },
  { concepto: "Acreedores comerciales y otras cuentas por pagar", valorActual: 30000000, valorAnterior: 27000000, nivel: 1, norma: "NIIF 9" },
  { concepto: "Beneficios a empleados - corto plazo", valorActual: 15000000, valorAnterior: 13000000, nivel: 1, norma: "NIC 19" },
  { concepto: "Pasivos por impuestos corrientes", valorActual: 10000000, valorAnterior: 9000000, nivel: 1, norma: "NIC 12" },
  { concepto: "Pasivos por arrendamientos - porción corriente", valorActual: 5000000, valorAnterior: 4000000, nivel: 1, norma: "NIIF 16" },
  { concepto: "PASIVOS NO CORRIENTES", valorActual: 72000000, valorAnterior: 72000000, nivel: 0, esBold: true },
  { concepto: "Obligaciones financieras a largo plazo", valorActual: 55000000, valorAnterior: 58000000, nivel: 1, norma: "NIIF 9" },
  { concepto: "Pasivos por arrendamientos - no corriente", valorActual: 12000000, valorAnterior: 10000000, nivel: 1, norma: "NIIF 16" },
  { concepto: "Provisiones por beneficios a empleados LP", valorActual: 3000000, valorAnterior: 2500000, nivel: 1, norma: "NIC 19" },
  { concepto: "Otras provisiones", valorActual: 2000000, valorAnterior: 1500000, nivel: 1, norma: "NIC 37" },
  { concepto: "PATRIMONIO", valorActual: 230000000, valorAnterior: 215000000, nivel: 0, esBold: true, norma: "NIC 1" },
  { concepto: "Capital emitido", valorActual: 100000000, valorAnterior: 100000000, nivel: 1 },
  { concepto: "Prima de emisión", valorActual: 0, valorAnterior: 0, nivel: 1 },
  { concepto: "Reservas", valorActual: 50000000, valorAnterior: 45000000, nivel: 1 },
  { concepto: "Ganancias acumuladas", valorActual: 52700000, valorAnterior: 45000000, nivel: 1 },
  { concepto: "Otro resultado integral acumulado", valorActual: 3000000, valorAnterior: 0, nivel: 1, norma: "NIC 1" },
  { concepto: "Resultado del período", valorActual: 24300000, valorAnterior: 25000000, nivel: 1 },
  { concepto: "TOTAL PASIVOS Y PATRIMONIO", valorActual: 362000000, valorAnterior: 340000000, nivel: 0, esBold: true },
];

export default function EstadoSituacionFinanciera() {
  const [anio, setAnio] = useState("2024");
  const [generado, setGenerado] = useState(false);

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Estado de Situación Financiera generado (NIIF - NIC 1)");
  };

  const formatValor = (valor: number) => {
    if (valor === 0) return "-";
    return `$${Math.abs(valor).toLocaleString("es-CO")}`;
  };

  const renderLineas = (lineas: LineaEstado[]) => (
    <div className="space-y-0.5">
      <div className="flex justify-between py-2 px-3 bg-primary/10 rounded font-semibold text-sm">
        <span className="text-foreground">Concepto</span>
        <div className="flex gap-16">
          <span className="text-foreground w-32 text-right">{anio}</span>
          <span className="text-foreground w-32 text-right">{Number(anio) - 1}</span>
          <span className="text-foreground w-20 text-right">Norma</span>
        </div>
      </div>
      {lineas.map((l, i) => (
        <div
          key={i}
          className={`flex justify-between py-2 px-3 rounded text-sm ${l.esBold ? "bg-muted font-bold" : "hover:bg-muted/30"}`}
          style={{ paddingLeft: `${l.nivel * 24 + 12}px` }}
        >
          <span className="text-foreground flex-1">{l.concepto}</span>
          <div className="flex gap-16 items-center">
            <span className="font-mono text-foreground w-32 text-right">{formatValor(l.valorActual)}</span>
            <span className="font-mono text-muted-foreground w-32 text-right">{formatValor(l.valorAnterior)}</span>
            <span className="w-20 text-right">
              {l.norma && <Badge variant="outline" className="text-[10px] px-1">{l.norma}</Badge>}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estado de Situación Financiera</h1>
          <p className="text-muted-foreground">NIC 1 — Presentación de Estados Financieros (NIIF Plenas)</p>
        </div>
        <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">NIIF / IFRS</Badge>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Presenta la situación financiera clasificando activos y pasivos en corrientes y no corrientes, con comparativo del período anterior según NIC 1.
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle>Período de Reporte</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Año de cierre</label>
              <Select value={anio} onValueChange={setAnio}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activos</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                  <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderLineas(activos)}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Pasivos y Patrimonio</CardTitle></CardHeader>
            <CardContent>{renderLineas(pasivosPatrimonio)}</CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
