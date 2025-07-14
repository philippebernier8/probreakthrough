import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête avec l'indice PB */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Indice PB actuel</p>
                <p className="text-3xl font-bold text-green-500">87</p>
              </div>
              <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-xl font-bold text-green-500">+3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Statistiques de la saison</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Matchs joués</span>
                <span className="font-bold">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Buts</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Passes décisives</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Minutes jouées</span>
                <span className="font-bold">1620</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Performances</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tirs cadrés</span>
                <span className="font-bold">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Passes réussies</span>
                <span className="font-bold">82%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duels gagnés</span>
                <span className="font-bold">65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interceptions</span>
                <span className="font-bold">24</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Prochains matchs</h2>
            <div className="space-y-4">
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="font-medium">vs. FC Montreal</p>
                <p className="text-sm text-gray-500">25 Mars 2024 - 15:00</p>
              </div>
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="font-medium">vs. Ottawa FC</p>
                <p className="text-sm text-gray-500">2 Avril 2024 - 19:30</p>
              </div>
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="font-medium">vs. Toronto City</p>
                <p className="text-sm text-gray-500">8 Avril 2024 - 20:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique de progression */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">Progression de l'indice PB</h2>
          <div className="h-64 w-full bg-gray-50 rounded-lg flex items-end justify-between p-4">
            {/* Simuler un graphique avec des barres */}
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '60%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '65%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '70%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '68%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '75%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '78%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '82%' }}></div>
            <div className="w-8 bg-red-500 rounded-t-lg" style={{ height: '87%' }}></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Sept</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Déc</span>
            <span>Jan</span>
            <span>Fév</span>
            <span>Mar</span>
            <span>Avr</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 