import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import ProductList from "./features/products/ProductList";
import CartPage from "./features/cart/CartPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LowStockBanner from "./components/LowStockBanner";
import { useInventoryHub } from "./hooks/useInventoryHub";

function App() {
    useInventoryHub();

    return (
        <BrowserRouter>
            <LowStockBanner />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <ProductList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;