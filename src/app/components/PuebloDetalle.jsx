'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function PuebloDetalle({ params }) {
    const router = useRouter();
    const [pueblo, setPueblo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scraping, setScraping] = useState(false);
    const [scrapeMessage, setScrapeMessage] = useState('');
    const [puebloId, setPuebloId] = useState(null);
    
    // Handle params asynchronously
    useEffect(() => {
        const getParams = async () => {
            if (params) {
                const id = await params.id;
                setPuebloId(id);
            }
        };
        
        getParams();
    }, [params]);

    const fetchPuebloDetalle = async () => {
        if (!puebloId) return;
        
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pueblos/${puebloId}/`);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            setPueblo(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPuebloDetalle();
    }, [puebloId]);

    const handleVolver = () => {
        router.push('/');
    };
    
    const scrapePueblo = async (puebloName) => {
        try {
            setScraping(true);
            setScrapeMessage('');
            
            const response = await fetch('http://localhost:8000/api/trigger-scrape/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pueblo_name: puebloName })
            });
            
            const data = await response.json();
            setScrapeMessage(data.message || 'Scrape completado');
            
            // Refresh pueblo data after scraping
            fetchPuebloDetalle();
        } catch (error) {
            console.error('Error:', error);
            setScrapeMessage('Error al realizar el scrape');
        } finally {
            setScraping(false);
        }
    };

    if (loading) return <div className="p-4">Cargando...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!pueblo) return <div className="p-4">No se encontró información del pueblo</div>;

    return (
        <div className="p-6">
            <button 
                onClick={handleVolver}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                ← Volver al listado
            </button>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{pueblo.nombre}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Información geográfica</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium text-gray-600">Provincia:</span> {pueblo.provincia || 'No disponible'}</p>
                            <p><span className="font-medium text-gray-600">Comunidad Autónoma:</span> {pueblo.comunidad_autonoma || 'No disponible'}</p>
                            <p><span className="font-medium text-gray-600">Código Postal:</span> {pueblo.codigo_postal || 'No disponible'}</p>
                            <p><span className="font-medium text-gray-600">Código INE:</span> {pueblo.codigo_ine || ''}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Datos demográficos</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium text-gray-600">Población:</span> {pueblo.poblacion !== null ? pueblo.poblacion.toLocaleString() : 'No disponible'} habitantes</p>
                            <p><span className="font-medium text-gray-600">Superficie:</span> {pueblo.superficie_km2 !== null ? pueblo.superficie_km2.toLocaleString() : 'No disponible'} km²</p>
                            <p><span className="font-medium text-gray-600">Densidad de población:</span> {pueblo.densidad_poblacion !== null ? pueblo.densidad_poblacion.toLocaleString() : 'No disponible'} hab/km²</p>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Clasificación</h2>
                    <p><span className="font-medium text-gray-600">Tipo de zona:</span> {pueblo.clasificacion_zona || ''}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">ID: {pueblo.id}</p>
                </div>
                
                <div className="mt-6">
                    <button 
                        onClick={() => scrapePueblo(pueblo.nombre)}
                        disabled={scraping}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {scraping ? 'Procesando...' : 'Actualizar datos mediante scraping'}
                    </button>
                    
                    {scrapeMessage && (
                        <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-md">
                            {scrapeMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PuebloDetalle;