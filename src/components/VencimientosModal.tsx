import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVencimientosMes, tipoColors } from "@/data/vencimientosDIAN";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function VencimientosModal({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const items = getVencimientosMes(year, month);

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  };

  const daysLeft = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    const ms = d.getTime() - new Date(today.toDateString()).getTime();
    return Math.round(ms / 86400000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Vencimientos DIAN — {MESES[month]} {year}
          </DialogTitle>
          <DialogDescription>
            Calendario tributario del mes actual. Consulta oficial en la DIAN.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay vencimientos registrados para este mes.
            </p>
          )}
          {items.map((v) => {
            const dl = daysLeft(v.fechaVencimiento);
            const urgent = dl >= 0 && dl <= 5;
            const overdue = dl < 0;
            return (
              <div
                key={v.id}
                className={`border rounded-lg p-3 flex items-start justify-between gap-3 ${
                  overdue ? "border-destructive/40 bg-destructive/5" :
                  urgent ? "border-warning/40 bg-warning/5" : "border-border"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={tipoColors[v.tipo]}>{v.tipo}</Badge>
                    <span className="font-medium text-sm">{v.concepto}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{v.periodo}</p>
                  {v.observacion && (
                    <p className="text-xs text-muted-foreground italic mt-0.5">{v.observacion}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatDate(v.fechaVencimiento)}</p>
                  <p className={`text-xs ${overdue ? "text-destructive" : urgent ? "text-warning" : "text-muted-foreground"}`}>
                    {overdue ? `Vencido hace ${Math.abs(dl)}d` : dl === 0 ? "Vence hoy" : `En ${dl} días`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={() => { onOpenChange(false); navigate("/vencimientos-dian"); }}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver calendario completo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
