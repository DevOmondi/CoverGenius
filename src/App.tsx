// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { PaymentProvider } from './contexts/PaymentContext';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PaymentProvider>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </PaymentProvider>
    </div>
  );
}

export default App;