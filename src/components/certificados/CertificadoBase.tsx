import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Printer, Download, Users } from "lucide-react";
import { toast } from "sonner";

export interface CertificadoMovimiento {
  id: string;
  terceroId: string;
  tercero: string;
  identificacion: string;
  fecha: string; // ISO yyyy-mm-dd
  [k: string]: any;
}

export interface ColumnDef<T> {
  key: string;
  label: string;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends CertificadoMovimiento> {
  titulo: string;
  descripcion: string;
  movimientos: T[];
  columnas: ColumnDef<T>[];
  totalLabel: string;
  calcularTotal: (rows: T[]) => number;
  tipoPeriodo?: "bimestre" | "anual";
}

const anioActual = new Date().getFullYear();
const aniosDisponibles = [anioActual - 2, anioActual - 1, anioActual];

const BIMESTRES = [
  { value: "todos", label: "Año completo" },
  { value: "1", label: "Bimestre 1 (Ene-Feb)" },
  { value: "2", label: "Bimestre 2 (Mar-Abr)" },
  { value: "3", label: "Bimestre 3 (May-Jun)" },
  { value: "4", label: "Bimestre 4 (Jul-Ago)" },
  { value: "5", label: "Bimestre 5 (Sep-Oct)" },
  { value: "6", label: "Bimestre 6 (Nov-Dic)" },
];

const TRIMESTRES = [
  { value: "todos", label: "Año completo" },
  { value: "T1", label: "Trimestre 1 (Ene-Mar)" },
  { value: "T2", label: "Trimestre 2 (Abr-Jun)" },
  { value: "T3", label: "Trimestre 3 (Jul-Sep)" },
  { value: "T4", label: "Trimestre 4 (Oct-Dic)" },
];

function getBimestreFromFecha(fecha: string): string {
  const mes = new Date(fecha).getMonth() + 1;
  return Math.ceil(mes / 2).toString();
}

export function CertificadoBase<T extends CertificadoMovimiento>({
  titulo,
  descripcion,
  movimientos,
  columnas,
  totalLabel,
  calcularTotal,
  tipoPeriodo = "bimestre",
}: Props<T>) {
  const [anio, setAnio] = useState((anioActual - 1).toString());
  const [periodo, setPeriodo] = useState("todos");
  const [identificacion, setIdentificacion] = useState("");
  const [resultados, setResultados] = useState<T[]>([]);
  const [buscado, setBuscado] = useState(false);

  const periodosOpts = tipoPeriodo === "bimestre" ? BIMESTRES : TRIMESTRES;

  // Terceros activos con movimientos en el año seleccionado
  const tercerosActivos = useMemo(() => {
    const map = new Map<string, { id: string; nombre: string; nit: string; count: number }>();
    movimientos
      .filter((m) => new Date(m.fecha).getFullYear().toString() === anio)
      .forEach((m) => {
        const prev = map.get(m.terceroId);
        map.set(m.terceroId, {
          id: m.terceroId,
          nombre: m.tercero,
          nit: m.identificacion,
          count: (prev?.count ?? 0) + 1,
        });
      });
    return Array.from(map.values());
  }, [movimientos, anio]);

  const filtrarPorPeriodo = (rows: T[]) => {
    let r = rows.filter((m) => new Date(m.fecha).getFullYear().toString() === anio);
    if (periodo !== "todos") {
      if (tipoPeriodo === "bimestre") {
        r = r.filter((m) => getBimestreFromFecha(m.fecha) === periodo);
      } else {
        const trimestre = parseInt(periodo.replace("T", ""));
        r = r.filter((m) => {
          const mes = new Date(m.fecha).getMonth() + 1;
          return Math.ceil(mes / 3) === trimestre;
        });
      }
    }
    return r;
  };

  const handleBuscar = () => {
    let r = filtrarPorPeriodo(movimientos);
    if (identificacion.trim()) {
      r = r.filter((m) => m.identificacion.includes(identificacion.trim()));
    }
    setResultados(r);
    setBuscado(true);
    if (r.length === 0) toast.warning("No se encontraron movimientos en el período");
    else toast.success(`Se generaron ${r.length} registro(s)`);
  };

  const handleGenerarTodos = () => {
    const r = filtrarPorPeriodo(movimientos);
    setResultados(r);
    setBuscado(true);
    toast.success(`Certificados generados para ${tercerosActivos.length} tercero(s) activo(s)`);
  };

  const total = calcularTotal(resultados);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          {titulo}
        </h1>
        <p className="text-muted-foreground mt-1">{descripcion}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Período del Certificado</CardTitle>
          <CardDescription>
            Seleccione año y período. Solo se incluyen terceros activos con movimientos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label>Año gravable</Label>
              <Select value={anio} onValueChange={setAnio}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {aniosDisponibles.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {periodosOpts.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>NIT / Cédula (opcional)</Label>
              <Input placeholder="Filtrar tercero" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} />
            </div>
            <Button onClick={handleBuscar} className="gap-2"><Search className="h-4 w-4" /> Buscar</Button>
            <Button onClick={handleGenerarTodos} variant="outline" className="gap-2">
              <Users className="h-4 w-4" /> Generar a todos ({tercerosActivos.length})
            </Button>
          </div>
          {tercerosActivos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tercerosActivos.map((t) => (
                <Badge key={t.id} variant="secondary" className="text-xs">
                  {t.nombre} <span className="ml-1 opacity-70">({t.count} mov.)</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {buscado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados ({resultados.length})</CardTitle>
                <CardDescription>{totalLabel}: ${total.toLocaleString("es-CO")}</CardDescription>
              </div>
              {resultados.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" /> Imprimir
                  </Button>
                  <Button size="sm" className="gap-1" onClick={() => toast.success("Exportando PDF...")}>
                    <Download className="h-4 w-4" /> Exportar PDF
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {columnas.map((c) => (
                    <TableHead key={c.key} className={c.align === "right" ? "text-right" : ""}>
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((r) => (
                  <TableRow key={r.id}>
                    {columnas.map((c) => (
                      <TableCell key={c.key} className={c.align === "right" ? "text-right" : ""}>
                        {c.render ? c.render(r) : (r as any)[c.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {resultados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columnas.length} className="text-center text-muted-foreground py-8">
                      No se encontraron movimientos en este período
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
