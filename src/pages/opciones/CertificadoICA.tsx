import { Badge } from "@/components/ui/badge";
import { CertificadoBase, ColumnDef } from "@/components/certificados/CertificadoBase";
import { mockICA, MovICA } from "@/components/certificados/mockData";

const columnas: ColumnDef<MovICA>[] = [
  { key: "tercero", label: "Tercero" },
  { key: "identificacion", label: "NIT" },
  { key: "municipio", label: "Municipio" },
  { key: "actividad", label: "Actividad" },
  { key: "fecha", label: "Fecha", render: (r) => <Badge variant="secondary">{r.fecha}</Badge> },
  { key: "ingresos", label: "Ingresos", align: "right", render: (r) => `$${r.ingresos.toLocaleString("es-CO")}` },
  { key: "tarifa", label: "Tarifa (‰)", align: "right", render: (r) => `${r.tarifa}‰` },
  { key: "impuesto", label: "Impuesto", align: "right", render: (r) => <span className="font-semibold">${r.impuesto.toLocaleString("es-CO")}</span> },
];

export default function CertificadoICA() {
  return (
    <CertificadoBase
      titulo="Certificado de ICA"
      descripcion="Generar certificados de Industria y Comercio para terceros activos con movimientos"
      movimientos={mockICA}
      columnas={columnas}
      totalLabel="Total ICA"
      calcularTotal={(rows) => rows.reduce((s, r) => s + r.impuesto, 0)}
      tipoPeriodo="bimestre"
    />
  );
}
