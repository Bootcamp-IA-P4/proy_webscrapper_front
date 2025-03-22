'use client';

import { useState, useEffect } from 'react';

function ListPoblacion() {
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
                // Filtrar pueblos con población numérica válida
                const pueblosConPoblacionValida = data.filter(pueblo => {
                    return typeof pueblo.poblacion === 'number' && !isNaN(pueblo.poblacion);
                });
                // Ordenar por población (de menor a mayor) y tomar los 5 primeros
                const pueblosOrdenados = [...pueblosConPoblacionValida].sort((a, b) => a.poblacion - b.poblacion).slice(0, 5);
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
            <h1 className="text-2xl font-bold mb-4">Top 5 pueblos con menor población</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Nombre</th>
                            <th className="py-2 px-4 border-b">Población</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pueblos.map((pueblo) => (
                            <tr key={pueblo.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{pueblo.nombre}</td>
                                <td className="py-2 px-4 border-b">{pueblo.poblacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListPoblacion;