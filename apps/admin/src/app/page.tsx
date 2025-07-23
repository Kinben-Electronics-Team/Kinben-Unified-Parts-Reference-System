export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Kinben Admin Interface
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Administrative Dashboard</h2>
          <p className="text-gray-600 mb-6">
            This is the administrative interface for the Kinben Unified Parts Reference System.
            Use this interface to manage components, systems, assemblies, and user permissions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Component Management</h3>
              <p className="text-sm text-blue-600">Add, edit, and organize electronic components</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">System Management</h3>
              <p className="text-sm text-green-600">Manage product systems and assemblies</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Data Import/Export</h3>
              <p className="text-sm text-purple-600">Bulk operations and data migration tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}