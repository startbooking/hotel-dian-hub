import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface InformeCentro {
  id: string;
  codigo: string;
  centro: string;
  ingresos: number;
  gastos: number;
  resultado: number;
}

const mockCentros: InformeCentro[] = [
  { id: "1", codigo: "CC01", centro: "Recepción", ingresos: 25000000, gastos: 8000000, resultado: 17000000 },
  { id: "2", codigo: "CC02", centro: "Restaurante", ingresos: 18000000, gastos: 12000000, resultado: 6000000 },
  { id: "3", codigo: "CC03", centro: "Habitaciones", ingresos: 45000000, gastos: 15000000, resultado: 30000000 },
  { id: "4", codigo: "CC04", centro: "Administración", ingresos: 0, gastos: 9500000, resultado: -9500000 },
];

export default function InformesCentro() {
  const [anio, setAnio] = useState("2024");
  const [resultados, setResultados] = useState<InformeCentro[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleConsultar = () => {
    setResultados(mockCentros);
    setBuscado(true);
    toast.success("Informe por centro de costo generado");
  };

  const totalIngresos = resultados.reduce((a, c) => a + c.ingresos, 0);
  const totalGastos = resultados.reduce((a, c) => a + c.gastos, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Informes por Centro de Costo</h1>
          <p className="text-muted-foreground">Análisis de ingresos y gastos por centro de costo</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleConsultar}><Search className="mr-2 h-4 w-4" />Consultar</Button>
          </div>
        </CardContent>
      </Card>

      {buscado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultados</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Ingresos</p>
                <p className="text-lg font-bold text-foreground">${totalIngresos.toLocaleString("es-CO")}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Gastos</p>
                <p className="text-lg font-bold text-foreground">${totalGastos.toLocaleString("es-CO")}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Resultado</p>
                <p className="text-lg font-bold text-foreground">${(totalIngresos - totalGastos).toLocaleString("es-CO")}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Centro</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Gastos</TableHead>
                  <TableHead className="text-right">Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono">{c.codigo}</TableCell>
                    <TableCell>{c.centro}</TableCell>
                    <TableCell className="text-right">${c.ingresos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">${c.gastos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className={`text-right font-medium ${c.resultado < 0 ? "text-destructive" : ""}`}>
                      ${c.resultado.toLocaleString("es-CO")}
                    </TableCell>
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
