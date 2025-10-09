import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Tercero {
  id: string;
  identificacion: string;
  nombre: string;
}

interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
}

interface ProductoDocumento {
  producto: Producto;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}

const terceroSchema = z.object({
  identificacion: z.string().min(1, "Identificación es requerida"),
  nombre: z.string().min(1, "Nombre es requerido"),
});

const productoSchema = z.object({
  codigo: z.string().min(1, "Código es requerido"),
  nombre: z.string().min(1, "Nombre es requerido"),
  precio: z.string().min(1, "Precio es requerido"),
});

export default function DocumentoSoporte() {
  const { toast } = useToast();
  const [fecha, setFecha] = useState<Date>(new Date());
  const [terceroSeleccionado, setTerceroSeleccionado] = useState<string>("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("1");
  const [valorUnitario, setValorUnitario] = useState<string>("0");
  const [productosDocumento, setProductosDocumento] = useState<ProductoDocumento[]>([]);
  const [openTerceroDialog, setOpenTerceroDialog] = useState(false);
  const [openProductoDialog, setOpenProductoDialog] = useState(false);

  // Mock data - en producción vendría de la base de datos
  const [terceros, setTerceros] = useState<Tercero[]>([
    { id: "1", identificacion: "900123456", nombre: "Empresa ABC SAS" },
    { id: "2", identificacion: "800654321", nombre: "Proveedor XYZ LTDA" },
  ]);

  const [productos, setProductos] = useState<Producto[]>([
    { id: "1", codigo: "PROD001", nombre: "Producto A", precio: 50000 },
    { id: "2", codigo: "PROD002", nombre: "Producto B", precio: 75000 },
    { id: "3", codigo: "PROD003", nombre: "Producto C", precio: 100000 },
  ]);

  const terceroForm = useForm<z.infer<typeof terceroSchema>>({
    resolver: zodResolver(terceroSchema),
    defaultValues: { identificacion: "", nombre: "" },
  });

  const productoForm = useForm<z.infer<typeof productoSchema>>({
    resolver: zodResolver(productoSchema),
    defaultValues: { codigo: "", nombre: "", precio: "" },
  });

  const handleAgregarTercero = (values: z.infer<typeof terceroSchema>) => {
    const nuevoTercero: Tercero = {
      id: String(terceros.length + 1),
      identificacion: values.identificacion,
      nombre: values.nombre,
    };
    setTerceros([...terceros, nuevoTercero]);
    setOpenTerceroDialog(false);
    terceroForm.reset();
    toast({ title: "Tercero agregado exitosamente" });
  };

  const handleAgregarProducto = (values: z.infer<typeof productoSchema>) => {
    const nuevoProducto: Producto = {
      id: String(productos.length + 1),
      codigo: values.codigo,
      nombre: values.nombre,
      precio: parseFloat(values.precio),
    };
    setProductos([...productos, nuevoProducto]);
    setOpenProductoDialog(false);
    productoForm.reset();
    toast({ title: "Producto agregado exitosamente" });
  };

  const handleAgregarProductoADocumento = () => {
    if (!productoSeleccionado) {
      toast({ title: "Seleccione un producto", variant: "destructive" });
      return;
    }

    const producto = productos.find(p => p.id === productoSeleccionado);
    if (!producto) return;

    const cant = parseFloat(cantidad) || 0;
    const valorUnit = parseFloat(valorUnitario) || producto.precio;
    const valorTot = cant * valorUnit;

    const nuevoProductoDoc: ProductoDocumento = {
      producto,
      cantidad: cant,
      valorUnitario: valorUnit,
      valorTotal: valorTot,
    };

    setProductosDocumento([...productosDocumento, nuevoProductoDoc]);
    setProductoSeleccionado("");
    setCantidad("1");
    setValorUnitario("0");
  };

  const handleEliminarProducto = (index: number) => {
    setProductosDocumento(productosDocumento.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return productosDocumento.reduce((sum, item) => sum + item.valorTotal, 0);
  };

  const handleGuardarDocumento = () => {
    if (!terceroSeleccionado) {
      toast({ title: "Seleccione un tercero", variant: "destructive" });
      return;
    }
    if (productosDocumento.length === 0) {
      toast({ title: "Agregue al menos un producto", variant: "destructive" });
      return;
    }

    toast({ title: "Documento Soporte creado exitosamente" });
    // Aquí se guardaría en la base de datos
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documento Soporte</h1>
        <p className="text-muted-foreground mt-1">
          Gestión de documentos soporte electrónicos
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Fecha y Tercero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fecha && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fecha ? format(fecha, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={(date) => date && setFecha(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tercero</Label>
                <Dialog open={openTerceroDialog} onOpenChange={setOpenTerceroDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Tercero</DialogTitle>
                    </DialogHeader>
                    <Form {...terceroForm}>
                      <form onSubmit={terceroForm.handleSubmit(handleAgregarTercero)} className="space-y-4">
                        <FormField
                          control={terceroForm.control}
                          name="identificacion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Identificación</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={terceroForm.control}
                          name="nombre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">Agregar</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <Select value={terceroSeleccionado} onValueChange={setTerceroSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tercero" />
                </SelectTrigger>
                <SelectContent>
                  {terceros.map((tercero) => (
                    <SelectItem key={tercero.id} value={tercero.id}>
                      {tercero.identificacion} - {tercero.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Productos</h3>
              <Dialog open={openProductoDialog} onOpenChange={setOpenProductoDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Producto</DialogTitle>
                  </DialogHeader>
                  <Form {...productoForm}>
                    <form onSubmit={productoForm.handleSubmit(handleAgregarProducto)} className="space-y-4">
                      <FormField
                        control={productoForm.control}
                        name="codigo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productoForm.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productoForm.control}
                        name="precio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Agregar</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label>Producto</Label>
                <Select 
                  value={productoSeleccionado} 
                  onValueChange={(value) => {
                    setProductoSeleccionado(value);
                    const prod = productos.find(p => p.id === value);
                    if (prod) setValorUnitario(String(prod.precio));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id}>
                        {producto.codigo} - {producto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <Label>Valor Unitario</Label>
                <Input
                  type="number"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleAgregarProductoADocumento} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar al Documento
            </Button>
          </div>

          {/* Tabla de Productos */}
          {productosDocumento.length > 0 && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosDocumento.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.producto.codigo}</TableCell>
                      <TableCell>{item.producto.nombre}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right">
                        ${item.valorUnitario.toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.valorTotal.toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarProducto(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end">
                <Card className="p-4 w-full md:w-1/3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${calcularTotal().toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleGuardarDocumento}>Guardar Documento Soporte</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
