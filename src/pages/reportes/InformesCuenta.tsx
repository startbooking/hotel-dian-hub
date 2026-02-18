import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface InformeCuenta {
  id: string;
  cuenta: string;
  nombre: string;
  saldoAnterior: number;
  debitos: number;
  creditos: number;
  saldoFinal: number;
}

const mockCuentas: InformeCuenta[] = [
  { id: "1", cuenta: "1105", nombre: "Caja", saldoAnterior: 2000000, debitos: 15000000, creditos: 12000000, saldoFinal: 5000000 },
  { id: "2", cuenta: "1305", nombre: "Clientes", saldoAnterior: 8000000, debitos: 22000000, creditos: 18000000, saldoFinal: 12000000 },
  { id: "3", cuenta: "2205", nombre: "Proveedores", saldoAnterior: -5000000, debitos: 10000000, creditos: 14000000, saldoFinal: -9000000 },
  { id: "4", cuenta: "4135", nombre: "Ingresos Hoteleros", saldoAnterior: 0, debitos: 0, creditos: 45000000, saldoFinal: -45000000 },
];

export default function InformesCuenta() {
  const [cuentaFiltro, setCuentaFiltro] = useState("");
  const [anio, setAnio] = useState("2024");
  const [resultados, setResultados] = useState<InformeCuenta[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleConsultar = () => {
    const filtered = cuentaFiltro ? mockCuentas.filter(c => c.cuenta.startsWith(cuentaFiltro)) : mockCuentas;
    setResultados(filtered);
    setBuscado(true);
    toast.success(`${filtered.length} cuentas encontradas`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Informes por Cuenta</h1>
          <p className="text-muted-foreground">Resumen de movimientos agrupados por cuenta contable</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Código de cuenta" value={cuentaFiltro} onChange={(e) => setCuentaFiltro(e.target.value)} />
            <Button onClick={handleConsultar}><Search className="mr-2 h-4 w-4" />Consultar</Button>
          </div>
        </CardContent>
      </Card>

      {buscado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultados ({resultados.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Saldo Anterior</TableHead>
                  <TableHead className="text-right">Débitos</TableHead>
                  <TableHead className="text-right">Créditos</TableHead>
                  <TableHead className="text-right">Saldo Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono">{c.cuenta}</TableCell>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell className="text-right">${c.saldoAnterior.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">${c.debitos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">${c.creditos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right font-medium">${c.saldoFinal.toLocaleString("es-CO")}</TableCell>
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
