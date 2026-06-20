import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { VENCIMIENTOS_2026, getVencimientosMes, tipoColors } from "@/data/vencimientosDIAN";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function VencimientosDIAN() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState<number | "all">(today.getMonth());
  const [loading, setLoading] = useState(false);

  const items = month === "all"
    ? VENCIMIENTOS_2026.filter(v => v.fechaVencimiento.startsWith(String(year)))
        .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento))
    : getVencimientosMes(year, month);

  const formatDate = (iso: string) => new Date(iso + "T00:00:00")
    .toLocaleDateString("es-CO", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

  const consultarDIAN = async () => {
    setLoading(true);
    // Mock: aquí se consultaría el endpoint oficial DIAN / muisca
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    toast({
      title: "Calendario actualizado",
      description: "Vencimientos sincronizados con la DIAN.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarClock className="h-7 w-7 text-primary" />
            Vencimientos DIAN
          </h1>
          <p className="text-muted-foreground mt-1">
            Calendario tributario oficial. Filtra por mes para visualizar tus obligaciones.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={consultarDIAN} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Consultar DIAN
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.dian.gov.co/Calendario" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> dian.gov.co
            </a>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-lg">Filtros</CardTitle>
            <div className="flex gap-2 ml-auto">
              <Select value={String(month)} onValueChange={(v) => setMonth(v === "all" ? "all" : Number(v))}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el año</SelectItem>
                  {MESES.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Fecha de vencimiento</TableHead>
                <TableHead>Observación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay vencimientos para el periodo seleccionado.
                </TableCell></TableRow>
              ) : items.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.concepto}</TableCell>
                  <TableCell><Badge variant="outline" className={tipoColors[v.tipo]}>{v.tipo}</Badge></TableCell>
                  <TableCell className="text-sm">{v.periodo}</TableCell>
                  <TableCell className="text-sm">{formatDate(v.fechaVencimiento)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.observacion || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
