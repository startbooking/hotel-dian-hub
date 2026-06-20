// Mock data de vencimientos DIAN 2026 (calendario tributario simplificado)
// Fuente: Calendario Tributario DIAN - Decreto reglamentario anual
export interface VencimientoDIAN {
  id: string;
  concepto: string;
  tipo: "IVA" | "Retefuente" | "Renta" | "ICA" | "Nomina" | "Info Exógena" | "Otro";
  periodo: string;
  fechaVencimiento: string; // ISO YYYY-MM-DD
  ultimoDigitoNIT?: string;
  observacion?: string;
}

// Generador de vencimientos mensuales típicos
const buildMonth = (year: number, month: number): VencimientoDIAN[] => {
  const mm = String(month + 1).padStart(2, "0");
  const periodoIVA =
    month % 2 === 0
      ? `Bimestre ${Math.floor(month / 2) + 1}/${year}`
      : `Mes ${mm}/${year}`;
  return [
    {
      id: `iva-${year}-${mm}`,
      concepto: "Declaración y pago de IVA",
      tipo: "IVA",
      periodo: periodoIVA,
      fechaVencimiento: `${year}-${mm}-${month % 2 === 0 ? "12" : "18"}`,
      observacion: "Bimestral / Cuatrimestral según ingresos UVT",
    },
    {
      id: `rf-${year}-${mm}`,
      concepto: "Retención en la fuente",
      tipo: "Retefuente",
      periodo: `Mes ${mm}/${year}`,
      fechaVencimiento: `${year}-${mm}-09`,
      observacion: "Según último dígito del NIT (8 al 22)",
    },
    {
      id: `ica-${year}-${mm}`,
      concepto: "Reteica y autoretenciones ICA",
      tipo: "ICA",
      periodo: `Mes ${mm}/${year}`,
      fechaVencimiento: `${year}-${mm}-15`,
      observacion: "Declaración municipal mensual / bimestral",
    },
    {
      id: `pila-${year}-${mm}`,
      concepto: "Pago seguridad social (PILA) y nómina electrónica",
      tipo: "Nomina",
      periodo: `Mes ${mm}/${year}`,
      fechaVencimiento: `${year}-${mm}-10`,
      observacion: "Soporte de nómina electrónica DIAN hasta el día 10 hábil",
    },
  ];
};

export const VENCIMIENTOS_2026: VencimientoDIAN[] = Array.from(
  { length: 12 },
  (_, m) => buildMonth(2026, m)
).flat().concat([
  // Renta personas jurídicas - cuotas
  {
    id: "renta-pj-c1",
    concepto: "Renta personas jurídicas - 1ª cuota",
    tipo: "Renta",
    periodo: "Año gravable 2025",
    fechaVencimiento: "2026-04-08",
    observacion: "Grandes contribuyentes",
  },
  {
    id: "renta-pj-c2",
    concepto: "Renta personas jurídicas - 2ª cuota",
    tipo: "Renta",
    periodo: "Año gravable 2025",
    fechaVencimiento: "2026-05-12",
  },
  {
    id: "renta-pn",
    concepto: "Renta personas naturales",
    tipo: "Renta",
    periodo: "Año gravable 2025",
    fechaVencimiento: "2026-08-13",
    observacion: "Según últimos 2 dígitos del NIT",
  },
  {
    id: "exogena",
    concepto: "Información Exógena",
    tipo: "Info Exógena",
    periodo: "Año gravable 2025",
    fechaVencimiento: "2026-05-21",
    observacion: "Personas jurídicas",
  },
]);

export const getVencimientosMes = (
  year: number,
  month: number
): VencimientoDIAN[] => {
  return VENCIMIENTOS_2026.filter((v) => {
    const d = new Date(v.fechaVencimiento + "T00:00:00");
    return d.getFullYear() === year && d.getMonth() === month;
  }).sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));
};

export const tipoColors: Record<VencimientoDIAN["tipo"], string> = {
  IVA: "bg-blue-500/10 text-blue-700 border-blue-300",
  Retefuente: "bg-purple-500/10 text-purple-700 border-purple-300",
  Renta: "bg-amber-500/10 text-amber-700 border-amber-300",
  ICA: "bg-emerald-500/10 text-emerald-700 border-emerald-300",
  Nomina: "bg-pink-500/10 text-pink-700 border-pink-300",
  "Info Exógena": "bg-cyan-500/10 text-cyan-700 border-cyan-300",
  Otro: "bg-muted text-muted-foreground",
};
