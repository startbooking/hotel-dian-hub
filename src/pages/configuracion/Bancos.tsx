import CatalogoCRUD from "./CatalogoCRUD";

const data = [
  { id: "1", codigo: "001", nombre: "Bancolombia", descripcion: "Bancolombia S.A." },
  { id: "2", codigo: "002", nombre: "Davivienda", descripcion: "Banco Davivienda S.A." },
  { id: "3", codigo: "003", nombre: "BBVA", descripcion: "BBVA Colombia" },
  { id: "4", codigo: "004", nombre: "Banco de Bogotá", descripcion: "Banco de Bogotá S.A." },
  { id: "5", codigo: "005", nombre: "Banco Popular", descripcion: "Banco Popular S.A." },
];

export default function Bancos() {
  return <CatalogoCRUD title="Bancos" subtitle="Administración de entidades bancarias" initialData={data} />;
}
