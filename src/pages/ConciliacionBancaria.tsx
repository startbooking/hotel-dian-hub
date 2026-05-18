import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Landmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Movimiento {
  id: string;
  fecha: string;
  descripcion: string;
  documento: string;
  debito: number;
  credito: number;
  conciliado: boolean;
  origen: "banco" | "libros";
}

const BANCOS = [
  { id: "1", codigo: "001", nombre: "Bancolombia" },
  { id: "2", codigo: "002", nombre: "Davivienda" },
  { id: "3", codigo: "003", nombre: "BBVA" },
  { id: "4", codigo: "004", nombre: "Banco de Bogotá" },
  { id: "5", codigo: "005", nombre: "Banco Popular" },
];

const MOCK_LIBROS: Movimiento[] = [
  { id: "L1", fecha: "2026-05-02", descripcion: "Consignación cliente Hotel Plaza", documento: "RC-1024", debito: 2500000, credito: 0, conciliado: false, origen: "libros" },
  { id: "L2", fecha: "2026-05-05", descripcion: "Pago proveedor suministros", documento: "CE-0451", debito: 0, credito: 850000, conciliado: false, origen: "libros" },
  { id: "L3", fecha: "2026-05-08", descripcion: "Nómina quincenal", documento: "CE-0452", debito: 0, credito: 4200000, conciliado: false, origen: "libros" },
  { id: "L4", fecha: "2026-05-10", descripcion: "Consignación efectivo caja", documento: "RC-1025", debito: 1800000, credito: 0, conciliado: false, origen: "libros" },
  { id: "L5", fecha: "2026-05-12", descripcion: "Pago servicios públicos", documento: "CE-0453", debito: 0, credito: 320000, conciliado: false, origen: "libros" },
  { id: "L6", fecha: "2026-05-15", descripcion: "Transferencia cliente corporativo", documento: "RC-1026", debito: 5600000, credito: 0, conciliado: false, origen: "libros" },
];

const MOCK_BANCO: Movimiento[] = [
  { id: "B1", fecha: "2026-05-02", descripcion: "ABONO TRANSFERENCIA 1024", documento: "T-9981", debito: 2500000, credito: 0, conciliado: false, origen: "banco" },
  { id: "B2", fecha: "2026-05-06", descripcion: "PAGO PROVEEDOR PSE 0451", documento: "P-7720", debito: 0, credito: 850000, conciliado: false, origen: "banco" },
  { id: "B3", fecha: "2026-05-08", descripcion: "DISPERSION NOMINA", documento: "N-3301", debito: 0, credito: 4200000, conciliado: false, origen: "banco" },
  { id: "B4", fecha: "2026-05-11", descripcion: "CONSIGNACION CAJERO", documento: "C-5512", debito: 1800000, credito: 0, conciliado: false, origen: "banco" },
  { id: "B5", fecha: "2026-05-15", descripcion: "ABONO TRANS CORP 1026", documento: "T-9990", debito: 5600000, credito: 0, conciliado: false, origen: "banco" },
  { id: "B6", fecha: "2026-05-16", descripcion: "GMF 4x1000", documento: "GMF-051", debito: 0, credito: 22400, conciliado: false, origen: "banco" },
  { id: "B7", fecha: "2026-05-17", descripcion: "CUOTA MANEJO", documento: "CM-051", debito: 0, credito: 18500, conciliado: false, origen: "banco" },
];

