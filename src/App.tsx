import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Presentacion from "./pages/Presentacion";
import ManualUsuario from "./pages/ManualUsuario";
import DocumentoSACTEL from "./pages/DocumentoSACTEL";
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

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/presentacion" element={<Presentacion />} />
      <Route path="/manual" element={<ManualUsuario />} />
      <Route path="/documento" element={<DocumentoSACTEL />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/documento-contable" element={
        <ProtectedRoute>
          <Layout><DocumentoContable /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/importar" element={
        <ProtectedRoute>
          <Layout><ImportarDatos /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/companias" element={
        <ProtectedRoute>
          <Layout><Companias /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/impuestos" element={
        <ProtectedRoute>
          <Layout><Impuestos /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/documentos/facturar" element={
        <ProtectedRoute>
          <Layout><Facturar /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/documentos/soporte" element={
        <ProtectedRoute>
          <Layout><DocumentoSoporte /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/documentos/notas-credito" element={
        <ProtectedRoute>
          <Layout><NotasCredito /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/documentos/notas-debito" element={
        <ProtectedRoute>
          <Layout><NotasDebito /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/documentos/nomina" element={
        <ProtectedRoute>
          <Layout><NominaElectronica /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/nomina/empleados" element={
        <ProtectedRoute>
          <Layout><Empleados /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/nomina/liquidar" element={
        <ProtectedRoute>
          <Layout><LiquidarNomina /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/nomina/documentos" element={
        <ProtectedRoute>
          <Layout><GenerarDocumentos /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/configuracion" element={
        <ProtectedRoute>
          <Layout><Configuracion /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/configuracion/plan-cuentas" element={
        <ProtectedRoute>
          <Layout><PlanDeCuentas /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/configuracion/tipos-documentos" element={
        <ProtectedRoute>
          <Layout><TiposDocumentos /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/configuracion/centros-costo" element={
        <ProtectedRoute>
          <Layout><CentrosDeCosto /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reportes" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
