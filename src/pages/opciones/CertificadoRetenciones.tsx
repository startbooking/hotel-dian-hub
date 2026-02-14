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

interface Retencion {
  id: string;
  tercero: string;
  identificacion: string;
  concepto: string;
  base: number;
  porcentaje: number;
  valor: number;
  periodo: string;
}

const mockRetenciones: Retencion[] = [
  { id: "1", tercero: "Proveedor ABC S.A.S", identificacion: "900123456", concepto: "Compras", base: 5000000, porcentaje: 2.5, valor: 125000, periodo: "Enero 2025" },
  { id: "2", tercero: "Servicios XYZ Ltda", identificacion: "800456789", concepto: "Servicios", base: 3000000, porcentaje: 4, valor: 120000, periodo: "Febrero 2025" },
  { id: "3", tercero: "Consultor Juan Pérez", identificacion: "1020304050", concepto: "Honorarios", base: 8000000, porcentaje: 11, valor: 880000, periodo: "Marzo 2025" },
];

export default function CertificadoRetenciones() {
  const [identificacion, setIdentificacion] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [resultados, setResultados] = useState<Retencion[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = () => {
    if (!identificacion.trim()) {
      const todos = mockRetenciones;
      setResultados(todos);
      setBuscado(true);
      toast.info("Mostrando todas las retenciones del período");
      return;
    }
    const filtrado = mockRetenciones.filter((r) => r.identificacion.includes(identificacion.trim()));
    setResultados(filtrado);
    setBuscado(true);
    if (filtrado.length === 0) toast.warning("No se encontraron retenciones para esta identificación");
    else toast.success(`Se encontraron ${filtrado.length} registro(s)`);
  };

  const handleGenerarTodos = () => {
    setResultados(mockRetenciones);
    setBuscado(true);
    toast.success("Certificados generados para todos los terceros");
  };

  const totalRetenido = resultados.reduce((sum, r) => sum + r.valor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Certificado de Retenciones
        </h1>
        <p className="text-muted-foreground mt-1">Generar certificados de retención en la fuente</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar por Identificación</CardTitle>
          <CardDescription>Ingrese el NIT o cédula del tercero, o genere todos los certificados</CardDescription>
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
              <Input placeholder="Ej: 900123456" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} />
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
                <CardDescription>Total retenido: ${totalRetenido.toLocaleString("es-CO")}</CardDescription>
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
                  <TableHead>Identificación</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Base</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead className="text-right">Valor Retenido</TableHead>
                  <TableHead>Período</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.tercero}</TableCell>
                    <TableCell>{r.identificacion}</TableCell>
                    <TableCell>{r.concepto}</TableCell>
                    <TableCell className="text-right">${r.base.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">{r.porcentaje}%</TableCell>
                    <TableCell className="text-right font-semibold">${r.valor.toLocaleString("es-CO")}</TableCell>
                    <TableCell><Badge variant="secondary">{r.periodo}</Badge></TableCell>
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
