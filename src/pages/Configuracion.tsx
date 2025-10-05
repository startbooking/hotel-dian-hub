import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileType, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const configOptions = [
  {
    title: "Plan de Cuentas (PUC)",
    description: "Gestiona el plan único de cuentas contables",
    icon: BookOpen,
    url: "/configuracion/plan-cuentas",
    color: "text-blue-500"
  },
  {
    title: "Tipos de Documentos",
    description: "Administra los tipos de documentos del sistema",
    icon: FileType,
    url: "/configuracion/tipos-documentos",
    color: "text-green-500"
  },
  {
    title: "Centros de Costo",
    description: "Define y gestiona los centros de costo",
    icon: Briefcase,
    url: "/configuracion/centros-costo",
    color: "text-purple-500"
  }
];

export default function Configuracion() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la configuración general del sistema contable
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {configOptions.map((option) => (
          <Link key={option.title} to={option.url}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${option.color}`}>
                    <option.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </div>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
