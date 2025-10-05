import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Habitaciones from "./pages/Habitaciones";
import Facturacion from "./pages/Facturacion";
import Transacciones from "./pages/Transacciones";
import Companias from "./pages/Companias";
import Empleados from "./pages/nomina/Empleados";
import LiquidarNomina from "./pages/nomina/LiquidarNomina";
import GenerarDocumentos from "./pages/nomina/GenerarDocumentos";
import Configuracion from "./pages/Configuracion";
import PlanDeCuentas from "./pages/configuracion/PlanDeCuentas";
import TiposDocumentos from "./pages/configuracion/TiposDocumentos";
import CentrosDeCosto from "./pages/configuracion/CentrosDeCosto";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/transacciones" element={<Transacciones />} />
            <Route path="/companias" element={<Companias />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
