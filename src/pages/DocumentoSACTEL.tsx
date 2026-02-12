import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Printer, ArrowLeft, FileText, BookOpen, Building2, CheckCircle2,
  BarChart3, Shield, Calculator, Receipt, Users, Settings, Upload,
  Zap, Globe, HeadphonesIcon, Clock, LogIn, LayoutDashboard, Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DocumentoSACTEL() {
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar - hidden on print */}
      <div className="print:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <h1 className="font-semibold text-foreground">Documento SACTEL — Propuesta Comercial y Manual de Usuario</h1>
        <Button size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
        </Button>
      </div>

      {/* Document content */}
      <div ref={printRef} className="max-w-4xl mx-auto px-8 py-20 print:py-0 print:px-4 print:max-w-none">

        {/* ====== COVER PAGE ====== */}
        <section className="text-center py-24 print:py-16 print:break-after-page">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">SACTEL</h1>
          <p className="text-xl text-muted-foreground mb-2">Sistema de Administración Contable y Tributaria Empresarial</p>
          <Separator className="my-8 max-w-xs mx-auto" />
          <p className="text-lg text-foreground font-medium">Propuesta Comercial y Manual de Usuario</p>
          <p className="text-muted-foreground mt-2">Versión 1.0 — {new Date().getFullYear()}</p>
          <div className="mt-12 text-sm text-muted-foreground">
            <p>SACTEL Soluciones Tecnológicas</p>
            <p>Bogotá, Colombia</p>
            <p>contacto@sactel.com | +57 (1) 234-5678</p>
          </div>
        </section>

        {/* ====== TABLE OF CONTENTS ====== */}
        <section className="py-12 print:break-after-page">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" /> Tabla de Contenido
          </h2>
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-foreground mt-4 mb-2">PARTE I — PROPUESTA COMERCIAL</p>
            {["1. Descripción General", "2. Módulos del Sistema", "3. Ventajas Competitivas", "4. Planes y Precios"].map((item, i) => (
              <p key={i} className="text-muted-foreground pl-4 py-1 border-b border-border/50">{item}</p>
            ))}
            <p className="font-semibold text-foreground mt-6 mb-2">PARTE II — MANUAL DE USUARIO</p>
            {[
              "5. Acceso al Sistema", "6. Dashboard", "7. Facturación Electrónica",
              "8. Documento Contable", "9. Nómina", "10. Terceros",
              "11. Configuración", "12. Impuestos", "13. Importar Datos",
              "14. Datos de Compañía", "15. Reportes", "16. Seguridad y Roles"
            ].map((item, i) => (
              <p key={i} className="text-muted-foreground pl-4 py-1 border-b border-border/50">{item}</p>
            ))}
          </div>
        </section>

        {/* ====== PART I: COMMERCIAL PROPOSAL ====== */}
        <section className="print:break-before-page">
          <div className="py-12 text-center bg-primary/5 rounded-2xl print:rounded-none mb-10">
            <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-foreground">PARTE I</h2>
            <p className="text-lg text-muted-foreground">Propuesta Comercial</p>
          </div>

          {/* 1. Description */}
          <div className="mb-12 print:break-after-page">
            <h3 className="text-xl font-bold text-foreground mb-4">1. Descripción General</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SACTEL es una plataforma integral de gestión contable, tributaria y de nómina electrónica diseñada específicamente 
              para empresas colombianas. Nuestro sistema garantiza el cumplimiento total con la normativa de la Dirección de Impuestos 
              y Aduanas Nacionales (DIAN) y las Normas Internacionales de Información Financiera (NIIF).
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Con más de 10 años de experiencia y más de 500 empresas activas, SACTEL ofrece una solución 100% en la nube 
              que permite gestionar la contabilidad de su empresa desde cualquier lugar, en cualquier momento y desde cualquier dispositivo.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Users, val: "500+", lbl: "Empresas activas" },
                { icon: Globe, val: "32", lbl: "Departamentos" },
                { icon: Clock, val: "10+", lbl: "Años experiencia" },
                { icon: Zap, val: "99.9%", lbl: "Disponibilidad" }
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-lg border border-border">
                  <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{s.val}</p>
                  <p className="text-xs text-muted-foreground">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Modules */}
          <div className="mb-12 print:break-after-page">
            <h3 className="text-xl font-bold text-foreground mb-4">2. Módulos del Sistema</h3>
            {[
              { icon: FileText, title: "Facturación Electrónica", desc: "Emisión y recepción de facturas electrónicas conforme a la normativa DIAN.", features: ["Facturas de venta", "Notas crédito y débito", "Documentos soporte", "Validación DIAN automática"] },
              { icon: BookOpen, title: "Documento Contable", desc: "Registro de comprobantes de causación contable con partida doble.", features: ["Comprobantes de egreso/ingreso", "Notas contables", "Causación automática"] },
              { icon: Calculator, title: "Nómina Electrónica", desc: "Gestión completa de nómina con liquidación y documentos electrónicos.", features: ["Gestión de empleados", "Liquidación de nómina", "Documento soporte de nómina"] },
              { icon: BarChart3, title: "Reportes Financieros", desc: "Reportes contables y financieros en tiempo real.", features: ["Balance general", "Estado de resultados", "Libros auxiliares", "Medios magnéticos"] },
              { icon: Settings, title: "Configuración Contable", desc: "Parametrización completa del sistema contable.", features: ["Plan Único de Cuentas (PUC)", "Centros de costo", "Tipos de documentos"] },
              { icon: Receipt, title: "Impuestos", desc: "Configuración y cálculo automático de impuestos colombianos.", features: ["IVA / INC", "Retención en la fuente", "ICA", "Autorretenciones"] }
            ].map((mod, i) => (
              <div key={i} className="mb-6 pl-4 border-l-2 border-primary/30">
                <div className="flex items-center gap-2 mb-1">
                  <mod.icon className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-foreground">{mod.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{mod.desc}</p>
                <ul className="grid grid-cols-2 gap-1">
                  {mod.features.map((f, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 3. Advantages */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-foreground mb-4">3. Ventajas Competitivas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Seguridad", desc: "Cifrado de datos, respaldos automáticos y control de acceso por roles." },
                { icon: Zap, title: "Velocidad", desc: "Procesamiento en tiempo real de transacciones y reportes instantáneos." },
                { icon: HeadphonesIcon, title: "Soporte 24/7", desc: "Equipo de soporte técnico y contable disponible en todo momento." },
                { icon: Globe, title: "100% en la Nube", desc: "Acceda desde cualquier dispositivo, en cualquier lugar del país." }
              ].map((v, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                  <v.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{v.title}</h4>
                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Plans */}
          <div className="mb-12 print:break-after-page">
            <h3 className="text-xl font-bold text-foreground mb-4">4. Planes y Precios</h3>
            <p className="text-sm text-muted-foreground mb-4">Precios en pesos colombianos (COP), IVA no incluido.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 font-semibold text-foreground">Característica</th>
                    <th className="text-center p-3 font-semibold text-foreground">Básico<br /><span className="text-primary font-bold">$150.000/mes</span></th>
                    <th className="text-center p-3 font-semibold text-foreground border-x-2 border-primary/30">Profesional<br /><span className="text-primary font-bold">$350.000/mes</span></th>
                    <th className="text-center p-3 font-semibold text-foreground">Empresarial<br /><span className="text-primary font-bold">$650.000/mes</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Empresas", "1", "3", "Ilimitadas"],
                    ["Usuarios", "2", "5", "Ilimitados"],
                    ["Facturación electrónica", "✓", "✓", "✓"],
                    ["Documento contable", "✓", "✓", "✓"],
                    ["Nómina electrónica", "—", "✓", "✓"],
                    ["Reportes avanzados", "Básicos", "Todos", "Todos"],
                    ["Centros de costo", "—", "✓", "✓"],
                    ["API de integración", "—", "—", "✓"],
                    ["Soporte", "Email", "Prioritario", "24/7"],
                    ["Capacitación", "—", "Incluida", "Personalizada"],
                    ["Consultoría contable", "—", "—", "✓"]
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-3 text-foreground font-medium">{row[0]}</td>
                      <td className="p-3 text-center text-muted-foreground">{row[1]}</td>
                      <td className="p-3 text-center text-muted-foreground border-x-2 border-primary/10">{row[2]}</td>
                      <td className="p-3 text-center text-muted-foreground">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ====== PART II: USER MANUAL ====== */}
        <section className="print:break-before-page">
          <div className="py-12 text-center bg-accent/5 rounded-2xl print:rounded-none mb-10">
            <BookOpen className="h-10 w-10 text-accent mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-foreground">PARTE II</h2>
            <p className="text-lg text-muted-foreground">Manual de Usuario</p>
          </div>

          {[
            {
              num: 5, icon: LogIn, title: "Acceso al Sistema",
              steps: [
                { t: "Ingresar al sistema", c: "Acceda a la página principal y haga clic en 'Ingresar' en la esquina superior derecha." },
                { t: "Credenciales", c: "Ingrese su usuario y contraseña proporcionados por el administrador. El sistema valida las credenciales contra el servidor de autenticación SACTEL." },
                { t: "Roles de usuario", c: "Administrador (acceso total), Contador (gestión contable completa), Auxiliar (registro de documentos) y Consultor (solo consulta y reportes)." },
                { t: "Cerrar sesión", c: "Haga clic en el icono de usuario en la esquina superior derecha y seleccione 'Cerrar Sesión'." }
              ]
            },
            {
              num: 6, icon: LayoutDashboard, title: "Dashboard",
              steps: [
                { t: "Vista general", c: "Al ingresar se presenta el Dashboard con indicadores financieros: ingresos, egresos, saldo y documentos pendientes." },
                { t: "Gráficos", c: "Evolución de ingresos/egresos por periodo, distribución por centros de costo y estado de documentos electrónicos." },
                { t: "Accesos rápidos", c: "Acceda directamente a crear facturas, registrar documentos contables o generar reportes." }
              ]
            },
            {
              num: 7, icon: FileText, title: "Facturación Electrónica",
              steps: [
                { t: "Crear factura", c: "Navegue a Documentos Electrónicos > Facturar. Complete datos del cliente, agregue productos/servicios. El sistema calcula impuestos automáticamente." },
                { t: "Notas crédito", c: "Para anular o corregir una factura. Seleccione factura de referencia, indique motivo y los ítems a afectar." },
                { t: "Notas débito", c: "Para cargos adicionales. Referencie la factura original y agregue conceptos adicionales." },
                { t: "Documento soporte", c: "Para compras a no obligados a facturar. Registre datos del proveedor y bienes/servicios adquiridos." },
                { t: "Consultar documentos", c: "Busque por número, fecha, tercero o estado. Clic en ícono de ojo para ver detalle completo." },
                { t: "Acciones", c: "Desde el modal de detalle puede imprimir, descargar PDF o enviar por correo electrónico." }
              ]
            },
            {
              num: 8, icon: BookOpen, title: "Documento Contable",
              steps: [
                { t: "Crear comprobante", c: "Seleccione tipo de documento (egreso, ingreso, nota contable), fecha y descripción." },
                { t: "Agregar movimientos", c: "Ingrese cuentas PUC, tercero, centro de costo y valores débito/crédito. El sistema valida partida doble." },
                { t: "Guardar y contabilizar", c: "Guarde como borrador o contabilice directamente. Los comprobantes contabilizados afectan saldos." }
              ]
            },
            {
              num: 9, icon: Calculator, title: "Nómina",
              steps: [
                { t: "Registro de empleados", c: "En Nómina > Empleados: datos personales, laborales y contractuales (identificación, cargo, salario, contrato, fecha ingreso)." },
                { t: "Liquidar nómina", c: "Seleccione periodo y empleados. Cálculo automático: salario, auxilio transporte, horas extras, deducciones salud/pensión." },
                { t: "Generar documentos", c: "Cree documento soporte de nómina electrónica para envío a la DIAN. XML conforme a resolución vigente." }
              ]
            },
            {
              num: 10, icon: Users, title: "Terceros",
              steps: [
                { t: "Crear tercero", c: "Registre: tipo identificación (NIT, CC, CE), número, nombre, dirección, teléfono, email y régimen tributario." },
                { t: "Clasificación", c: "Clasifique como clientes, proveedores o ambos. Asigne retenciones según actividad económica." },
                { t: "Importar", c: "Importación masiva desde Excel en Importar Datos > Terceros." }
              ]
            },
            {
              num: 11, icon: Settings, title: "Configuración",
              steps: [
                { t: "Plan de cuentas (PUC)", c: "Gestione el catálogo contable. PUC precargado según normativa colombiana, personalizable." },
                { t: "Centros de costo", c: "Defina estructura para control de gastos por departamento, proyecto o sucursal." },
                { t: "Tipos de documentos", c: "Configure prefijos, consecutivos y resoluciones DIAN para cada tipo de documento." }
              ]
            },
            {
              num: 12, icon: Receipt, title: "Impuestos",
              steps: [
                { t: "Configurar impuestos", c: "Configure tarifas IVA (0%, 5%, 19%), retención en la fuente, ICA y autorretenciones." },
                { t: "Bases gravables", c: "Defina bases mínimas para retenciones según normativa tributaria vigente (UVT)." }
              ]
            },
            {
              num: 13, icon: Upload, title: "Importar Datos",
              steps: [
                { t: "Formatos", c: "Importe: PUC, Terceros, Centros de Costo y Saldos Iniciales. Cada módulo tiene plantilla Excel." },
                { t: "Proceso", c: "Descargue plantilla, complete datos, cargue archivo. El sistema valida antes de importar." },
                { t: "Validaciones", c: "Verifica formato, campos obligatorios, duplicados y consistencia." }
              ]
            },
            {
              num: 14, icon: Building2, title: "Datos de Compañía",
              steps: [
                { t: "Datos generales", c: "NIT, razón social, dirección, teléfono, email, representante legal y código CIIU." },
                { t: "Config. tributaria", c: "Régimen tributario, responsabilidades fiscales, resolución facturación DIAN y certificado digital." }
              ]
            },
            {
              num: 15, icon: BarChart3, title: "Reportes",
              steps: [
                { t: "Disponibles", c: "Balance General, Estado de Resultados, Balance de Prueba, Libros Auxiliares, Libro Mayor, Certificados de Retención, Medios Magnéticos." },
                { t: "Filtros", c: "Seleccione periodo, centro de costo, cuenta o tercero para reportes filtrados." },
                { t: "Exportar", c: "Todos los reportes exportables en PDF y Excel." }
              ]
            },
            {
              num: 16, icon: Shield, title: "Seguridad y Roles",
              steps: [
                { t: "Roles", c: "Administrador: acceso total. Contador: gestión contable y reportes. Auxiliar: registro de documentos. Consultor: solo lectura." },
                { t: "Gestión de usuarios", c: "El administrador crea, edita y desactiva usuarios asignando roles específicos." },
                { t: "Auditoría", c: "Registro de todas las operaciones: usuario, fecha, hora y tipo de acción." }
              ]
            }
          ].map((section, i) => (
            <div key={i} className={`mb-10 ${i > 0 && i % 3 === 0 ? "print:break-before-page" : ""}`}>
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">{section.num}. {section.title}</h3>
              </div>
              <div className="space-y-3 pl-7">
                {section.steps.map((step, j) => (
                  <div key={j}>
                    <p className="text-sm font-medium text-foreground">{step.t}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.c}</p>
                  </div>
                ))}
              </div>
              {i < 11 && <Separator className="mt-6" />}
            </div>
          ))}
        </section>

        {/* Footer */}
        <section className="py-12 text-center border-t border-border mt-12 print:break-before-page">
          <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-foreground text-lg">SACTEL Soluciones Tecnológicas</h3>
          <p className="text-sm text-muted-foreground mt-1">contacto@sactel.com | +57 (1) 234-5678 | Bogotá, Colombia</p>
          <p className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} SACTEL. Todos los derechos reservados.</p>
          <p className="text-xs text-muted-foreground">Documento generado automáticamente. La información aquí contenida es confidencial.</p>
        </section>
      </div>
    </div>
  );
}
