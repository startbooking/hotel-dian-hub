import CatalogoCRUD from "./CatalogoCRUD";

const data = [
  { id: "1", codigo: "TF", nombre: "Término Fijo", descripcion: "Contrato con fecha de finalización definida" },
  { id: "2", codigo: "TI", nombre: "Término Indefinido", descripcion: "Contrato sin fecha de finalización" },
  { id: "3", codigo: "OL", nombre: "Obra o Labor", descripcion: "Contrato por obra o labor específica" },
  { id: "4", codigo: "PS", nombre: "Prestación de Servicios", descripcion: "Contrato de prestación de servicios" },
];

export default function TiposContrato() {
  return <CatalogoCRUD title="Tipos de Contrato" subtitle="Administración de tipos de contrato laboral" initialData={data} />;
}
