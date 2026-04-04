import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch, Printer, FileDown, Search, Info } from "lucide-react";
import { toast } from "sonner";

interface FilaCambio {
  concepto: string;
  capitalEmitido: number;
  primaEmision: number;
  reservas: number;
  gananciasAcumuladas: number;
  ori: number;
  total: number;
  esBold?: boolean;
}

const filas: FilaCambio[] = [
  { concepto: "Saldo al 1 de enero 2023", capitalEmitido: 100000000, primaEmision: 0, reservas: 40000000, gananciasAcumuladas: 40000000, ori: 0, total: 180000000, esBold: true },
  { concepto: "Ganancia neta del período", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: 14850000, ori: 0, total: 14850000 },
  { concepto: "Otro resultado integral", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: 0, ori: 0, total: 0 },
  { concepto: "Resultado integral total", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: 14850000, ori: 0, total: 14850000, esBold: true },
  { concepto: "Distribución de dividendos", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: -4000000, ori: 0, total: -4000000 },
  { concepto: "Traslado a reservas", capitalEmitido: 0, primaEmision: 0, reservas: 5000000, gananciasAcumuladas: -5000000, ori: 0, total: 0 },
  { concepto: "Saldo al 31 de diciembre 2023", capitalEmitido: 100000000, primaEmision: 0, reservas: 45000000, gananciasAcumuladas: 45850000, ori: 0, total: 190850000, esBold: true },
  { concepto: "Ganancia neta del período", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: 16775000, ori: 0, total: 16775000 },
  { concepto: "Otro resultado integral", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: 0, ori: 2500000, total: 2500000 },
  { concepto: "Resultado integral total", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: 16775000, ori: 2500000, total: 19275000, esBold: true },
  { concepto: "Distribución de dividendos", capitalEmitido: 0, primaEmision: 0, reservas: 0, gananciasAcumuladas: -5000000, ori: 0, total: -5000000 },
  { concepto: "Traslado a reservas", capitalEmitido: 0, primaEmision: 0, reservas: 5000000, gananciasAcumuladas: -5000000, ori: 0, total: 0 },
  { concepto: "Saldo al 31 de diciembre 2024", capitalEmitido: 100000000, primaEmision: 0, reservas: 50000000, gananciasAcumuladas: 52625000, ori: 2500000, total: 205125000, esBold: true },
];

export default function CambiosPatrimonio() {
  const [anio, setAnio] = useState("2024");
  const [generado, setGenerado] = useState(false);

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Estado de Cambios en el Patrimonio generado (NIC 1)");
  };

  const fmt = (v: number) => {
    if (v === 0) return "-";
    const abs = Math.abs(v);
    return `${v < 0 ? "(" : ""}$${abs.toLocaleString("es-CO")}${v < 0 ? ")" : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estado de Cambios en el Patrimonio</h1>
          <p className="text-muted-foreground">NIC 1 — Cambios en el patrimonio neto</p>
        </div>
        <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">NIIF / IFRS</Badge>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Presenta la conciliación entre saldos iniciales y finales de cada componente del patrimonio, incluyendo el resultado integral total del período (NIC 1.106).
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle>Período</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cambios en el Patrimonio — {anio}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead className="min-w-[250px]">Concepto</TableHead>
                  <TableHead className="text-right">Capital Emitido</TableHead>
                  <TableHead className="text-right">Prima de Emisión</TableHead>
                  <TableHead className="text-right">Reservas</TableHead>
                  <TableHead className="text-right">Ganancias Acumuladas</TableHead>
                  <TableHead className="text-right">ORI</TableHead>
                  <TableHead className="text-right">Total Patrimonio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filas.map((f, i) => (
                  <TableRow key={i} className={f.esBold ? "bg-muted font-bold" : ""}>
                    <TableCell>{f.concepto}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmt(f.capitalEmitido)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmt(f.primaEmision)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmt(f.reservas)}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${f.gananciasAcumuladas < 0 ? "text-destructive" : ""}`}>{fmt(f.gananciasAcumuladas)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmt(f.ori)}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${f.total < 0 ? "text-destructive" : ""}`}>{fmt(f.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
