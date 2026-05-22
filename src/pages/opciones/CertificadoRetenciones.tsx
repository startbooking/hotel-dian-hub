import { Badge } from "@/components/ui/badge";
import { CertificadoBase, ColumnDef } from "@/components/certificados/CertificadoBase";
import { mockRetenciones, MovRetencion } from "@/components/certificados/mockData";

const columnas: ColumnDef<MovRetencion>[] = [
  { key: "tercero", label: "Tercero" },
  { key: "identificacion", label: "Identificación" },
  { key: "concepto", label: "Concepto" },
  { key: "fecha", label: "Fecha", render: (r) => <Badge variant="secondary">{r.fecha}</Badge> },
  { key: "base", label: "Base", align: "right", render: (r) => `$${r.base.toLocaleString("es-CO")}` },
  { key: "porcentaje", label: "%", align: "right", render: (r) => `${r.porcentaje}%` },
  { key: "valor", label: "Valor Retenido", align: "right", render: (r) => <span className="font-semibold">${r.valor.toLocaleString("es-CO")}</span> },
];

export default function CertificadoRetenciones() {
  return (
    <CertificadoBase
      titulo="Certificado de Retenciones"
      descripcion="Generar certificados de retención en la fuente para terceros activos con movimientos"
      movimientos={mockRetenciones}
      columnas={columnas}
      totalLabel="Total retenido"
      calcularTotal={(rows) => rows.reduce((s, r) => s + r.valor, 0)}
      tipoPeriodo="bimestre"
    />
  );
}
