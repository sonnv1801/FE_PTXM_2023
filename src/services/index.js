import { ComBoService } from "./comboService";
import { OrderService } from "./orderService";
import { ProductService } from "./productService";
import { ProductSupplierService } from "./productSupplierService";
import { SupplierService } from "./supplierService";
import { TypeComBoService } from "./typeComboService";
import { TypeService } from "./typeService";
import { UserService } from "./useService";

export const userService = new UserService();
export const typeService = new TypeService();
export const productByService = new ProductService();
export const typeComboService = new TypeComBoService();
export const comboService = new ComBoService();
export const supplierService = new SupplierService();
export const productSupplierService = new ProductSupplierService();
export const ordersService = new OrderService();
