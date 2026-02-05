import { Building2, CheckCircle2, BarChart3, FileText, Shield } from "lucide-react";

export function HeroSection() {
  const features = [
    {
      icon: FileText,
      title: "Facturación Electrónica",
      description: "Emisión de facturas electrónicas cumpliendo con la normativa DIAN"
    },
    {
      icon: BarChart3,
      title: "Reportes en Tiempo Real",
      description: "Visualiza el estado financiero de tu empresa al instante"
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Tus datos protegidos con los más altos estándares de seguridad"
    }
  ];

  return (
    <section className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero principal */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Sistema Contable Empresarial</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Gestiona tu Contabilidad de forma
            <span className="text-primary"> Inteligente</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            SACTEL es un sistema contable integral diseñado para optimizar la gestión financiera de tu empresa. 
            Facturación electrónica, nómina, reportes y mucho más en una sola plataforma.
          </p>
        </div>

        {/* Logo y marca de la empresa */}
        <div className="flex flex-col items-center mb-16">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="h-14 w-14 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">SACTEL</h2>
          <p className="text-muted-foreground">Sistema de Administración Contable y Tributaria Empresarial</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Información adicional de la empresa */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Por qué elegir SACTEL?
              </h3>
              <ul className="space-y-3">
                {[
                  "Cumplimiento total con la normativa DIAN",
                  "Soporte técnico especializado 24/7",
                  "Actualizaciones automáticas incluidas",
                  "Interfaz intuitiva y fácil de usar",
                  "Integración con múltiples plataformas"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4 p-6">
                  <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-3xl font-bold text-primary">500+</p>
                    <p className="text-sm text-muted-foreground">Empresas</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-3xl font-bold text-accent">10+</p>
                    <p className="text-sm text-muted-foreground">Años</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-3xl font-bold text-success">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border text-center">
                    <p className="text-3xl font-bold text-primary">24/7</p>
                    <p className="text-sm text-muted-foreground">Soporte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
