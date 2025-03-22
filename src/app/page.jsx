import ListDensidad from "./components/listTopDensidad";
import ListPoblacion from "./components/listTopPoblacion";
import ListPueblos from "./components/listPueblos";

function HomePage(){
  return(
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight">DATOS ESTADÍSTICOS DE LOS PUEBLOS DE ESPAÑA</h1>
          <p className="mt-2 text-blue-100">Información demográfica y geográfica actualizada</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Top Stats Section - Two columns */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Estadísticas Destacadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <ListDensidad />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <ListPoblacion />
            </div>
          </div>
        </section>

        {/* Full Data Table Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Base de Datos Completa</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <ListPueblos />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} - Datos Estadísticos de Pueblos de España</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage