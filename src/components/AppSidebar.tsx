import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  Settings,
  DollarSign,
  Users,
  UserCog,
  Calculator,
  FileCheck,
  ChevronDown,
  Building2,
  BookOpen,
  FileType,
  Briefcase,
  Receipt,
  CreditCard
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Ingresos/Egresos", url: "/transacciones", icon: DollarSign },
  { title: "Datos Compañía", url: "/companias", icon: Building2 },
  { title: "Impuestos", url: "/impuestos", icon: Receipt },
  { title: "Reportes", url: "/reportes", icon: TrendingUp },
  { title: "Usuarios", url: "/usuarios", icon: Users },
];

const documentosSubItems = [
  { title: "Facturar", url: "/documentos/facturar", icon: FileText },
  { title: "Documento Soporte", url: "/documentos/soporte", icon: FileCheck },
  { title: "Notas Crédito", url: "/documentos/notas-credito", icon: CreditCard },
  { title: "Notas Débito", url: "/documentos/notas-debito", icon: CreditCard },
  { title: "Nómina Electrónica", url: "/documentos/nomina", icon: Users },
];

const nominaSubItems = [
  { title: "Empleados", url: "/nomina/empleados", icon: UserCog },
  { title: "Liquidar Nómina", url: "/nomina/liquidar", icon: Calculator },
  { title: "Documentos Contables", url: "/nomina/documentos", icon: FileCheck },
];

const configuracionSubItems = [
  { title: "Plan de Cuentas (PUC)", url: "/configuracion/plan-cuentas", icon: BookOpen },
  { title: "Tipos de Documentos", url: "/configuracion/tipos-documentos", icon: FileType },
  { title: "Centros de Costo", url: "/configuracion/centros-costo", icon: Briefcase },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const [documentosOpen, setDocumentosOpen] = useState(
    location.pathname.startsWith('/documentos')
  );
  const [nominaOpen, setNominaOpen] = useState(
    location.pathname.startsWith('/nomina')
  );
  const [configuracionOpen, setConfiguracionOpen] = useState(
    location.pathname.startsWith('/configuracion')
  );

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

              {/* Documentos Electrónicos con Submenú */}
              <Collapsible open={documentosOpen} onOpenChange={setDocumentosOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        location.pathname.startsWith('/documentos')
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      {open && <span>Documentos Electrónicos</span>}
                      {open && (
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${documentosOpen ? 'rotate-180' : ''}`} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {open && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {documentosSubItems.map((subItem) => (
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

              {/* Nómina con Submenú */}
              <Collapsible open={nominaOpen} onOpenChange={setNominaOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        location.pathname.startsWith('/nomina')
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Users className="h-5 w-5 flex-shrink-0" />
                      {open && <span>Nómina</span>}
                      {open && (
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${nominaOpen ? 'rotate-180' : ''}`} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {open && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {nominaSubItems.map((subItem) => (
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

              {/* Configuración con Submenú */}
              <Collapsible open={configuracionOpen} onOpenChange={setConfiguracionOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        location.pathname.startsWith('/configuracion')
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      {open && <span>Configuración</span>}
                      {open && (
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${configuracionOpen ? 'rotate-180' : ''}`} />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {open && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {configuracionSubItems.map((subItem) => (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
