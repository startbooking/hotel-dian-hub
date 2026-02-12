import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  Building2, FileText, BarChart3, Shield, Users, Calculator, 
  Receipt, BookOpen, Settings, CheckCircle2, Star, Zap, 
  Globe, Clock, HeadphonesIcon, TrendingUp, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const modules = [
  {
    icon: FileText,
    title: "Facturación Electrónica",
    description: "Emisión y recepción de facturas electrónicas conforme a la normativa DIAN. Incluye notas crédito, notas débito y documentos soporte.",
    features: ["Facturas de venta", "Notas crédito y débito", "Documentos soporte", "Validación DIAN automática"]
  },
  {
    icon: BookOpen,
    title: "Documento Contable",
    description: "Registro de comprobantes de causación contable con partida doble, centros de costo y terceros asociados.",
    features: ["Comprobantes de egreso", "Comprobantes de ingreso", "Notas contables", "Causación automática"]
  },
  {
    icon: Calculator,
    title: "Nómina Electrónica",
    description: "Gestión completa de nómina con liquidación, generación de documentos electrónicos y reporte a la DIAN.",
    features: ["Gestión de empleados", "Liquidación de nómina", "Documento soporte de nómina", "Reportes de nómina"]
  },
  {
    icon: BarChart3,
    title: "Reportes Financieros",
    description: "Generación de reportes contables y financieros en tiempo real para la toma de decisiones.",
    features: ["Balance general", "Estado de resultados", "Libros auxiliares", "Medios magnéticos"]
  },
  {
    icon: Settings,
    title: "Configuración Contable",
    description: "Parametrización completa del sistema contable adaptado a las necesidades de cada empresa.",
    features: ["Plan Único de Cuentas (PUC)", "Centros de costo", "Tipos de documentos", "Terceros y NIT"]
  },
  {
    icon: Receipt,
    title: "Impuestos",
    description: "Configuración y cálculo automático de impuestos colombianos: IVA, retenciones, ICA y más.",
    features: ["IVA / INC", "Retención en la fuente", "ICA", "Autorretenciones"]
  }
];

const plans = [
  {
    name: "Básico",
    price: "150.000",
    period: "/mes",
    description: "Ideal para pequeñas empresas y emprendedores",
    features: [
      "1 empresa",
      "2 usuarios",
      "Facturación electrónica",
      "Documento contable",
      "Reportes básicos",
      "Soporte por email"
    ],
    highlighted: false
  },
  {
    name: "Profesional",
    price: "350.000",
    period: "/mes",
    description: "Para empresas en crecimiento con necesidades avanzadas",
    features: [
      "3 empresas",
      "5 usuarios",
      "Facturación electrónica",
      "Nómina electrónica",
      "Todos los reportes",
      "Centros de costo",
      "Soporte prioritario",
      "Capacitación incluida"
    ],
    highlighted: true
  },
  {
    name: "Empresarial",
    price: "650.000",
    period: "/mes",
    description: "Solución completa para grandes organizaciones",
    features: [
      "Empresas ilimitadas",
      "Usuarios ilimitados",
      "Todos los módulos",
      "API de integración",
      "Soporte 24/7",
      "Capacitación personalizada",
      "Consultoría contable",
      "Personalización a medida"
    ],
    highlighted: false
  }
];

const stats = [
  { icon: Users, value: "500+", label: "Empresas activas" },
  { icon: Globe, value: "32", label: "Departamentos cubiertos" },
  { icon: Clock, value: "10+", label: "Años de experiencia" },
  { icon: TrendingUp, value: "99.9%", label: "Disponibilidad" }
];

export default function Presentacion() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Star className="h-3.5 w-3.5 mr-1.5" /> Propuesta Comercial
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Sistema Contable <span className="text-primary">SACTEL</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
              Plataforma integral de gestión contable, tributaria y de nómina electrónica diseñada para empresas colombianas.
              Cumplimiento total con la normativa DIAN y las NIIF.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-3">Módulos del Sistema</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cada módulo está diseñado para cubrir las necesidades contables y administrativas de su empresa
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod, i) => (
                <Card key={i} className="group hover:border-primary/40 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                      <mod.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{mod.title}</CardTitle>
                    <CardDescription>{mod.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mod.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Ventajas */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-3">¿Por qué SACTEL?</h2>
              <p className="text-muted-foreground">Ventajas competitivas que nos diferencian</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Seguridad", desc: "Cifrado de datos, respaldos automáticos y control de acceso por roles" },
                { icon: Zap, title: "Velocidad", desc: "Procesamiento en tiempo real de transacciones y reportes instantáneos" },
                { icon: HeadphonesIcon, title: "Soporte 24/7", desc: "Equipo de soporte técnico y contable disponible en todo momento" },
                { icon: Globe, title: "100% en la Nube", desc: "Acceda desde cualquier dispositivo, en cualquier lugar del país" }
              ].map((v, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-card border border-border">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Planes */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-3">Planes y Precios</h2>
              <p className="text-muted-foreground">Precios en pesos colombianos (COP), IVA no incluido</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <Card key={i} className={`relative ${plan.highlighted ? "border-primary shadow-lg scale-[1.02]" : ""}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Más popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full gap-2" variant={plan.highlighted ? "default" : "outline"}>
                      Solicitar Demo <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">¿Listo para modernizar su contabilidad?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Contáctenos para una demostración personalizada y descubra cómo SACTEL puede transformar la gestión contable de su empresa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                <HeadphonesIcon className="h-5 w-5" /> Solicitar Demostración
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="h-5 w-5" /> Descargar Brochure
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