const fmt = (n: number) => n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function ConciliacionBancaria() {
  const [banco, setBanco] = useState<string>("");
  const [fechaCorte, setFechaCorte] = useState<string>("2026-05-31");
  const [saldoInicial, setSaldoInicial] = useState<number>(10000000);
  const [libros, setLibros] = useState<Movimiento[]>([]);
  const [movBanco, setMovBanco] = useState<Movimiento[]>([]);
  const [cargado, setCargado] = useState(false);

  const cargar = () => {
    if (!banco) {
      toast({ title: "Selecciona un banco", variant: "destructive" });
      return;
    }
    setLibros(MOCK_LIBROS.map((m) => ({ ...m })));
    setMovBanco([]);
    setCargado(true);
    toast({ title: "Libros cargados", description: "Movimientos contables del periodo cargados." });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMovBanco(MOCK_BANCO.map((m) => ({ ...m })));
    toast({ title: "Extracto importado", description: `${f.name} procesado: ${MOCK_BANCO.length} movimientos.` });
  };

  const cargarManual = () => {
    setMovBanco(MOCK_BANCO.map((m) => ({ ...m })));
    toast({ title: "Movimientos bancarios cargados", description: "Modo manual." });
  };

  const conciliarAutomatico = () => {
    const nLibros = [...libros];
    const nBanco = [...movBanco];
    let match = 0;
    nLibros.forEach((l) => {
      if (l.conciliado) return;
      const idx = nBanco.findIndex(
        (b) => !b.conciliado && b.debito === l.debito && b.credito === l.credito,
      );
      if (idx >= 0) {
        l.conciliado = true;
        nBanco[idx].conciliado = true;
        match++;
      }
    });
    setLibros(nLibros);
    setMovBanco(nBanco);
    toast({ title: "Conciliación automática", description: `${match} partidas conciliadas.` });
  };

  const toggle = (origen: "libros" | "banco", id: string) => {
    if (origen === "libros") setLibros((p) => p.map((m) => (m.id === id ? { ...m, conciliado: !m.conciliado } : m)));
    else setMovBanco((p) => p.map((m) => (m.id === id ? { ...m, conciliado: !m.conciliado } : m)));
  };

  const totales = useMemo(() => {
    const sumLib = libros.reduce((a, m) => a + m.debito - m.credito, 0);
    const sumBan = movBanco.reduce((a, m) => a + m.debito - m.credito, 0);
    const saldoLibros = saldoInicial + sumLib;
    const saldoBanco = saldoInicial + sumBan;
    const pendLib = libros.filter((m) => !m.conciliado);
    const pendBan = movBanco.filter((m) => !m.conciliado);
    return {
      saldoLibros,
      saldoBanco,
      diferencia: saldoBanco - saldoLibros,
      pendLib: pendLib.reduce((a, m) => a + m.debito - m.credito, 0),
      pendBan: pendBan.reduce((a, m) => a + m.debito - m.credito, 0),
      countLib: pendLib.length,
      countBan: pendBan.length,
    };
  }, [libros, movBanco, saldoInicial]);

  const renderTabla = (data: Movimiento[], origen: "libros" | "banco") => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Débito</TableHead>
            <TableHead className="text-right">Crédito</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                Sin movimientos cargados
              </TableCell>
            </TableRow>
          ) : (
            data.map((m) => (
              <TableRow key={m.id} className={m.conciliado ? "bg-muted/40" : ""}>
                <TableCell>
                  <Checkbox checked={m.conciliado} onCheckedChange={() => toggle(origen, m.id)} />
                </TableCell>
                <TableCell>{m.fecha}</TableCell>
                <TableCell className="font-mono text-xs">{m.documento}</TableCell>
                <TableCell>{m.descripcion}</TableCell>
                <TableCell className="text-right">{m.debito > 0 ? fmt(m.debito) : "-"}</TableCell>
                <TableCell className="text-right">{m.credito > 0 ? fmt(m.credito) : "-"}</TableCell>
                <TableCell>
                  {m.conciliado ? (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Conciliado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <AlertCircle className="h-3 w-3" /> Pendiente
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conciliación Bancaria</h1>
        <p className="text-muted-foreground">Concilia los movimientos del extracto bancario con los libros contables.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" /> Configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Banco</Label>
            <Select value={banco} onValueChange={setBanco}>
              <SelectTrigger><SelectValue placeholder="Seleccione banco" /></SelectTrigger>
              <SelectContent>
                {BANCOS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.codigo} - {b.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fecha de corte</Label>
            <Input type="date" value={fechaCorte} onChange={(e) => setFechaCorte(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Saldo inicial</Label>
            <Input type="number" value={saldoInicial} onChange={(e) => setSaldoInicial(Number(e.target.value))} />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={cargar}>Cargar libros</Button>
          </div>
        </CardContent>
      </Card>

      {cargado && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Origen del extracto</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="archivo">
                <TabsList>
                  <TabsTrigger value="archivo"><Upload className="h-4 w-4 mr-2" /> Importar archivo</TabsTrigger>
                  <TabsTrigger value="manual"><FileSpreadsheet className="h-4 w-4 mr-2" /> Manual</TabsTrigger>
                </TabsList>
                <TabsContent value="archivo" className="space-y-3">
                  <p className="text-sm text-muted-foreground">Sube el extracto bancario en CSV, XLSX o TXT.</p>
                  <Input type="file" accept=".csv,.xlsx,.xls,.txt" onChange={onFile} />
                </TabsContent>
                <TabsContent value="manual" className="space-y-3">
                  <p className="text-sm text-muted-foreground">Carga los movimientos manualmente o desde plantilla.</p>
                  <Button variant="outline" onClick={cargarManual}>Cargar movimientos de prueba</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Saldo libros</CardTitle></CardHeader><CardContent className="text-xl font-bold">{fmt(totales.saldoLibros)}</CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Saldo banco</CardTitle></CardHeader><CardContent className="text-xl font-bold">{fmt(totales.saldoBanco)}</CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Diferencia</CardTitle></CardHeader><CardContent className={`text-xl font-bold ${totales.diferencia === 0 ? "text-green-600" : "text-destructive"}`}>{fmt(totales.diferencia)}</CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pendientes</CardTitle></CardHeader><CardContent className="text-xl font-bold">{totales.countLib + totales.countBan}</CardContent></Card>
          </div>

          <div className="flex gap-2">
            <Button onClick={conciliarAutomatico}>Conciliar automáticamente</Button>
            <Button variant="outline" onClick={() => toast({ title: "Conciliación guardada" })}>Guardar conciliación</Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Movimientos en libros</CardTitle></CardHeader>
              <CardContent>{renderTabla(libros, "libros")}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Movimientos del banco</CardTitle></CardHeader>
              <CardContent>{renderTabla(movBanco, "banco")}</CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
