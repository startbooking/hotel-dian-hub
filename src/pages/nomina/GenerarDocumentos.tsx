import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Calendar } from "lucide-react";

interface DocumentoContable {
  id: string;
  tipo: string;
  numero: string;
  fecha: string;
  periodo: string;
  estado: "generado" | "enviado" | "pendiente";
  monto: number;
  descripcion: string;
}

const documentosData: DocumentoContable[] = [
  {
    id: "1",
    tipo: "Comprobante de Nómina",
    numero: "NOM-2025-001",
    fecha: "2025-01-31",
    periodo: "Enero 2025",
    estado: "generado",
    monto: 4661000,
    descripcion: "Nómina mensual - Enero 2025"
  },
  {
    id: "2",
    tipo: "Comprobante de Aportes",
    numero: "AP-2025-001",
    fecha: "2025-01-31",
    periodo: "Enero 2025",
    estado: "enviado",
    monto: 624000,
    descripcion: "Aportes seguridad social y parafiscales"
  },
  {
    id: "3",
    tipo: "Provisión Prestaciones",
    numero: "PROV-2025-001",
    fecha: "2025-01-31",
    periodo: "Enero 2025",
    estado: "generado",
    monto: 1165250,
    descripcion: "Provisión prestaciones sociales"
  }
];

export default function GenerarDocumentos() {
  const [periodo, setPeriodo] = useState<string>("");
  const [tipoDocumento, setTipoDocumento] = useState<string>("");

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      generado: { variant: "default", label: "Generado" },
      enviado: { variant: "secondary", label: "Enviado" },
      pendiente: { variant: "outline", label: "Pendiente" }
    };
    return variants[estado] || variants.pendiente;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentos Contables</h1>
          <p className="text-muted-foreground mt-1">Generación de documentos contables de nómina</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Generar Documento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los períodos</SelectItem>
                  <SelectItem value="01-2025">Enero 2025</SelectItem>
                  <SelectItem value="02-2025">Febrero 2025</SelectItem>
                  <SelectItem value="03-2025">Marzo 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="nomina">Comprobante de Nómina</SelectItem>
                  <SelectItem value="aportes">Comprobante de Aportes</SelectItem>
                  <SelectItem value="provision">Provisión Prestaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{documentosData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Generados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {documentosData.filter(d => d.estado === "generado").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {documentosData.filter(d => d.estado === "enviado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Generados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentosData.map((documento) => {
              const estadoBadge = getEstadoBadge(documento.estado);
              return (
                <Card key={documento.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">{documento.tipo}</h3>
                            <Badge variant={estadoBadge.variant}>{estadoBadge.label}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{documento.descripcion}</p>
                          
                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Número:</span>
                              <span className="font-medium text-foreground">{documento.numero}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{documento.fecha}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Período:</span>
                              <span className="font-medium text-foreground">{documento.periodo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Monto:</span>
                              <span className="font-bold text-foreground">
                                ${documento.monto.toLocaleString('es-CO')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
