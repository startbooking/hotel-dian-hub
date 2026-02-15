import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Database, FileDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface FormatoDIAN {
  codigo: string;
  nombre: string;
  version: string;
  normatividad: string;
}

const formatosDisponibles: FormatoDIAN[] = [
  { codigo: "820", nombre: "Información de enajenación de acciones, cuotas o partes interés o aportes que no cotizan en bolsa", version: "1", normatividad: "Art. 631-3 del E.T., Art.73 de Res.162 de 2023" },
  { codigo: "1001", nombre: "Pagos o Abonos en cuenta y retenciones practicadas", version: "10", normatividad: "Literales b) y e) Art.631 del E.T., Art.20 de Res.162 de 2023" },
  { codigo: "1003", nombre: "Retenciones en la fuente que le practicaron", version: "7", normatividad: "Literal c) Art.631 del E.T., Art.21 de Res.162 de 2023" },
  { codigo: "1004", nombre: "Descuentos tributarios solicitados", version: "8", normatividad: "Literal (d) Art.631 del E.T., Art.39 de Res.162 de 2023" },
  { codigo: "1005", nombre: "Impuesto a las ventas por pagar (Descontable)", version: "8", normatividad: "Literal (e) Art.631 del E.T., Art.23 de Res.162 de 2023" },
  { codigo: "1006", nombre: "Impuesto a las ventas por pagar (Generado) e impuesto al consumo", version: "8", normatividad: "Literal (f) Art.631 del E.T., Art.24 de Res.162 de 2023" },
  { codigo: "1007", nombre: "Ingresos Recibidos", version: "9", normatividad: "Literal (f) Art.631 del E.T., Art.22 de Res.162 de 2023" },
  { codigo: "1008", nombre: "Saldos de cuentas por cobrar al 31 de diciembre", version: "7", normatividad: "Literal (i) Art.631 del E.T., Art.26 de Res.162 de 2023" },
  { codigo: "1009", nombre: "Saldos de cuentas por pagar al 31 de diciembre", version: "7", normatividad: "Literal (h) Art.631 del E.T., Art.25 de Res.162 de 2023" },
  { codigo: "1010", nombre: "Información de socios, accionistas, comuneros y/o cooperados", version: "9", normatividad: "Literal a) Art.631 del E.T., Art.19 de Res.162 de 2023" },
  { codigo: "1011", nombre: "Información de las declaraciones tributarias", version: "6", normatividad: "Literal (k) Art.631 del E.T., Art.32 al 38 de Res.162 de 2023" },
  { codigo: "1012", nombre: "Información de las declaraciones tributarias, acciones y aportes e inversiones en bonos, certificados, títulos y demás inversiones tributarias", version: "7", normatividad: "Literal (k) Art.631 del E.T., Art.29 al 31 de Res.162 de 2023" },
  { codigo: "1035", nombre: "Información de vinculados económicos", version: "8", normatividad: "Art.631-1 y 631-3 del E.T., Art.43 de Res.162 de 2023" },
  { codigo: "1036", nombre: "Información de subordinadas, vinculadas del exterior o controladas del exterior sin residencia fiscal en Colombia – ECE", version: "9", normatividad: "Art.631-1 y 631-3 del E.T., Art.44 y 45 de Res.162 de 2023" },
  { codigo: "1647", nombre: "Ingresos recibidos para terceros", version: "2", normatividad: "Literal (g) Art.631 del E.T., Art.28 de Res.162 de 2023" },
  { codigo: "2275", nombre: "Ingresos no constitutivos de renta ni ganancia ocasional", version: "2", normatividad: "Literal (k) Art.631 del E.T., Art.40 de Res.162 de 2023" },
  { codigo: "2276", nombre: "Información de rentas de trabajo y pensiones", version: "4", normatividad: "Literales b) y e) art.631 y 631-3 del E.T., Art.51 de Res.162 de 2023" },
  { codigo: "2280", nombre: "Deducciones empleadas víctimas violencia", version: "1", normatividad: "Art.2.2.9.3.7 Decreto 1072 de 2015 DUR Trabajo. Art.59 de Res.162 de 2023" },
];

export default function MediosMagneticos() {
  const [anioGravable, setAnioGravable] = useState(new Date().getFullYear().toString());
  const [formatosGenerados, setFormatosGenerados] = useState<string[]>([]);

  const handleGenerar = (codigo: string) => {
    setFormatosGenerados((prev) =>
      prev.includes(codigo) ? prev : [...prev, codigo]
    );
    toast.success(`Formato ${codigo} generado exitosamente para el año ${anioGravable}`);
  };

  const handleGenerarTodos = () => {
    const codigos = formatosDisponibles.map((f) => f.codigo);
    setFormatosGenerados(codigos);
    toast.success(`Todos los formatos han sido generados para el año ${anioGravable}`);
  };

  const handleDescargarXML = (codigo: string) => {
    toast.info(`Descargando XML del formato ${codigo}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          Medios Magnéticos – Información Exógena DIAN
        </h1>
        <p className="text-muted-foreground mt-1">
          Resolución 162 de 2023 – Generación de formatos XML para reporte a la DIAN
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parámetros de Generación</CardTitle>
          <CardDescription>Seleccione el año gravable y genere los formatos requeridos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 w-48">
              <Label>Año Gravable</Label>
              <Select value={anioGravable} onValueChange={setAnioGravable}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2023, 2024, 2025, 2026].map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerarTodos} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generar Todos ({formatosDisponibles.length} formatos)
            </Button>
            <span className="text-sm text-muted-foreground">
              {formatosGenerados.length} de {formatosDisponibles.length} generados
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formatos Disponibles ({formatosDisponibles.length})</CardTitle>
          <CardDescription>Información exógena – Año gravable {anioGravable}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Formato</TableHead>
                  <TableHead className="w-12">Ver.</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden lg:table-cell">Normatividad</TableHead>
                  <TableHead className="w-24">Estado</TableHead>
                  <TableHead className="text-right w-48">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formatosDisponibles.map((formato) => {
                  const generado = formatosGenerados.includes(formato.codigo);
                  return (
                    <TableRow key={formato.codigo}>
                      <TableCell className="font-mono font-bold">{formato.codigo}</TableCell>
                      <TableCell className="text-center">{formato.version}</TableCell>
                      <TableCell className="text-sm">{formato.nombre}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formato.normatividad}</TableCell>
                      <TableCell>
                        {generado ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Generado</Badge>
                        ) : (
                          <Badge variant="secondary">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleGenerar(formato.codigo)} className="gap-1">
                            <RefreshCw className="h-3 w-3" /> Generar
                          </Button>
                          {generado && (
                            <Button size="sm" variant="ghost" onClick={() => handleDescargarXML(formato.codigo)} className="gap-1">
                              <FileDown className="h-3 w-3" /> XML
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
