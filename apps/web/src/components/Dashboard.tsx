export function Dashboard() {
  const stats = [
    { number: '0', label: 'Total Components' },
    { number: '0', label: 'Total Systems' },
    { number: '0', label: 'Total Assemblies' },
    { number: '0', label: 'Active Projects' },
  ];

  return (
    <div className="sheet active">
      <div className="section-header">📊 Dashboard</div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-xl font-bold mb-4 text-kinben-primary">Welcome to the Kinben KPN System</h3>
        <p className="text-gray-600 mb-4">
          This is your centralized management system for electronic components, PCBs, assemblies, and complete systems. 
          Use the tabs above to navigate between different categories and manage your inventory.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-kinben-primary mb-2">🔋 Components</h4>
            <p className="text-sm text-gray-600">
              Manage individual electronic components across 16 categories including capacitors, resistors, ICs, and more.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-kinben-primary mb-2">🔧 Assemblies</h4>
            <p className="text-sm text-gray-600">
              Track PCBAs, mechanical assemblies, and other sub-systems with full Bill of Materials support.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-kinben-primary mb-2">🏗️ Systems</h4>
            <p className="text-sm text-gray-600">
              Manage complete products and projects with hierarchical structure and version control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}