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
import Empleados from "./pages/nomina/Empleados";
import LiquidarNomina from "./pages/nomina/LiquidarNomina";
import GenerarDocumentos from "./pages/nomina/GenerarDocumentos";
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
            <Route path="/nomina/empleados" element={<Empleados />} />
            <Route path="/nomina/liquidar" element={<LiquidarNomina />} />
            <Route path="/nomina/documentos" element={<GenerarDocumentos />} />
            <Route path="/reportes" element={<Dashboard />} />
            <Route path="/usuarios" element={<Dashboard />} />
            <Route path="/configuracion" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
