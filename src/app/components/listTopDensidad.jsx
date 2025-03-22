'use client';

import { useState, useEffect } from 'react';

function ListDensidad() {
    const [pueblos, setPueblos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPueblos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pueblos/`);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                // Filtrar pueblos con densidad de población numérica válida
                const pueblosConDensidadValida = data.filter(pueblo => {
                    return typeof pueblo.densidad_poblacion === 'number' && !isNaN(pueblo.densidad_poblacion);
                });
                // Ordenar por densidad de población (de menor a mayor) y tomar los 5 primeros
                const pueblosOrdenados = [...pueblosConDensidadValida].sort((a, b) => a.densidad_poblacion - b.densidad_poblacion).slice(0, 5);
                setPueblos(pueblosOrdenados);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPueblos();
    }, []);

    if (loading) return <div className="p-4">Cargando...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return(
        <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 5 pueblos con menor densidad de población</h3>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-blue-50 border-b border-blue-200">
                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Ranking</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Nombre</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Densidad (hab/km²)</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Población</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Superficie km²</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pueblos.map((pueblo, index) => (
                            <tr key={pueblo.id} className="hover:bg-blue-50 border-b border-gray-100">
                                <td className="py-2 px-4 font-medium">{index + 1}</td>
                                <td className="py-2 px-4 font-medium">{pueblo.nombre}</td>
                                <td className="py-2 px-4">{pueblo.densidad_poblacion}</td>
                                <td className="py-2 px-4">{pueblo.poblacion}</td>
                                <td className="py-2 px-4">{pueblo.superficie_km2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListDensidad;