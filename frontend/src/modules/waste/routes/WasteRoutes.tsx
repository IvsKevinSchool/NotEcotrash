import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WasteSubcategoryIndex from '../pages/WasteSubcategoryIndex';

const WasteRoutes = () => (
  <Routes>
    {/* Ruta principal para subcategorías de residuos */}
    <Route path="/subcategories" element={<WasteSubcategoryIndex />} />
  </Routes>
);

export default WasteRoutes;
