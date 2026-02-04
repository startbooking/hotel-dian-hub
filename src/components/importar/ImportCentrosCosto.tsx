import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, Building, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CentroCostoItem {
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: "activo" | "inactivo";
}

export function ImportCentrosCosto() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CentroCostoItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      simulateFileParsing();
    }
  };

  const simulateFileParsing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPreviewData([
        { codigo: "001", nombre: "Administración", descripcion: "Gastos administrativos generales", tipo: "Operativo", estado: "activo" },
        { codigo: "002", nombre: "Ventas", descripcion: "Departamento comercial", tipo: "Operativo", estado: "activo" },
        { codigo: "003", nombre: "Producción", descripcion: "Área de manufactura", tipo: "Productivo", estado: "activo" },
        { codigo: "004", nombre: "Logística", descripcion: "Almacén y distribución", tipo: "Operativo", estado: "activo" },
        { codigo: "005", nombre: "TI", descripcion: "Tecnología de información", tipo: "Soporte", estado: "activo" },
        { codigo: "006", nombre: "Recursos Humanos", descripcion: "Gestión del talento", tipo: "Soporte", estado: "activo" },
        { codigo: "P01", nombre: "Proyecto Alpha", descripcion: "Proyecto de expansión", tipo: "Proyecto", estado: "activo" },
        { codigo: "P02", nombre: "Proyecto Beta", descripcion: "Implementación ERP", tipo: "Proyecto", estado: "inactivo" },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      localStorage.setItem("centros_costo_data", JSON.stringify(previewData));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${previewData.length} centros de costo`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Plantilla descargada",
      description: "Se ha descargado la plantilla de Centros de Costo en formato Excel",
    });
  };

  const clearData = () => {
    setFile(null);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Importar Centros de Costo
        </CardTitle>
        <CardDescription>
          Importe la estructura de centros de costo y proyectos desde un archivo Excel o CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Plantilla
          </Button>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <Building className="h-5 w-5 text-primary" />
            <span className="flex-1">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={clearData}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {previewData.length > 0 && (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{item.descripcion}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.estado === "activo" ? "default" : "secondary"}>
                          {item.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearData}>
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={isProcessing}>
                {isProcessing ? (
                  "Procesando..."
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar {previewData.length} centros
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
