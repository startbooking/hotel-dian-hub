import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Printer, FileDown, Search, Info, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Nota {
  numero: string;
  titulo: string;
  norma: string;
  contenido: string;
}

const notas: Nota[] = [
  {
    numero: "1",
    titulo: "Entidad que reporta",
    norma: "NIC 1.51",
    contenido: "La entidad es una sociedad hotelera constituida en Colombia, domiciliada en la ciudad de Bogotá. Su actividad principal es la prestación de servicios de alojamiento, restaurante y eventos. Los estados financieros han sido preparados bajo Normas Internacionales de Información Financiera (NIIF) plenas emitidas por el IASB."
  },
  {
    numero: "2",
    titulo: "Bases de preparación",
    norma: "NIC 1.16",
    contenido: "Los estados financieros se preparan de conformidad con las NIIF emitidas por el IASB, adoptadas en Colombia mediante la Ley 1314 de 2009 y decretos reglamentarios. La moneda funcional y de presentación es el peso colombiano (COP). Se utiliza el costo histórico como base de medición, excepto para instrumentos financieros medidos a valor razonable."
  },
  {
    numero: "3",
    titulo: "Políticas contables significativas",
    norma: "NIC 8",
    contenido: "Las políticas contables aplicadas son consistentes con las del período anterior. Se incluyen políticas de reconocimiento de ingresos (NIIF 15), instrumentos financieros (NIIF 9), arrendamientos (NIIF 16), propiedades, planta y equipo (NIC 16), intangibles (NIC 38), deterioro (NIC 36), provisiones (NIC 37) y beneficios a empleados (NIC 19)."
  },
  {
    numero: "4",
    titulo: "Reconocimiento de ingresos",
    norma: "NIIF 15",
    contenido: "Los ingresos se reconocen cuando se transfiere el control del servicio al cliente. Los servicios de hospedaje se reconocen a lo largo del tiempo (durante la estadía). Los servicios de restaurante se reconocen en el punto de transferencia. Se aplica el modelo de cinco pasos de NIIF 15 para identificar obligaciones de desempeño separadas."
  },
  {
    numero: "5",
    titulo: "Propiedades, planta y equipo",
    norma: "NIC 16",
    contenido: "Se reconocen al costo menos depreciación acumulada y pérdidas por deterioro. La depreciación se calcula por el método de línea recta sobre la vida útil estimada: Edificios 40 años, Maquinaria y equipo 10 años, Muebles y enseres 10 años, Equipo de cómputo 5 años, Vehículos 5 años."
  },
  {
    numero: "6",
    titulo: "Arrendamientos",
    norma: "NIIF 16",
    contenido: "La entidad reconoce activos por derecho de uso y pasivos por arrendamiento para todos los arrendamientos con plazo mayor a 12 meses. Los activos por derecho de uso se deprecian linealmente durante el plazo del arrendamiento. Los pagos de arrendamientos se separan en componente de capital e interés."
  },
  {
    numero: "7",
    titulo: "Instrumentos financieros",
    norma: "NIIF 9",
    contenido: "Los activos financieros se clasifican al costo amortizado o a valor razonable. Las cuentas por cobrar comerciales se miden al costo amortizado usando el método de interés efectivo. Se aplica el modelo de pérdida crediticia esperada (ECL) para provisión de deterioro. Las obligaciones financieras se miden al costo amortizado."
  },
  {
    numero: "8",
    titulo: "Beneficios a empleados",
    norma: "NIC 19",
    contenido: "Los beneficios a corto plazo (salarios, vacaciones, primas) se reconocen como gasto cuando se presta el servicio. Los beneficios post-empleo incluyen cesantías e intereses de cesantías. Se reconocen provisiones para obligaciones legales según la legislación laboral colombiana."
  },
  {
    numero: "9",
    titulo: "Impuesto a las ganancias",
    norma: "NIC 12",
    contenido: "El gasto por impuesto comprende el impuesto corriente y el impuesto diferido. El impuesto diferido se reconoce sobre diferencias temporarias entre las bases fiscales y contables. Los activos por impuesto diferido se reconocen cuando es probable que existan ganancias futuras gravables suficientes."
  },
  {
    numero: "10",
    titulo: "Provisiones y contingencias",
    norma: "NIC 37",
    contenido: "Las provisiones se reconocen cuando existe una obligación presente legal o implícita, es probable la salida de recursos y la cuantía puede estimarse fiablemente. Los pasivos contingentes se revelan pero no se reconocen. Los activos contingentes no se reconocen pero se revelan cuando es probable la entrada de beneficios."
  },
];

export default function NotasEstadosFinancieros() {
  const [anio, setAnio] = useState("2024");
  const [generado, setGenerado] = useState(false);
  const [notasAbiertas, setNotasAbiertas] = useState<Record<string, boolean>>({});

  const handleGenerar = () => {
    setGenerado(true);
    toast.success("Notas a los Estados Financieros generadas");
  };

  const toggleNota = (numero: string) => {
    setNotasAbiertas(prev => ({ ...prev, [numero]: !prev[numero] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notas a los Estados Financieros</h1>
          <p className="text-muted-foreground">NIC 1.112 — Revelaciones y políticas contables</p>
        </div>
        <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">NIIF / IFRS</Badge>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Proporcionan información adicional sobre partidas de los estados financieros, políticas contables significativas y juicios clave de la administración (NIC 1.112-138).
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle>Período</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <Select value={anio} onValueChange={setAnio}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerar}><Search className="mr-2 h-4 w-4" />Generar</Button>
          </div>
        </CardContent>
      </Card>

      {generado && (
        <div className="space-y-3">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
            <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar</Button>
          </div>
          {notas.map((nota) => (
            <Collapsible key={nota.numero} open={notasAbiertas[nota.numero]} onOpenChange={() => toggleNota(nota.numero)}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">{nota.numero}</Badge>
                        <CardTitle className="text-base">{nota.titulo}</CardTitle>
                        <Badge className="bg-primary/10 text-primary text-[10px]">{nota.norma}</Badge>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${notasAbiertas[nota.numero] ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{nota.contenido}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
