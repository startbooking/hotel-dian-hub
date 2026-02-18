import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Printer, FileDown, Search } from "lucide-react";
import { toast } from "sonner";

interface InformeTercero {
  id: string;
  nit: string;
  razonSocial: string;
  totalDebitos: number;
  totalCreditos: number;
  saldo: number;
}

const mockTerceros: InformeTercero[] = [
  { id: "1", nit: "900123456-1", razonSocial: "Hotel Caribe SAS", totalDebitos: 15000000, totalCreditos: 8000000, saldo: 7000000 },
  { id: "2", nit: "800654321-2", razonSocial: "Suministros Hoteleros Ltda", totalDebitos: 3200000, totalCreditos: 12500000, saldo: -9300000 },
  { id: "3", nit: "901987654-3", razonSocial: "Turismo Nacional SAS", totalDebitos: 22000000, totalCreditos: 18000000, saldo: 4000000 },
];

export default function InformesTerceros() {
  const [nit, setNit] = useState("");
  const [anio, setAnio] = useState("2024");
  const [resultados, setResultados] = useState<InformeTercero[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleConsultar = () => {
    const filtered = nit ? mockTerceros.filter(t => t.nit.includes(nit)) : mockTerceros;
    setResultados(filtered);
    setBuscado(true);
    toast.success(`${filtered.length} terceros encontrados`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Informes por Terceros</h1>
          <p className="text-muted-foreground">Resumen de movimientos agrupados por tercero</p>
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
            <Input placeholder="NIT / Cédula" value={nit} onChange={(e) => setNit(e.target.value)} />
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
                  <TableHead>NIT</TableHead>
                  <TableHead>Razón Social</TableHead>
                  <TableHead className="text-right">Total Débitos</TableHead>
                  <TableHead className="text-right">Total Créditos</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono">{t.nit}</TableCell>
                    <TableCell>{t.razonSocial}</TableCell>
                    <TableCell className="text-right">${t.totalDebitos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">${t.totalCreditos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right font-medium">${t.saldo.toLocaleString("es-CO")}</TableCell>
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
