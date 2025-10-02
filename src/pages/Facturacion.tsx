import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, Factura } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, CheckCircle, Clock, XCircle, Shield } from "lucide-react";

export default function Facturacion() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    setLoading(true);
    const response = await api.getFacturas();
    
    if (response.success && response.data) {
      setFacturas(response.data);
    } else {
      toast({
        title: "Error",
        description: "No se pudieron cargar las facturas",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pagada: { color: "bg-success text-success-foreground", icon: CheckCircle },
      pendiente: { color: "bg-warning text-warning-foreground", icon: Clock },
      anulada: { color: "bg-destructive text-destructive-foreground", icon: XCircle },
    };
    const config = variants[estado as keyof typeof variants];
    const Icon = config?.icon || Clock;
    
    return (
      <Badge className={config?.color}>
        <Icon className="h-3 w-3 mr-1" />
        {estado.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facturación Electrónica</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de facturas con integración DIAN
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded" />
              ))
            ) : (
              facturas.map((factura) => (
                <div
                  key={factura.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold">Factura {factura.numero}</h3>
                      {getEstadoBadge(factura.estado)}
                      {factura.dianAutorizada && (
                        <Badge variant="outline" className="border-primary text-primary">
                          <Shield className="h-3 w-3 mr-1" />
                          DIAN
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {factura.cliente} | {factura.concepto}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fecha: {new Date(factura.fecha).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Subtotal: ${factura.subtotal.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">IVA: ${factura.iva.toLocaleString()}</p>
                      <p className="text-xl font-bold">Total: ${factura.total.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Ver</Button>
                      <Button variant="outline" size="sm">Descargar</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
