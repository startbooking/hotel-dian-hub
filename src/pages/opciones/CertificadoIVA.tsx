import { Badge } from "@/components/ui/badge";
import { CertificadoBase, ColumnDef } from "@/components/certificados/CertificadoBase";
import { mockIVA, MovIVA } from "@/components/certificados/mockData";

const columnas: ColumnDef<MovIVA>[] = [
  { key: "tercero", label: "Tercero" },
  { key: "identificacion", label: "NIT" },
  { key: "fecha", label: "Fecha", render: (r) => <Badge variant="secondary">{r.fecha}</Badge> },
  { key: "baseGravable", label: "Base Gravable", align: "right", render: (r) => `$${r.baseGravable.toLocaleString("es-CO")}` },
  { key: "ivaGenerado", label: "IVA Generado", align: "right", render: (r) => `$${r.ivaGenerado.toLocaleString("es-CO")}` },
  { key: "ivaDescontable", label: "IVA Descontable", align: "right", render: (r) => `$${r.ivaDescontable.toLocaleString("es-CO")}` },
  { key: "saldo", label: "Saldo", align: "right", render: (r) => <span className="font-semibold">${r.saldo.toLocaleString("es-CO")}</span> },
];

export default function CertificadoIVA() {
  return (
    <CertificadoBase
      titulo="Certificado de IVA"
      descripcion="Generar certificados de IVA para terceros activos con movimientos"
      movimientos={mockIVA}
      columnas={columnas}
      totalLabel="Saldo total IVA"
      calcularTotal={(rows) => rows.reduce((s, r) => s + r.saldo, 0)}
      tipoPeriodo="bimestre"
    />
  );
}
