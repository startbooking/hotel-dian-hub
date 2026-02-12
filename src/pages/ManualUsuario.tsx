import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  BookOpen, LogIn, LayoutDashboard, FileText, Receipt, Calculator,
  Users, Settings, BarChart3, Upload, Building2, Shield, ChevronRight,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ManualSection {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  steps: { title: string; content: string }[];
}

const sections: ManualSection[] = [
  {
    id: "acceso",
    icon: LogIn,
    title: "1. Acceso al Sistema",
    description: "Cómo ingresar al sistema y gestionar su sesión",
    steps: [
      { title: "Ingresar al sistema", content: "Acceda a la página principal del sistema y haga clic en el botón 'Ingresar' ubicado en la esquina superior derecha de la barra de navegación." },
      { title: "Credenciales", content: "Ingrese su usuario y contraseña proporcionados por el administrador del sistema. El sistema valida las credenciales contra el servidor de autenticación SACTEL." },
      { title: "Roles de usuario", content: "Existen 4 roles: Administrador (acceso total), Contador (gestión contable completa), Auxiliar (registro de documentos) y Consultor (solo consulta y reportes)." },
      { title: "Cerrar sesión", content: "Para salir del sistema, haga clic en el icono de usuario en la esquina superior derecha y seleccione 'Cerrar Sesión'. La sesión se cierra automáticamente por inactividad." }
    ]
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "2. Dashboard",
    description: "Panel principal con resumen de la información financiera",
    steps: [
      { title: "Vista general", content: "Al ingresar al sistema se presenta el Dashboard con un resumen de los indicadores financieros principales: ingresos, egresos, saldo y documentos pendientes." },
      { title: "Gráficos", content: "Los gráficos muestran la evolución de ingresos y egresos por periodo, distribución por centros de costo y estado de los documentos electrónicos." },
      { title: "Accesos rápidos", content: "Desde el Dashboard puede acceder directamente a las funciones más utilizadas como crear facturas, registrar documentos contables o generar reportes." }
    ]
  },
  {
    id: "facturacion",
    icon: FileText,
    title: "3. Facturación Electrónica",
    description: "Emisión de facturas, notas crédito, notas débito y documentos soporte",
    steps: [
      { title: "Crear factura", content: "Navegue a Documentos Electrónicos > Facturar. Complete los datos del cliente, agregue los productos o servicios con sus cantidades y valores. El sistema calcula automáticamente los impuestos." },
      { title: "Notas crédito", content: "Para anular o corregir una factura, vaya a Notas Crédito. Seleccione la factura de referencia, indique el motivo y los ítems a afectar. Se genera el documento electrónico ante la DIAN." },
      { title: "Notas débito", content: "Para cargos adicionales, acceda a Notas Débito. Referencie la factura original y agregue los conceptos adicionales con sus valores e impuestos." },
      { title: "Documento soporte", content: "Para compras a no obligados a facturar, utilice el Documento Soporte. Registre los datos del proveedor y los bienes o servicios adquiridos." },
      { title: "Consultar documentos", content: "En cada módulo de facturación puede buscar documentos por número, fecha, tercero o estado. Haga clic en el ícono de ojo para ver el detalle completo del documento." },
      { title: "Acciones sobre documentos", content: "Desde el modal de detalle puede imprimir, descargar en PDF o enviar por correo electrónico el documento seleccionado." }
    ]
  },
  {
    id: "contable",
    icon: BookOpen,
    title: "4. Documento Contable",
    description: "Registro de comprobantes de causación contable",
    steps: [
      { title: "Crear comprobante", content: "Acceda a Documento Contable. Seleccione el tipo de documento (egreso, ingreso, nota contable), la fecha y la descripción del comprobante." },
      { title: "Agregar movimientos", content: "Ingrese las cuentas contables del PUC, el tercero asociado, el centro de costo y los valores en débito o crédito. El sistema valida que la partida doble esté balanceada." },
      { title: "Guardar y contabilizar", content: "Una vez balanceado el comprobante, puede guardarlo como borrador o contabilizarlo directamente. Los comprobantes contabilizados afectan los saldos de las cuentas." }
    ]
  },
  {
    id: "nomina",
    icon: Calculator,
    title: "5. Nómina",
    description: "Gestión de empleados, liquidación y documentos de nómina electrónica",
    steps: [
      { title: "Registro de empleados", content: "En Nómina > Empleados, registre los datos personales, laborales y contractuales de cada empleado: identificación, cargo, salario, tipo de contrato, fecha de ingreso." },
      { title: "Liquidar nómina", content: "En Nómina > Liquidar Nómina, seleccione el periodo y los empleados. El sistema calcula automáticamente: salario, auxilio de transporte, horas extras, deducciones de salud, pensión y otros conceptos." },
      { title: "Generar documentos", content: "En Nómina > Generar Documentos, cree el documento soporte de nómina electrónica para envío a la DIAN. El sistema genera el XML conforme a la resolución vigente." }
    ]
  },
  {
    id: "terceros",
    icon: Users,
    title: "6. Terceros",
    description: "Gestión de clientes, proveedores y otros terceros",
    steps: [
      { title: "Crear tercero", content: "Acceda a Terceros y registre: tipo de identificación (NIT, CC, CE), número, nombre o razón social, dirección, teléfono, email y régimen tributario." },
      { title: "Clasificación", content: "Clasifique los terceros como clientes, proveedores o ambos. Asigne las retenciones aplicables según su actividad económica." },
      { title: "Importar terceros", content: "Puede importar masivamente terceros desde un archivo Excel. Vaya a Importar Datos > Terceros y siga las instrucciones del formato." }
    ]
  },
  {
    id: "configuracion",
    icon: Settings,
    title: "7. Configuración",
    description: "Parametrización del sistema contable",
    steps: [
      { title: "Plan de cuentas (PUC)", content: "En Configuración > Plan de Cuentas, gestione el catálogo contable. Puede crear, editar o desactivar cuentas. El PUC viene precargado según la normativa colombiana y puede personalizarse." },
      { title: "Centros de costo", content: "En Configuración > Centros de Costo, defina la estructura de centros de costo para el control de gastos por departamento, proyecto o sucursal." },
      { title: "Tipos de documentos", content: "En Configuración > Tipos de Documentos, configure los prefijos, consecutivos y resoluciones DIAN para cada tipo de documento contable y electrónico." }
    ]
  },
  {
    id: "impuestos",
    icon: Receipt,
    title: "8. Impuestos",
    description: "Configuración de tasas impositivas",
    steps: [
      { title: "Configurar impuestos", content: "En el módulo de Impuestos, configure las tarifas de IVA (0%, 5%, 19%), retención en la fuente, ICA y autorretenciones aplicables a su empresa." },
      { title: "Bases gravables", content: "Defina las bases mínimas para aplicación de retenciones según la normativa tributaria vigente (UVT)." }
    ]
  },
  {
    id: "importar",
    icon: Upload,
    title: "9. Importar Datos",
    description: "Carga masiva de información desde archivos Excel",
    steps: [
      { title: "Formatos disponibles", content: "El sistema permite importar: Plan de Cuentas (PUC), Terceros, Centros de Costo y Saldos Iniciales. Cada módulo tiene su formato Excel específico." },
      { title: "Proceso de importación", content: "Seleccione el tipo de datos a importar, descargue la plantilla Excel, complete los datos según las instrucciones y cargue el archivo. El sistema valida los datos antes de importarlos." },
      { title: "Validaciones", content: "El sistema verifica: formato de datos, campos obligatorios, duplicados y consistencia con la información existente. Los errores se muestran en un reporte detallado." }
    ]
  },
  {
    id: "companias",
    icon: Building2,
    title: "10. Datos de Compañía",
    description: "Información de la empresa y configuración general",
    steps: [
      { title: "Datos generales", content: "En Datos Compañía, registre: NIT, razón social, dirección, teléfono, email, representante legal y actividad económica principal (código CIIU)." },
      { title: "Configuración tributaria", content: "Configure el régimen tributario, responsabilidades fiscales, resolución de facturación DIAN y certificado digital para firma electrónica." }
    ]
  },
  {
    id: "reportes",
    icon: BarChart3,
    title: "11. Reportes",
    description: "Generación de informes contables y financieros",
    steps: [
      { title: "Reportes disponibles", content: "El sistema genera: Balance General, Estado de Resultados, Balance de Prueba, Libros Auxiliares, Libro Mayor, Certificado de Retenciones y Medios Magnéticos." },
      { title: "Filtros y periodos", content: "Seleccione el periodo contable, centro de costo, cuenta o tercero específico para generar reportes filtrados según sus necesidades." },
      { title: "Exportar", content: "Todos los reportes pueden exportarse en formato PDF y Excel para su análisis o presentación ante entidades de control." }
    ]
  },
  {
    id: "seguridad",
    icon: Shield,
    title: "12. Seguridad y Roles",
    description: "Control de acceso y permisos del sistema",
    steps: [
      { title: "Roles del sistema", content: "Administrador: acceso total a todos los módulos y configuración. Contador: gestión contable, facturación y reportes. Auxiliar: registro de documentos y consultas básicas. Consultor: solo lectura y generación de reportes." },
      { title: "Gestión de usuarios", content: "El administrador puede crear, editar y desactivar usuarios desde el módulo de Usuarios. Cada usuario se asigna a un rol específico." },
      { title: "Auditoría", content: "El sistema registra todas las operaciones realizadas: usuario, fecha, hora y tipo de acción. Esta información está disponible para auditoría y control interno." }
    ]
  }
];

