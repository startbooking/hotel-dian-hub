import CatalogoCRUD from "./CatalogoCRUD";

const data = [
  { id: "1", codigo: "EPS001", nombre: "Sura", descripcion: "EPS Sura" },
  { id: "2", codigo: "EPS002", nombre: "Nueva EPS", descripcion: "Nueva EPS S.A." },
  { id: "3", codigo: "EPS003", nombre: "Sanitas", descripcion: "EPS Sanitas" },
  { id: "4", codigo: "EPS004", nombre: "Compensar", descripcion: "EPS Compensar" },
  { id: "5", codigo: "EPS005", nombre: "Salud Total", descripcion: "EPS Salud Total" },
  { id: "6", codigo: "EPS006", nombre: "Coomeva", descripcion: "EPS Coomeva" },
  { id: "7", codigo: "EPS007", nombre: "Famisanar", descripcion: "EPS Famisanar" },
];

export default function EPSPage() {
  return <CatalogoCRUD title="EPS" subtitle="Administración de Entidades Promotoras de Salud" initialData={data} />;
}
