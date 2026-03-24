import CatalogoCRUD from "./CatalogoCRUD";

const data = [
  { id: "1", codigo: "ARL001", nombre: "Sura ARL", descripcion: "ARL Sura" },
  { id: "2", codigo: "ARL002", nombre: "Positiva", descripcion: "Positiva Compañía de Seguros" },
  { id: "3", codigo: "ARL003", nombre: "Colmena", descripcion: "ARL Colmena Seguros" },
  { id: "4", codigo: "ARL004", nombre: "Bolívar", descripcion: "ARL Seguros Bolívar" },
  { id: "5", codigo: "ARL005", nombre: "Liberty", descripcion: "ARL Liberty Seguros" },
];

export default function ARLPage() {
  return <CatalogoCRUD title="ARL" subtitle="Administración de Administradoras de Riesgos Laborales" initialData={data} />;
}