export default function ManualUsuario() {
  const [activeSection, setActiveSection] = useState("acceso");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.steps.some(st => st.title.toLowerCase().includes(searchTerm.toLowerCase()) || st.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manual de Usuario</h1>
                <p className="text-muted-foreground">Sistema Contable SACTEL — Guía completa de uso</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - TOC */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="sticky top-20 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en el manual..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <nav className="space-y-1 pr-2">
                    {filteredSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => { setActiveSection(section.id); setSearchTerm(""); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <section.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{section.title}</span>
                        {activeSection === section.id && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                      </button>
                    ))}
                  </nav>
                </ScrollArea>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {currentSection && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <currentSection.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{currentSection.title}</h2>
                      <p className="text-muted-foreground">{currentSection.description}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {currentSection.steps.map((step, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs font-mono">{i + 1}</Badge>
                            {step.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Navigation between sections */}
                  <Separator className="my-8" />
                  <div className="flex justify-between">
                    {sections.indexOf(currentSection) > 0 && (
                      <button
                        onClick={() => setActiveSection(sections[sections.indexOf(currentSection) - 1].id)}
                        className="text-sm text-primary hover:underline"
                      >
                        ← {sections[sections.indexOf(currentSection) - 1].title}
                      </button>
                    )}
                    <div />
                    {sections.indexOf(currentSection) < sections.length - 1 && (
                      <button
                        onClick={() => setActiveSection(sections[sections.indexOf(currentSection) + 1].id)}
                        className="text-sm text-primary hover:underline"
                      >
                        {sections[sections.indexOf(currentSection) + 1].title} →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
