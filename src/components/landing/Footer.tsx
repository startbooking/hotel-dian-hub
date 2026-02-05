import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar-background text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa desarrolladora */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">SACTEL</h3>
                <p className="text-sm text-sidebar-foreground/70">Soluciones Tecnológicas</p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Desarrollamos soluciones tecnológicas innovadoras para la gestión empresarial y contable.
            </p>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-semibold text-accent">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <Mail className="h-4 w-4 text-accent" />
                contacto@sactel.com
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <Phone className="h-4 w-4 text-accent" />
                +57 (1) 234-5678
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <MapPin className="h-4 w-4 text-accent" />
                Bogotá, Colombia
              </li>
            </ul>
          </div>

          {/* Enlaces */}
          <div className="space-y-4">
            <h4 className="font-semibold text-accent">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-accent transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-accent transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-accent transition-colors">
                  Soporte Técnico
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-sidebar-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sidebar-foreground/70">
              © {currentYear} SACTEL Soluciones Tecnológicas. Todos los derechos reservados.
            </p>
            <p className="text-xs text-sidebar-foreground/50">
              Desarrollado con ❤️ en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
