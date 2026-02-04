import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, DollarSign, Download, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SaldoInicialItem {
  codigoCuenta: string;
  nombreCuenta: string;
  debito: number;
  credito: number;
  saldo: number;
}

export function ImportSaldosIniciales() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<SaldoInicialItem[]>([]);
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
        { codigoCuenta: "110505", nombreCuenta: "Caja General", debito: 5000000, credito: 0, saldo: 5000000 },
        { codigoCuenta: "111005", nombreCuenta: "Banco Nacional", debito: 25000000, credito: 0, saldo: 25000000 },
        { codigoCuenta: "130505", nombreCuenta: "Clientes Nacionales", debito: 15000000, credito: 0, saldo: 15000000 },
        { codigoCuenta: "143505", nombreCuenta: "Mercancías", debito: 30000000, credito: 0, saldo: 30000000 },
        { codigoCuenta: "151205", nombreCuenta: "Maquinaria y Equipo", debito: 50000000, credito: 0, saldo: 50000000 },
        { codigoCuenta: "210505", nombreCuenta: "Obligaciones Bancarias", debito: 0, credito: 40000000, saldo: -40000000 },
        { codigoCuenta: "220505", nombreCuenta: "Proveedores Nacionales", debito: 0, credito: 25000000, saldo: -25000000 },
        { codigoCuenta: "310505", nombreCuenta: "Capital Suscrito", debito: 0, credito: 50000000, saldo: -50000000 },
        { codigoCuenta: "360505", nombreCuenta: "Utilidades Acumuladas", debito: 0, credito: 10000000, saldo: -10000000 },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  const totalDebitos = previewData.reduce((sum, item) => sum + item.debito, 0);
  const totalCreditos = previewData.reduce((sum, item) => sum + item.credito, 0);
  const isBalanced = totalDebitos === totalCreditos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleImport = () => {
    if (!isBalanced) {
      toast({
        title: "Error de balance",
        description: "Los débitos y créditos deben ser iguales para importar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      localStorage.setItem("saldos_iniciales_data", JSON.stringify(previewData));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${previewData.length} saldos iniciales`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Plantilla descargada",
      description: "Se ha descargado la plantilla de Saldos Iniciales en formato Excel",
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
          <DollarSign className="h-5 w-5" />
          Importar Saldos Iniciales
        </CardTitle>
        <CardDescription>
          Importe el balance de apertura para iniciar la contabilidad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Los saldos iniciales deben estar balanceados. El total de débitos debe ser igual al total de créditos.
          </AlertDescription>
        </Alert>

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
            <DollarSign className="h-5 w-5 text-primary" />
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
                    <TableHead>Cuenta</TableHead>
                    <TableHead className="text-right">Débito</TableHead>
                    <TableHead className="text-right">Crédito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{item.codigoCuenta}</TableCell>
                      <TableCell>{item.nombreCuenta}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.debito > 0 ? formatCurrency(item.debito) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.credito > 0 ? formatCurrency(item.credito) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={2}>TOTALES</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalDebitos)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalCreditos)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={isBalanced ? "default" : "destructive"}>
                  {isBalanced ? "✓ Balanceado" : "✗ Desbalanceado"}
                </Badge>
                {!isBalanced && (
                  <span className="text-sm text-destructive">
                    Diferencia: {formatCurrency(Math.abs(totalDebitos - totalCreditos))}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearData}>
                  Cancelar
                </Button>
                <Button onClick={handleImport} disabled={isProcessing || !isBalanced}>
                  {isProcessing ? (
                    "Procesando..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Saldos
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
