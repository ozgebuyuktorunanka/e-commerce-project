import { UserRole } from "../usersService/entities/user.enum";

export const PRODUCTCOMMENTS_PATTERNS = {
    FindAll: "ProductComments.FindAll",
    AvarageRating: "ProductComments.AvarageRating",
    Create: "ProductComments.Create",
    Remove: "ProductComments.Remove",
};

export const AUTH_PATTERNS = {
    ValidateUser: "Auth.ValidateUser",
    Login: "Auth.Login",
    Refresh: "Auth.Refresh",
};

export const CART_PATTERNS = {
    FindAll: "Cart.FindAll",
    FindAllNoneParam: "Cart.FindAllNoneParam",
    FindOne: "Cart.FindOne",
    FindByEmail: "Cart.FindByEmail",
    Create: "Cart.Create",
    Update: "Cart.Update",
    Remove: "Cart.Remove",
};

export const ORDERS_PATTERNS = {
    FindAll: "Orders.FindAll",
    FindOne: "Orders.FindOne",
    Create: "Orders.Create",
    Update: "Orders.Update",
    Remove: "Orders.Remove",
};

export const PRODUCTS_PATTERNS = {
    FindAll: "Products.FindAll",
    FindAllNoneParam: "Products.FindAllNoneParam",
    FindOne: "Products.FindOne",
    FindByEmail: "Products.FindByEmail",
    Create: "Products.Create",
    Update: "Products.Update",
    Remove: "Products.Remove",
    Decrease: "Products.Decrease",
    GetCategory: "Products.Category"
};
export const USER_PATTERNS = {
    FindAll: "Users.FindAll",
    FindAllNoneParam: "Users.FindAllNoneParam",
    FindOne: "Users.FindOne",
    FindByEmail: "Users.FindByEmail",
    Create: "Users.Create",
    Update: "Users.Update",
    Remove: "Users.Remove",
};
export const ORDER_KAFKA_EVENTS = {
    ORDER_CREATED: "Order.Created",
    ORDER_SHIPPING_CREATED: "Order_Shipping.Created",
    ORDER_STOCK_WARNING: "Order_Stock_Warning",
    ORDER_UPDATED: "Order.Update"
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}

export interface UserType {
    id: number;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    birthdate: Date;
    role: number;
}

export type ProductImage = {
    url: string;
    index: number;
};
export type ProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    store_id: number;
    category_id: number;
    rating: number;
    sell_count: number;
    images: ProductImage[];
};

export type SortOrder = "asc" | "desc";

export type GetPaginatedQueryType = {
    page: number;
    limit: number;
    sort: string;
    order: SortOrder;
    filter: string;
};
