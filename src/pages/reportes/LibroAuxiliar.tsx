import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface MovimientoAuxiliar {
  id: string;
  fecha: string;
  cuenta: string;
  nombreCuenta: string;
  tercero: string;
  descripcion: string;
  debito: number;
  credito: number;
  saldo: number;
}

const mockMovimientos: MovimientoAuxiliar[] = [
  { id: "1", fecha: "2024-01-15", cuenta: "110505", nombreCuenta: "Caja General", tercero: "Cliente A", descripcion: "Recaudo factura 001", debito: 5000000, credito: 0, saldo: 5000000 },
  { id: "2", fecha: "2024-01-18", cuenta: "110505", nombreCuenta: "Caja General", tercero: "Proveedor B", descripcion: "Pago factura compra", debito: 0, credito: 2500000, saldo: 2500000 },
  { id: "3", fecha: "2024-02-01", cuenta: "130505", nombreCuenta: "Clientes Nacionales", tercero: "Hotel Caribe", descripcion: "Factura venta 045", debito: 8500000, credito: 0, saldo: 8500000 },
  { id: "4", fecha: "2024-02-10", cuenta: "220505", nombreCuenta: "Proveedores Nacionales", tercero: "Suministros SAS", descripcion: "Compra insumos", debito: 0, credito: 3200000, saldo: -3200000 },
];

export default function LibroAuxiliar() {
  const [cuentaDesde, setCuentaDesde] = useState("");
  const [cuentaHasta, setCuentaHasta] = useState("");
  const [anio, setAnio] = useState("2024");
  const [resultados, setResultados] = useState<MovimientoAuxiliar[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleConsultar = () => {
    setResultados(mockMovimientos);
    setBuscado(true);
    toast.success("Libro auxiliar generado correctamente");
  };

  const totalDebitos = resultados.reduce((acc, m) => acc + m.debito, 0);
  const totalCreditos = resultados.reduce((acc, m) => acc + m.credito, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Libro Auxiliar</h1>
          <p className="text-muted-foreground">Consulta detallada de movimientos por cuenta contable</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros de Consulta</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Cuenta desde" value={cuentaDesde} onChange={(e) => setCuentaDesde(e.target.value)} />
            <Input placeholder="Cuenta hasta" value={cuentaHasta} onChange={(e) => setCuentaHasta(e.target.value)} />
            <Button onClick={handleConsultar}><Search className="mr-2 h-4 w-4" />Consultar</Button>
          </div>
        </CardContent>
      </Card>

      {buscado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultados ({resultados.length} movimientos)</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
                <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Débitos</p>
                <p className="text-lg font-bold text-foreground">${totalDebitos.toLocaleString("es-CO")}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Créditos</p>
                <p className="text-lg font-bold text-foreground">${totalCreditos.toLocaleString("es-CO")}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tercero</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Débito</TableHead>
                  <TableHead className="text-right">Crédito</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.fecha}</TableCell>
                    <TableCell className="font-mono">{m.cuenta}</TableCell>
                    <TableCell>{m.nombreCuenta}</TableCell>
                    <TableCell>{m.tercero}</TableCell>
                    <TableCell>{m.descripcion}</TableCell>
                    <TableCell className="text-right">{m.debito > 0 ? `$${m.debito.toLocaleString("es-CO")}` : "-"}</TableCell>
                    <TableCell className="text-right">{m.credito > 0 ? `$${m.credito.toLocaleString("es-CO")}` : "-"}</TableCell>
                    <TableCell className="text-right font-medium">${m.saldo.toLocaleString("es-CO")}</TableCell>
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
