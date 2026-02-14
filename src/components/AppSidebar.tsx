import { 
  LayoutDashboard, FileText, TrendingUp, Settings, DollarSign, Users, UserCog,
  Calculator, FileCheck, ChevronDown, Building2, BookOpen, FileType, Briefcase,
  Receipt, CreditCard, Upload, Database, MoreHorizontal, FileSpreadsheet, Landmark
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubItem, SidebarMenuSubButton, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface CollapsibleMenuProps {
  label: string;
  icon: LucideIcon;
  basePath: string;
  items: MenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sidebarOpen: boolean;
}

function CollapsibleMenu({ label, icon: Icon, basePath, items, open, onOpenChange, sidebarOpen }: CollapsibleMenuProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(basePath);

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
            {sidebarOpen && (
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {sidebarOpen && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <NavLink
                      to={subItem.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Documento Contable", url: "/documento-contable", icon: FileCheck },
  { title: "Importar Datos", url: "/importar", icon: Upload },
  { title: "Datos Compañía", url: "/companias", icon: Building2 },
  { title: "Impuestos", url: "/impuestos", icon: Receipt },
  { title: "Medios Magnéticos", url: "/medios-magneticos", icon: Database },
  { title: "Reportes", url: "/reportes", icon: TrendingUp },
  { title: "Usuarios", url: "/usuarios", icon: Users },
];

const documentosSubItems: MenuItem[] = [
  { title: "Facturar", url: "/documentos/facturar", icon: FileText },
  { title: "Documento Soporte", url: "/documentos/soporte", icon: FileCheck },
  { title: "Notas Crédito", url: "/documentos/notas-credito", icon: CreditCard },
  { title: "Notas Débito", url: "/documentos/notas-debito", icon: CreditCard },
  { title: "Nómina Electrónica", url: "/documentos/nomina", icon: Users },
];

const nominaSubItems: MenuItem[] = [
  { title: "Empleados", url: "/nomina/empleados", icon: UserCog },
  { title: "Liquidar Nómina", url: "/nomina/liquidar", icon: Calculator },
  { title: "Documentos Contables", url: "/nomina/documentos", icon: FileCheck },
];

const configuracionSubItems: MenuItem[] = [
  { title: "Plan de Cuentas (PUC)", url: "/configuracion/plan-cuentas", icon: BookOpen },
  { title: "Tipos de Documentos", url: "/configuracion/tipos-documentos", icon: FileType },
  { title: "Centros de Costo", url: "/configuracion/centros-costo", icon: Briefcase },
];

const opcionesSubItems: MenuItem[] = [
  { title: "Certificado Retenciones", url: "/opciones/certificado-retenciones", icon: FileSpreadsheet },
  { title: "Certificado IVA", url: "/opciones/certificado-iva", icon: DollarSign },
  { title: "Certificado ICA", url: "/opciones/certificado-ica", icon: Landmark },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const [documentosOpen, setDocumentosOpen] = useState(location.pathname.startsWith("/documentos"));
  const [nominaOpen, setNominaOpen] = useState(location.pathname.startsWith("/nomina"));
  const [configuracionOpen, setConfiguracionOpen] = useState(location.pathname.startsWith("/configuracion"));
  const [opcionesOpen, setOpcionesOpen] = useState(location.pathname.startsWith("/opciones"));

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className={`font-bold text-sidebar-foreground transition-all ${open ? "text-xl" : "text-sm"}`}>
            {open ? "HotelAccounting" : "HA"}
          </h1>
          {open && <p className="text-xs text-sidebar-foreground/70 mt-1">Sistema de Contabilidad</p>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <CollapsibleMenu
                label="Documentos Electrónicos"
                icon={FileText}
                basePath="/documentos"
                items={documentosSubItems}
                open={documentosOpen}
                onOpenChange={setDocumentosOpen}
                sidebarOpen={open}
              />

              <CollapsibleMenu
                label="Nómina"
                icon={Users}
                basePath="/nomina"
                items={nominaSubItems}
                open={nominaOpen}
                onOpenChange={setNominaOpen}
                sidebarOpen={open}
              />

              <CollapsibleMenu
                label="Configuración"
                icon={Settings}
                basePath="/configuracion"
                items={configuracionSubItems}
                open={configuracionOpen}
                onOpenChange={setConfiguracionOpen}
                sidebarOpen={open}
              />

              <CollapsibleMenu
                label="Opciones"
                icon={MoreHorizontal}
                basePath="/opciones"
                items={opcionesSubItems}
                open={opcionesOpen}
                onOpenChange={setOpcionesOpen}
                sidebarOpen={open}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
