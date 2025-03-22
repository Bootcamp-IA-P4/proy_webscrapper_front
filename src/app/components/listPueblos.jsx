'use client';

import { useState, useEffect, useMemo } from 'react';

function ListPueblos() {
    const [pueblos, setPueblos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchPueblos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pueblos/`);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                setPueblos(data);
                setTotalItems(data.length);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPueblos();
    }, []);

    // Ordenar los datos si se ha seleccionado un campo
    const sortedData = useMemo(() => {
        if (!sortField) return pueblos;
        
        return [...pueblos].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            
            // Manejar ordenación numérica para campos numéricos
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            // Ordenación de texto para campos de texto
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [pueblos, sortField, sortDirection]);
    
    // Calcular índices para paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Ir a la página anterior
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Ir a la página siguiente
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    // Manejar el cambio de ordenación
    const handleSort = (field) => {
        if (sortField === field) {
            // Si ya estamos ordenando por este campo, cambiamos la dirección
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Si es un nuevo campo, establecemos el campo y dirección ascendente por defecto
            setSortField(field);
            setSortDirection('asc');
        }
    };
    
    // Generar los números de página a mostrar (máximo 7 con elipsis)
    const getPageNumbers = () => {
        const maxPagesToShow = 7;
        let pages = [];
        
        if (totalPages <= maxPagesToShow) {
            // Si hay menos páginas que el máximo, mostramos todas
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            // Siempre incluimos la primera página
            pages.push(1);
            
            // Calculamos el rango de páginas alrededor de la página actual
            const leftBound = Math.max(2, currentPage - 2);
            const rightBound = Math.min(totalPages - 1, currentPage + 2);
            
            // Añadimos elipsis a la izquierda si es necesario
            if (leftBound > 2) {
                pages.push('...');
            }
            
            // Añadimos las páginas del rango
            for (let i = leftBound; i <= rightBound; i++) {
                pages.push(i);
            }
            
            // Añadimos elipsis a la derecha si es necesario
            if (rightBound < totalPages - 1) {
                pages.push('...');
            }
            
            // Siempre incluimos la última página
            pages.push(totalPages);
        }
        
        return pages;
    };

    if (loading) return <div className="p-4">Cargando...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Listado de pueblos</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('id')}
                            >
                                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('nombre')}
                            >
                                Nombre {sortField === 'nombre' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('provincia')}
                            >
                                Provincia {sortField === 'provincia' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('comunidad_autonoma')}
                            >
                                Comunidad Autónoma {sortField === 'comunidad_autonoma' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('poblacion')}
                            >
                                Población {sortField === 'poblacion' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('superficie_km2')}
                            >
                                Superficie (km²) {sortField === 'superficie_km2' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('densidad_poblacion')}
                            >
                                Densidad {sortField === 'densidad_poblacion' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-2 px-4 border-b cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSort('codigo_postal')}
                            >
                                Código Postal {sortField === 'codigo_postal' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((pueblo) => (
                            <tr key={pueblo.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{pueblo.id}</td>
                                <td className="py-2 px-4 border-b">{pueblo.nombre}</td>
                                <td className="py-2 px-4 border-b">{pueblo.provincia}</td>
                                <td className="py-2 px-4 border-b">{pueblo.comunidad_autonoma}</td>
                                <td className="py-2 px-4 border-b">{pueblo.poblacion}</td>
                                <td className="py-2 px-4 border-b">{pueblo.superficie_km2}</td>
                                <td className="py-2 px-4 border-b">{pueblo.densidad_poblacion}</td>
                                <td className="py-2 px-4 border-b">{pueblo.codigo_postal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    <span className="text-sm">
                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, totalItems)} de {totalItems} resultados
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
                    >
                        Anterior
                    </button>
                    
                    {getPageNumbers().map((number, index) => (
                        number === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-1">
                                {number}
                            </span>
                        ) : (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}`}
                            >
                                {number}
                            </button>
                        )
                    ))}
                    
                    <button 
                        onClick={goToNextPage} 
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListPueblos;