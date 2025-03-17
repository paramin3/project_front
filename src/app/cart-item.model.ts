export interface CartItem {
    id: number; // Unique identifier for the cart item
    product: {
        id: number; // Product ID
        name: string; // Product name
        price: number; // Product price
        imagePaths: string[]; // Array of image paths for the product
        stock: number;
    };
    quantity: number; // Quantity of the product in the cart
}
