import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import DocumentoContable from "./pages/DocumentoContable";
import ImportarDatos from "./pages/importar/ImportarDatos";
import Companias from "./pages/Companias";
import Impuestos from "./pages/Impuestos";
import Empleados from "./pages/nomina/Empleados";
import LiquidarNomina from "./pages/nomina/LiquidarNomina";
import GenerarDocumentos from "./pages/nomina/GenerarDocumentos";
import Facturar from "./pages/documentos/Facturar";
import DocumentoSoporte from "./pages/documentos/DocumentoSoporte";
import NotasCredito from "./pages/documentos/NotasCredito";
import NotasDebito from "./pages/documentos/NotasDebito";
import NominaElectronica from "./pages/documentos/NominaElectronica";
import Configuracion from "./pages/Configuracion";
import PlanDeCuentas from "./pages/configuracion/PlanDeCuentas";
import TiposDocumentos from "./pages/configuracion/TiposDocumentos";
import CentrosDeCosto from "./pages/configuracion/CentrosDeCosto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documento-contable" element={<DocumentoContable />} />
              <Route path="/importar" element={<ImportarDatos />} />
              <Route path="/companias" element={<Companias />} />
              <Route path="/impuestos" element={<Impuestos />} />
              <Route path="/documentos/facturar" element={<Facturar />} />
              <Route path="/documentos/soporte" element={<DocumentoSoporte />} />
              <Route path="/documentos/notas-credito" element={<NotasCredito />} />
              <Route path="/documentos/notas-debito" element={<NotasDebito />} />
              <Route path="/documentos/nomina" element={<NominaElectronica />} />
              <Route path="/nomina/empleados" element={<Empleados />} />
              <Route path="/nomina/liquidar" element={<LiquidarNomina />} />
              <Route path="/nomina/documentos" element={<GenerarDocumentos />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/configuracion/plan-cuentas" element={<PlanDeCuentas />} />
              <Route path="/configuracion/tipos-documentos" element={<TiposDocumentos />} />
              <Route path="/configuracion/centros-costo" element={<CentrosDeCosto />} />
              <Route path="/reportes" element={<Dashboard />} />
              <Route path="/usuarios" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
