import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, FileType, Briefcase, Users, UserCog, Landmark, FileCheck, Settings, HeartPulse, ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ConfigOption {
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
  color: string;
}

const generalOptions: ConfigOption[] = [
  { title: "Usuarios", description: "Gestiona los usuarios y sus permisos", icon: Users, url: "/usuarios", color: "text-blue-500" },
  { title: "Tipos de Documentos", description: "Administra los tipos de documentos del sistema", icon: FileType, url: "/configuracion/tipos-documentos", color: "text-green-500" },
  { title: "Bancos", description: "Gestiona las entidades bancarias", icon: Landmark, url: "/configuracion/bancos", color: "text-amber-500" },
];

const contabilidadOptions: ConfigOption[] = [
  { title: "Plan de Cuentas (PUC)", description: "Gestiona el plan único de cuentas local", icon: BookOpen, url: "/configuracion/plan-cuentas", color: "text-blue-500" },
  { title: "Plan de Cuentas NIIF", description: "Gestiona el plan de cuentas bajo NIIF", icon: BookOpen, url: "/configuracion/plan-cuentas-niif", color: "text-indigo-500" },
  { title: "Centros de Costo", description: "Define y gestiona los centros de costo", icon: Briefcase, url: "/configuracion/centros-costo", color: "text-purple-500" },
];

const nominaOptions: ConfigOption[] = [
  { title: "EPS", description: "Entidades Promotoras de Salud", icon: HeartPulse, url: "/configuracion/eps", color: "text-rose-500" },
  { title: "ARL", description: "Administradoras de Riesgos Laborales", icon: ShieldCheck, url: "/configuracion/arl", color: "text-emerald-500" },
  { title: "Tipos de Contrato", description: "Define los tipos de contrato laboral", icon: FileCheck, url: "/configuracion/tipos-contrato", color: "text-cyan-500" },
];

function OptionsGrid({ options }: { options: ConfigOption[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
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
  );
}

export default function Configuracion() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          Configuración General
        </h1>
        <p className="text-muted-foreground mt-2">
          Organiza la configuración del sistema por módulo
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contabilidad">Contabilidad</TabsTrigger>
          <TabsTrigger value="nomina">Nómina</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <OptionsGrid options={generalOptions} />
        </TabsContent>
        <TabsContent value="contabilidad" className="mt-6">
          <OptionsGrid options={contabilidadOptions} />
        </TabsContent>
        <TabsContent value="nomina" className="mt-6">
          <OptionsGrid options={nominaOptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
