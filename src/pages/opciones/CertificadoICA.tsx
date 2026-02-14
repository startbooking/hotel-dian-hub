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

interface CertICA {
  id: string;
  tercero: string;
  identificacion: string;
  municipio: string;
  actividad: string;
  ingresos: number;
  tarifa: number;
  impuesto: number;
  bimestre: string;
}

const mockICA: CertICA[] = [
  { id: "1", tercero: "Hotel Caribe Resort", identificacion: "900111222", municipio: "Cartagena", actividad: "Hotelería", ingresos: 120000000, tarifa: 7, impuesto: 840000, bimestre: "Ene-Feb 2025" },
  { id: "2", tercero: "Hotel Caribe Resort", identificacion: "900111222", municipio: "Cartagena", actividad: "Restaurante", ingresos: 45000000, tarifa: 10, impuesto: 450000, bimestre: "Mar-Abr 2025" },
  { id: "3", tercero: "Comercial del Norte SAS", identificacion: "800555666", municipio: "Barranquilla", actividad: "Comercio", ingresos: 80000000, tarifa: 4.14, impuesto: 331200, bimestre: "Ene-Feb 2025" },
];

export default function CertificadoICA() {
  const [identificacion, setIdentificacion] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [resultados, setResultados] = useState<CertICA[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = () => {
    if (!identificacion.trim()) {
      setResultados(mockICA);
      setBuscado(true);
      toast.info("Mostrando todos los certificados de ICA");
      return;
    }
    const filtrado = mockICA.filter((r) => r.identificacion.includes(identificacion.trim()));
    setResultados(filtrado);
    setBuscado(true);
    if (filtrado.length === 0) toast.warning("No se encontraron registros de ICA");
    else toast.success(`Se encontraron ${filtrado.length} registro(s)`);
  };

  const handleGenerarTodos = () => {
    setResultados(mockICA);
    setBuscado(true);
    toast.success("Certificados de ICA generados para todos los terceros");
  };

  const totalICA = resultados.reduce((sum, r) => sum + r.impuesto, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Certificado de ICA
        </h1>
        <p className="text-muted-foreground mt-1">Generar certificados de Industria y Comercio</p>
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
                <CardDescription>Total ICA: ${totalICA.toLocaleString("es-CO")}</CardDescription>
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
                  <TableHead>Municipio</TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Tarifa (‰)</TableHead>
                  <TableHead className="text-right">Impuesto</TableHead>
                  <TableHead>Bimestre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.tercero}</TableCell>
                    <TableCell>{r.identificacion}</TableCell>
                    <TableCell>{r.municipio}</TableCell>
                    <TableCell>{r.actividad}</TableCell>
                    <TableCell className="text-right">${r.ingresos.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">{r.tarifa}‰</TableCell>
                    <TableCell className="text-right font-semibold">${r.impuesto.toLocaleString("es-CO")}</TableCell>
                    <TableCell><Badge variant="secondary">{r.bimestre}</Badge></TableCell>
                  </TableRow>
                ))}
                {resultados.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No se encontraron registros</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
