import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Printer, Download, Users } from "lucide-react";
import { toast } from "sonner";

interface CertIVA {
  id: string;
  tercero: string;
  identificacion: string;
  bimestre: string;
  baseGravable: number;
  ivaGenerado: number;
  ivaDescontable: number;
  saldo: number;
}

const mockIVA: CertIVA[] = [
  { id: "1", tercero: "Hotel Caribe Resort", identificacion: "900111222", bimestre: "Ene-Feb 2025", baseGravable: 50000000, ivaGenerado: 9500000, ivaDescontable: 3200000, saldo: 6300000 },
  { id: "2", tercero: "Hotel Caribe Resort", identificacion: "900111222", bimestre: "Mar-Abr 2025", baseGravable: 62000000, ivaGenerado: 11780000, ivaDescontable: 4100000, saldo: 7680000 },
  { id: "3", tercero: "Restaurante Gourmet SAS", identificacion: "800333444", bimestre: "Ene-Feb 2025", baseGravable: 18000000, ivaGenerado: 3420000, ivaDescontable: 1500000, saldo: 1920000 },
];

export default function CertificadoIVA() {
  const [identificacion, setIdentificacion] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [resultados, setResultados] = useState<CertIVA[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = () => {
    if (!identificacion.trim()) {
      setResultados(mockIVA);
      setBuscado(true);
      toast.info("Mostrando todos los certificados de IVA");
      return;
    }
    const filtrado = mockIVA.filter((r) => r.identificacion.includes(identificacion.trim()));
    setResultados(filtrado);
    setBuscado(true);
    if (filtrado.length === 0) toast.warning("No se encontraron registros de IVA");
    else toast.success(`Se encontraron ${filtrado.length} registro(s)`);
  };

  const handleGenerarTodos = () => {
    setResultados(mockIVA);
    setBuscado(true);
    toast.success("Certificados de IVA generados para todos los terceros");
  };

  const totalIVA = resultados.reduce((sum, r) => sum + r.saldo, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Certificado de IVA
        </h1>
        <p className="text-muted-foreground mt-1">Generar certificados de Impuesto al Valor Agregado</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar por Identificación</CardTitle>
          <CardDescription>Ingrese el NIT o cédula, o genere todos los certificados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>Año</Label>
              <Select value={anio} onValueChange={setAnio}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>NIT / Cédula</Label>
              <Input placeholder="Ej: 900111222" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} />
            </div>
            <Button onClick={handleBuscar} className="gap-2"><Search className="h-4 w-4" /> Buscar</Button>
            <Button onClick={handleGenerarTodos} variant="outline" className="gap-2"><Users className="h-4 w-4" /> Generar Todos</Button>
          </div>
        </CardContent>
      </Card>

      {buscado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados ({resultados.length})</CardTitle>
                <CardDescription>Saldo total IVA: ${totalIVA.toLocaleString("es-CO")}</CardDescription>
              </div>
              {resultados.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1"><Printer className="h-4 w-4" /> Imprimir</Button>
                  <Button size="sm" className="gap-1"><Download className="h-4 w-4" /> Exportar PDF</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tercero</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Bimestre</TableHead>
                  <TableHead className="text-right">Base Gravable</TableHead>
                  <TableHead className="text-right">IVA Generado</TableHead>
                  <TableHead className="text-right">IVA Descontable</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.tercero}</TableCell>
                    <TableCell>{r.identificacion}</TableCell>
                    <TableCell><Badge variant="secondary">{r.bimestre}</Badge></TableCell>
                    <TableCell className="text-right">${r.baseGravable.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">${r.ivaGenerado.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">${r.ivaDescontable.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right font-semibold">${r.saldo.toLocaleString("es-CO")}</TableCell>
                  </TableRow>
                ))}
                {resultados.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No se encontraron registros</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
