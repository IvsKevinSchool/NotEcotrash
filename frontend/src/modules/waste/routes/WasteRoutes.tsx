import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WasteIndex from '../pages/WasteIndex';
import WasteSubcategoryIndex from '../pages/WasteSubcategoryIndex';

const WasteRoutes = () => (
  <Routes>
    {/* Ruta principal unificada para residuos y subcategorías */}
    <Route path="/" element={<WasteIndex />} />
    {/* Mantener ruta legacy para subcategorías por si acaso */}
    <Route path="/subcategories" element={<WasteSubcategoryIndex />} />
  </Routes>
);

export default WasteRoutes;
