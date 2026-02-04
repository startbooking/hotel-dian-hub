import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, Users, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TerceroItem {
  tipoDocumento: string;
  documento: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
}

export function ImportTerceros() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<TerceroItem[]>([]);
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
        { tipoDocumento: "NIT", documento: "900123456-1", nombre: "Empresa ABC S.A.S", email: "contacto@empresaabc.com", telefono: "3001234567", direccion: "Calle 123 #45-67", ciudad: "Bogotá" },
        { tipoDocumento: "CC", documento: "1234567890", nombre: "Juan Pérez García", email: "juan.perez@email.com", telefono: "3101234567", direccion: "Carrera 50 #20-30", ciudad: "Medellín" },
        { tipoDocumento: "NIT", documento: "800987654-2", nombre: "Distribuidora XYZ Ltda", email: "info@xyz.com", telefono: "3201234567", direccion: "Av. Principal 100", ciudad: "Cali" },
        { tipoDocumento: "CE", documento: "E123456", nombre: "Carlos Rodríguez", email: "carlos.r@email.com", telefono: "3151234567", direccion: "Calle 80 #15-20", ciudad: "Barranquilla" },
        { tipoDocumento: "NIT", documento: "901234567-3", nombre: "Servicios Integrales SAS", email: "servicios@integral.co", telefono: "3181234567", direccion: "Cra 7 #72-41", ciudad: "Bogotá" },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      localStorage.setItem("terceros_data", JSON.stringify(previewData));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${previewData.length} terceros`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Plantilla descargada",
      description: "Se ha descargado la plantilla de Terceros en formato Excel",
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
          <Users className="h-5 w-5" />
          Importar Terceros
        </CardTitle>
        <CardDescription>
          Importe clientes, proveedores y otros terceros desde un archivo Excel o CSV
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
            <Users className="h-5 w-5 text-primary" />
            <span className="flex-1">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={clearData}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {previewData.length > 0 && (
          <>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo Doc.</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Nombre / Razón Social</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Ciudad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{item.tipoDocumento}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{item.documento}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{item.email}</TableCell>
                      <TableCell>{item.telefono}</TableCell>
                      <TableCell>{item.ciudad}</TableCell>
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
                    Importar {previewData.length} terceros
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
