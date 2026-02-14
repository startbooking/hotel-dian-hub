import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, FileDown, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const formatosDisponibles = [
  { codigo: "1001", nombre: "Pagos y abonos en cuenta", version: "10" },
  { codigo: "1003", nombre: "Retenciones en la fuente practicadas", version: "8" },
  { codigo: "1004", nombre: "Descuentos tributarios", version: "7" },
  { codigo: "1005", nombre: "IVA descontable", version: "8" },
  { codigo: "1006", nombre: "IVA generado", version: "8" },
  { codigo: "1007", nombre: "Ingresos recibidos", version: "9" },
  { codigo: "1008", nombre: "Saldo de cuentas por cobrar", version: "8" },
  { codigo: "1009", nombre: "Saldo de cuentas por pagar", version: "8" },
  { codigo: "1010", nombre: "Información de socios", version: "8" },
  { codigo: "1012", nombre: "Declaraciones tributarias", version: "7" },
  { codigo: "2276", nombre: "Información de rentas de trabajo", version: "3" },
];

export default function MediosMagneticos() {
  const [anioGravable, setAnioGravable] = useState(new Date().getFullYear().toString());
  const [formatosGenerados, setFormatosGenerados] = useState<string[]>([]);

  const handleGenerar = (codigo: string) => {
    setFormatosGenerados((prev) => [...prev, codigo]);
    toast.success(`Formato ${codigo} generado exitosamente`);
  };

  const handleGenerarTodos = () => {
    const codigos = formatosDisponibles.map((f) => f.codigo);
    setFormatosGenerados(codigos);
    toast.success("Todos los formatos han sido generados");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Medios Magnéticos
          </h1>
          <p className="text-muted-foreground mt-1">Generación de información exógena para la DIAN</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parámetros de Generación</CardTitle>
          <CardDescription>Configure el año gravable y genere los formatos requeridos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Año Gravable</Label>
              <Select value={anioGravable} onValueChange={setAnioGravable}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerarTodos} className="w-full gap-2">
                <RefreshCw className="h-4 w-4" />
                Generar Todos los Formatos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formatos Disponibles</CardTitle>
          <CardDescription>Seleccione los formatos que desea generar para el año {anioGravable}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formato</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formatosDisponibles.map((formato) => (
                <TableRow key={formato.codigo}>
                  <TableCell className="font-medium">{formato.codigo}</TableCell>
                  <TableCell>{formato.nombre}</TableCell>
                  <TableCell>{formato.version}</TableCell>
                  <TableCell>
                    {formatosGenerados.includes(formato.codigo) ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Generado</Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleGenerar(formato.codigo)} className="gap-1">
                      <RefreshCw className="h-3 w-3" /> Generar
                    </Button>
                    {formatosGenerados.includes(formato.codigo) && (
                      <Button size="sm" variant="ghost" className="gap-1">
                        <FileDown className="h-3 w-3" /> XML
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
