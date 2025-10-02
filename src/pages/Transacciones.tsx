import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api, Transaccion } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, TrendingDown, Calendar as CalendarIcon, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const transaccionSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  tipo: z.enum(["ingreso", "egreso"], {
    required_error: "Seleccione el tipo de transacción",
  }),
  categoria: z.string().min(1, "La categoría es requerida"),
  descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
  monto: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El monto debe ser un número mayor a 0",
  }),
  metodoPago: z.string().min(1, "El método de pago es requerido"),
});

type TransaccionFormValues = z.infer<typeof transaccionSchema>;

const categorias = {
  ingreso: [
    "Hospedaje",
    "Restaurante",
    "Bar",
    "Eventos",
    "Servicios Adicionales",
    "Otros Ingresos",
  ],
  egreso: [
    "Nómina",
    "Servicios Públicos",
    "Mantenimiento",
    "Compras",
    "Marketing",
    "Impuestos",
    "Otros Egresos",
  ],
};

const metodosPago = [
  "Efectivo",
  "Tarjeta de Crédito",
  "Tarjeta de Débito",
  "Transferencia Bancaria",
  "PSE",
  "Cheque",
];

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const { toast } = useToast();

  const form = useForm<TransaccionFormValues>({
    resolver: zodResolver(transaccionSchema),
    defaultValues: {
      fecha: new Date(),
      tipo: "ingreso",
      categoria: "",
      descripcion: "",
      monto: "",
      metodoPago: "",
    },
  });

  const tipoTransaccion = form.watch("tipo");

  useEffect(() => {
    loadTransacciones();
  }, []);

  const loadTransacciones = async () => {
    setLoading(true);
    const response = await api.getTransacciones();

    if (response.success && response.data) {
      setTransacciones(response.data);
    } else {
      toast({
        title: "Error",
        description: "No se pudieron cargar las transacciones",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const onSubmit = async (data: TransaccionFormValues) => {
    try {
      // Aquí llamarías a la API para crear la transacción
      toast({
        title: "Éxito",
        description: "Transacción registrada correctamente",
      });
      
      setDialogOpen(false);
      form.reset();
      loadTransacciones();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la transacción",
        variant: "destructive",
      });
    }
  };

  const transaccionesFiltradas = transacciones.filter((t) => {
    const matchTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
    const matchBusqueda =
      t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.categoria.toLowerCase().includes(busqueda.toLowerCase());
    return matchTipo && matchBusqueda;
  });

  const totales = transacciones.reduce(
    (acc, t) => {
      if (t.tipo === "ingreso") {
        acc.ingresos += t.monto;
      } else {
        acc.egresos += t.monto;
      }
      return acc;
    },
    { ingresos: 0, egresos: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ingresos y Egresos</h1>
          <p className="text-muted-foreground mt-1">
            Registro de movimientos contables
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Transacción</DialogTitle>
              <DialogDescription>
                Complete los datos del movimiento contable
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("2020-01-01")
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ingreso">Ingreso</SelectItem>
                            <SelectItem value="egreso">Egreso</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias[tipoTransaccion].map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción detallada de la transacción"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto (COP)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, "");
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        {field.value && (
                          <p className="text-sm text-muted-foreground">
                            ${Number(field.value).toLocaleString()}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pago</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {metodosPago.map((metodo) => (
                              <SelectItem key={metodo} value={metodo}>
                                {metodo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Transacción</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-success to-success/80 pb-4">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Total Ingresos</span>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-success">
              ${totales.ingresos.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-destructive to-destructive/80 pb-4">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Total Egresos</span>
              <TrendingDown className="h-5 w-5 opacity-80" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-destructive">
              ${totales.egresos.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary to-primary/80 pb-4">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">Balance</span>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div
              className={cn(
                "text-3xl font-bold",
                totales.ingresos - totales.egresos >= 0
                  ? "text-success"
                  : "text-destructive"
              )}
            >
              ${(totales.ingresos - totales.egresos).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descripción o categoría..."
                  className="pl-10"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filtroTipo === "todos" ? "default" : "outline"}
                onClick={() => setFiltroTipo("todos")}
              >
                Todos
              </Button>
              <Button
                variant={filtroTipo === "ingreso" ? "default" : "outline"}
                onClick={() => setFiltroTipo("ingreso")}
              >
                Ingresos
              </Button>
              <Button
                variant={filtroTipo === "egreso" ? "default" : "outline"}
                onClick={() => setFiltroTipo("egreso")}
              >
                Egresos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))
            ) : transaccionesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron transacciones</p>
              </div>
            ) : (
              transaccionesFiltradas.map((transaccion) => (
                <div
                  key={transaccion.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          transaccion.tipo === "ingreso"
                            ? "bg-success text-success-foreground"
                            : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {transaccion.tipo === "ingreso" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {transaccion.tipo.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{transaccion.categoria}</Badge>
                    </div>
                    <h3 className="font-medium">{transaccion.descripcion}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(transaccion.fecha).toLocaleDateString("es-CO")}
                      </span>
                      <span>•</span>
                      <span>{transaccion.metodoPago}</span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 text-right">
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        transaccion.tipo === "ingreso"
                          ? "text-success"
                          : "text-destructive"
                      )}
                    >
                      {transaccion.tipo === "ingreso" ? "+" : "-"}$
                      {transaccion.monto.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
