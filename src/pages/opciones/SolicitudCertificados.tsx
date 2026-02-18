import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, CheckCircle2, Search, Users } from "lucide-react";
import { toast } from "sonner";

interface Empresa {
  id: string;
  razonSocial: string;
  nit: string;
  email: string;
  contacto: string;
  tipoRetencion: ("renta" | "iva" | "ica")[];
}

const mockEmpresas: Empresa[] = [
  { id: "1", razonSocial: "Distribuidora Nacional S.A.S.", nit: "900123456-1", email: "contabilidad@disnacional.com", contacto: "María García", tipoRetencion: ["renta", "iva"] },
  { id: "2", razonSocial: "Servicios Logísticos del Valle Ltda.", nit: "800987654-3", email: "tributario@slvalle.com", contacto: "Carlos Pérez", tipoRetencion: ["renta", "ica"] },
  { id: "3", razonSocial: "Comercializadora Andina S.A.", nit: "901234567-8", email: "fiscal@comerciandina.com", contacto: "Ana Rodríguez", tipoRetencion: ["renta", "iva", "ica"] },
  { id: "4", razonSocial: "Inversiones del Pacífico S.A.S.", nit: "890456123-5", email: "contabilidad@invpacifico.com", contacto: "Pedro Martínez", tipoRetencion: ["renta"] },
  { id: "5", razonSocial: "Tecnología Avanzada Ltda.", nit: "860789012-2", email: "impuestos@tecavanzada.com", contacto: "Laura Sánchez", tipoRetencion: ["renta", "iva", "ica"] },
  { id: "6", razonSocial: "Construcciones Bolívar S.A.", nit: "830654321-7", email: "tributario@constbolivar.com", contacto: "Jorge López", tipoRetencion: ["renta", "ica"] },
];

const anioAnterior = new Date().getFullYear() - 1;

const plantillaDefault = `Cordial saludo,

Por medio de la presente, nos permitimos solicitar amablemente el envío de los certificados tributarios correspondientes al año gravable ${anioAnterior}, necesarios para la elaboración de nuestra declaración de renta y demás obligaciones fiscales.

Los certificados requeridos son:
{certificados_solicitados}

Agradecemos su pronta respuesta y colaboración.

Atentamente,
{nombre_empresa}
NIT: {nit_empresa}`;

export default function SolicitudCertificados() {
  const [busqueda, setBusqueda] = useState("");
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [enviadas, setEnviadas] = useState<string[]>([]);
  const [certificados, setCertificados] = useState({ renta: true, iva: true, ica: true });
  const [asunto, setAsunto] = useState(`Solicitud de certificados tributarios – Año gravable ${anioAnterior}`);
  const [cuerpo, setCuerpo] = useState(plantillaDefault);
  const [nombreEmpresa, setNombreEmpresa] = useState("HotelAccounting S.A.S.");
  const [nitEmpresa, setNitEmpresa] = useState("900000000-1");

  const empresasFiltradas = mockEmpresas.filter(
    (e) =>
      e.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.nit.includes(busqueda)
  );

  const toggleSeleccion = (id: string) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const seleccionarTodas = () => {
    if (seleccionadas.length === empresasFiltradas.length) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(empresasFiltradas.map((e) => e.id));
    }
  };

  const getCertificadosTexto = () => {
    const lista: string[] = [];
    if (certificados.renta) lista.push("- Certificado de Retención en la Fuente");
    if (certificados.iva) lista.push("- Certificado de IVA");
    if (certificados.ica) lista.push("- Certificado de ICA");
    return lista.join("\n");
  };

  const handleEnviar = () => {
    if (seleccionadas.length === 0) {
      toast.error("Seleccione al menos una empresa");
      return;
    }
    if (!certificados.renta && !certificados.iva && !certificados.ica) {
      toast.error("Seleccione al menos un tipo de certificado");
      return;
    }

    setEnviadas((prev) => [...new Set([...prev, ...seleccionadas])]);
    toast.success(`Correo enviado a ${seleccionadas.length} empresa(s) solicitando certificados del año ${anioAnterior}`);
    setSeleccionadas([]);
  };

  const handleEnviarIndividual = (empresa: Empresa) => {
    setEnviadas((prev) => [...new Set([...prev, empresa.id])]);
    toast.success(`Correo enviado a ${empresa.razonSocial}`);
  };

  const todasSeleccionadas = seleccionadas.length === empresasFiltradas.length && empresasFiltradas.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" />
          Solicitud de Certificados Tributarios
        </h1>
        <p className="text-muted-foreground mt-1">
          Envío masivo de correos a empresas solicitando certificados de retenciones, IVA e ICA del año {anioAnterior}
        </p>
      </div>

      {/* Configuración del correo */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Correo</CardTitle>
          <CardDescription>Personalice el asunto y cuerpo del correo a enviar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre de su Empresa</Label>
              <Input value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>NIT de su Empresa</Label>
              <Input value={nitEmpresa} onChange={(e) => setNitEmpresa(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Certificados a solicitar</Label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={certificados.renta} onCheckedChange={(v) => setCertificados((p) => ({ ...p, renta: !!v }))} />
                <span className="text-sm">Retención en la Fuente</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={certificados.iva} onCheckedChange={(v) => setCertificados((p) => ({ ...p, iva: !!v }))} />
                <span className="text-sm">IVA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={certificados.ica} onCheckedChange={(v) => setCertificados((p) => ({ ...p, ica: !!v }))} />
                <span className="text-sm">ICA</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Asunto</Label>
            <Input value={asunto} onChange={(e) => setAsunto(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Cuerpo del correo</Label>
            <Textarea value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} rows={10} />
            <p className="text-xs text-muted-foreground">
              Variables: {"{certificados_solicitados}"}, {"{nombre_empresa}"}, {"{nit_empresa}"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Empresas con Retenciones ({empresasFiltradas.length})
              </CardTitle>
              <CardDescription>Seleccione las empresas a las cuales enviar la solicitud</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por NIT o razón social..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={todasSeleccionadas} onCheckedChange={seleccionarTodas} />
              <span className="text-sm font-medium">Seleccionar todas</span>
            </label>
            <Button onClick={handleEnviar} disabled={seleccionadas.length === 0} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar a {seleccionadas.length} seleccionada(s)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Razón Social</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Retenciones</TableHead>
                  <TableHead className="w-24">Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresasFiltradas.map((empresa) => {
                  const enviado = enviadas.includes(empresa.id);
                  return (
                    <TableRow key={empresa.id}>
                      <TableCell>
                        <Checkbox
                          checked={seleccionadas.includes(empresa.id)}
                          onCheckedChange={() => toggleSeleccion(empresa.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{empresa.razonSocial}</TableCell>
                      <TableCell className="font-mono text-sm">{empresa.nit}</TableCell>
                      <TableCell className="text-sm">{empresa.email}</TableCell>
                      <TableCell className="text-sm">{empresa.contacto}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {empresa.tipoRetencion.map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">
                              {t.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {enviado ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Enviado
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={enviado ? "ghost" : "outline"}
                          onClick={() => handleEnviarIndividual(empresa)}
                          className="gap-1"
                        >
                          <Send className="h-3 w-3" />
                          {enviado ? "Reenviar" : "Enviar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {empresasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No se encontraron empresas con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {enviadas.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
              <strong>{enviadas.length}</strong> correo(s) enviado(s) solicitando certificados del año {anioAnterior}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
