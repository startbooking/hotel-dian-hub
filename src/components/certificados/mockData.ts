export interface MovimientoTercero {
  id: string;
  terceroId: string;
  tercero: string;
  identificacion: string;
  fecha: string;
  activo: boolean;
}

export interface MovRetencion extends MovimientoTercero {
  concepto: string;
  base: number;
  porcentaje: number;
  valor: number;
}

export interface MovIVA extends MovimientoTercero {
  baseGravable: number;
  ivaGenerado: number;
  ivaDescontable: number;
  saldo: number;
}

export interface MovICA extends MovimientoTercero {
  municipio: string;
  actividad: string;
  ingresos: number;
  tarifa: number;
  impuesto: number;
}

const anioAnterior = new Date().getFullYear() - 1;
const d = (m: number, day = 15) => `${anioAnterior}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const mockRetenciones: MovRetencion[] = [
  { id: "r1", terceroId: "t1", tercero: "Proveedor ABC S.A.S", identificacion: "900123456", fecha: d(1), activo: true, concepto: "Compras", base: 5000000, porcentaje: 2.5, valor: 125000 },
  { id: "r2", terceroId: "t1", tercero: "Proveedor ABC S.A.S", identificacion: "900123456", fecha: d(3), activo: true, concepto: "Compras", base: 7000000, porcentaje: 2.5, valor: 175000 },
  { id: "r3", terceroId: "t2", tercero: "Servicios XYZ Ltda", identificacion: "800456789", fecha: d(2), activo: true, concepto: "Servicios", base: 3000000, porcentaje: 4, valor: 120000 },
  { id: "r4", terceroId: "t3", tercero: "Consultor Juan Pérez", identificacion: "1020304050", fecha: d(5), activo: true, concepto: "Honorarios", base: 8000000, porcentaje: 11, valor: 880000 },
  { id: "r5", terceroId: "t3", tercero: "Consultor Juan Pérez", identificacion: "1020304050", fecha: d(9), activo: true, concepto: "Honorarios", base: 6000000, porcentaje: 11, valor: 660000 },
  { id: "r6", terceroId: "t4", tercero: "Transportes del Sur", identificacion: "830111222", fecha: d(11), activo: true, concepto: "Transporte", base: 4500000, porcentaje: 1, valor: 45000 },
];

export const mockIVA: MovIVA[] = [
  { id: "i1", terceroId: "t5", tercero: "Hotel Caribe Resort", identificacion: "900111222", fecha: d(2), activo: true, baseGravable: 50000000, ivaGenerado: 9500000, ivaDescontable: 3200000, saldo: 6300000 },
  { id: "i2", terceroId: "t5", tercero: "Hotel Caribe Resort", identificacion: "900111222", fecha: d(4), activo: true, baseGravable: 62000000, ivaGenerado: 11780000, ivaDescontable: 4100000, saldo: 7680000 },
  { id: "i3", terceroId: "t5", tercero: "Hotel Caribe Resort", identificacion: "900111222", fecha: d(8), activo: true, baseGravable: 55000000, ivaGenerado: 10450000, ivaDescontable: 3800000, saldo: 6650000 },
  { id: "i4", terceroId: "t6", tercero: "Restaurante Gourmet SAS", identificacion: "800333444", fecha: d(2), activo: true, baseGravable: 18000000, ivaGenerado: 3420000, ivaDescontable: 1500000, saldo: 1920000 },
  { id: "i5", terceroId: "t6", tercero: "Restaurante Gourmet SAS", identificacion: "800333444", fecha: d(6), activo: true, baseGravable: 22000000, ivaGenerado: 4180000, ivaDescontable: 1700000, saldo: 2480000 },
];

export const mockICA: MovICA[] = [
  { id: "c1", terceroId: "t5", tercero: "Hotel Caribe Resort", identificacion: "900111222", fecha: d(2), activo: true, municipio: "Cartagena", actividad: "Hotelería", ingresos: 120000000, tarifa: 7, impuesto: 840000 },
  { id: "c2", terceroId: "t5", tercero: "Hotel Caribe Resort", identificacion: "900111222", fecha: d(4), activo: true, municipio: "Cartagena", actividad: "Restaurante", ingresos: 45000000, tarifa: 10, impuesto: 450000 },
  { id: "c3", terceroId: "t7", tercero: "Comercial del Norte SAS", identificacion: "800555666", fecha: d(2), activo: true, municipio: "Barranquilla", actividad: "Comercio", ingresos: 80000000, tarifa: 4.14, impuesto: 331200 },
  { id: "c4", terceroId: "t7", tercero: "Comercial del Norte SAS", identificacion: "800555666", fecha: d(7), activo: true, municipio: "Barranquilla", actividad: "Comercio", ingresos: 95000000, tarifa: 4.14, impuesto: 393300 },
];
