import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PUCItem {
  codigo: string;
  nombre: string;
  naturaleza: "debito" | "credito";
  nivel: number;
  tipo: "titulo" | "movimiento";
}

export function ImportPUC() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PUCItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate parsing - in production would use a library like xlsx
      simulateFileParsing();
    }
  };

  const simulateFileParsing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Demo data
      setPreviewData([
        { codigo: "1", nombre: "ACTIVO", naturaleza: "debito", nivel: 1, tipo: "titulo" },
        { codigo: "11", nombre: "DISPONIBLE", naturaleza: "debito", nivel: 2, tipo: "titulo" },
        { codigo: "1105", nombre: "CAJA", naturaleza: "debito", nivel: 3, tipo: "titulo" },
        { codigo: "110505", nombre: "Caja General", naturaleza: "debito", nivel: 4, tipo: "movimiento" },
        { codigo: "1110", nombre: "BANCOS", naturaleza: "debito", nivel: 3, tipo: "titulo" },
        { codigo: "111005", nombre: "Banco Nacional", naturaleza: "debito", nivel: 4, tipo: "movimiento" },
        { codigo: "2", nombre: "PASIVO", naturaleza: "credito", nivel: 1, tipo: "titulo" },
        { codigo: "21", nombre: "OBLIGACIONES FINANCIERAS", naturaleza: "credito", nivel: 2, tipo: "titulo" },
        { codigo: "3", nombre: "PATRIMONIO", naturaleza: "credito", nivel: 1, tipo: "titulo" },
        { codigo: "4", nombre: "INGRESOS", naturaleza: "credito", nivel: 1, tipo: "titulo" },
        { codigo: "5", nombre: "GASTOS", naturaleza: "debito", nivel: 1, tipo: "titulo" },
        { codigo: "6", nombre: "COSTOS DE VENTAS", naturaleza: "debito", nivel: 1, tipo: "titulo" },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Save to localStorage for demo
      localStorage.setItem("puc_data", JSON.stringify(previewData));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${previewData.length} cuentas al Plan Único de Cuentas`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Plantilla descargada",
      description: "Se ha descargado la plantilla de PUC en formato Excel",
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
          <FileSpreadsheet className="h-5 w-5" />
          Importar Plan Único de Cuentas (PUC)
        </CardTitle>
        <CardDescription>
          Importe el catálogo de cuentas contables desde un archivo Excel o CSV
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
            <FileSpreadsheet className="h-5 w-5 text-primary" />
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
                    <TableHead>Naturaleza</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 10).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{item.codigo}</TableCell>
                      <TableCell style={{ paddingLeft: `${item.nivel * 12}px` }}>
                        {item.nombre}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.naturaleza === "debito" ? "default" : "secondary"}>
                          {item.naturaleza}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.nivel}</TableCell>
                      <TableCell>
                        <Badge variant={item.tipo === "movimiento" ? "outline" : "secondary"}>
                          {item.tipo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {previewData.length > 10 && (
              <p className="text-sm text-muted-foreground text-center">
                Mostrando 10 de {previewData.length} registros
              </p>
            )}

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
                    Importar {previewData.length} cuentas
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
