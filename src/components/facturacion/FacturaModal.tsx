import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer, Download, Mail } from "lucide-react";

export interface FacturaItem {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  iva: number;
  total: number;
}

export interface FacturaData {
  id: string;
  tipo: "factura" | "nota_credito" | "nota_debito";
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  cliente: {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
  };
  items: FacturaItem[];
  subtotal: number;
  iva: number;
  total: number;
  estado: "pendiente" | "pagada" | "anulada";
  observaciones?: string;
}

interface FacturaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factura: FacturaData | null;
}

export function FacturaModal({ open, onOpenChange, factura }: FacturaModalProps) {
  if (!factura) return null;

  const getTipoLabel = (tipo: FacturaData["tipo"]) => {
    switch (tipo) {
      case "factura":
        return "Factura Electrónica";
      case "nota_credito":
        return "Nota Crédito";
      case "nota_debito":
        return "Nota Débito";
    }
  };

  const getEstadoBadge = (estado: FacturaData["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "pagada":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Pagada</Badge>;
      case "anulada":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Anulada</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {getTipoLabel(factura.tipo)} N° {factura.numero}
            </DialogTitle>
            {getEstadoBadge(factura.estado)}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del documento */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha de emisión</p>
              <p className="font-medium">{factura.fecha}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha de vencimiento</p>
              <p className="font-medium">{factura.fechaVencimiento}</p>
            </div>
          </div>

          <Separator />

          {/* Información del cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Datos del Cliente</h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Razón Social</p>
                <p className="font-medium">{factura.cliente.nombre}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">NIT/CC</p>
                <p className="font-medium">{factura.cliente.nit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{factura.cliente.direccion}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{factura.cliente.telefono}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{factura.cliente.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalle de items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Detalle</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Código</th>
                    <th className="text-left p-3 text-sm font-medium">Descripción</th>
                    <th className="text-center p-3 text-sm font-medium">Cant.</th>
                    <th className="text-right p-3 text-sm font-medium">Valor Unit.</th>
                    <th className="text-right p-3 text-sm font-medium">IVA</th>
                    <th className="text-right p-3 text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3 text-sm">{item.codigo}</td>
                      <td className="p-3 text-sm">{item.descripcion}</td>
                      <td className="p-3 text-sm text-center">{item.cantidad}</td>
                      <td className="p-3 text-sm text-right">
                        ${item.valorUnitario.toLocaleString("es-CO")}
                      </td>
                      <td className="p-3 text-sm text-right">
                        ${item.iva.toLocaleString("es-CO")}
                      </td>
                      <td className="p-3 text-sm text-right font-medium">
                        ${item.total.toLocaleString("es-CO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${factura.subtotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA:</span>
                <span className="font-medium">${factura.iva.toLocaleString("es-CO")}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-primary">${factura.total.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {factura.observaciones && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Observaciones</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {factura.observaciones}
                </p>
              </div>
            </>
          )}

          {/* Acciones */}
          <Separator />
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Enviar por Email
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
