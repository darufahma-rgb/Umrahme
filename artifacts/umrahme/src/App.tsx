import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Beranda from './pages/Beranda';
import Panduan from './pages/Panduan';
import TataCara from './pages/TataCara';
import PanduanIhram from './pages/PanduanIhram';
import Ibadah from './pages/Ibadah';
import CounterTawaf from './pages/CounterTawaf';
import CounterSai from './pages/CounterSai';
import JadwalSholat from './pages/JadwalSholat';
import Doa from './pages/Doa';
import DoaDetail from './pages/DoaDetail';
import Peta from './pages/Peta';
import LokasiDetail from './pages/LokasiDetail';
import Profil from './pages/Profil';
import Persiapan from './pages/Persiapan';
import Sertifikat from './pages/Sertifikat';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/beranda" element={<Beranda />} />

        {/* Slot: Panduan (Mode A — belajar) */}
        <Route path="/panduan" element={<Panduan />} />
        <Route path="/panduan/tata-cara" element={<TataCara />} />
        <Route path="/panduan/ihram" element={<PanduanIhram />} />

        {/* Slot: Ibadah (Mode B — pintu cepat) */}
        <Route path="/ibadah" element={<Ibadah />} />
        <Route path="/ibadah/tawaf" element={<CounterTawaf />} />
        <Route path="/ibadah/sai" element={<CounterSai />} />
        <Route path="/ibadah/jadwal-sholat" element={<JadwalSholat />} />

        {/* Slot: Doa */}
        <Route path="/doa" element={<Doa />} />
        <Route path="/doa/:id" element={<DoaDetail />} />

        {/* Peta — diakses dari Beranda & Panduan, bukan slot nav */}
        <Route path="/peta" element={<Peta />} />
        <Route path="/peta/:id" element={<LokasiDetail />} />

        {/* Slot: Profil */}
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/persiapan" element={<Persiapan />} />
        <Route path="/profil/sertifikat" element={<Sertifikat />} />
      </Route>

      <Route path="/" element={<Navigate to="/beranda" replace />} />
      <Route path="*" element={<Navigate to="/beranda" replace />} />
    </Routes>
  );
}
