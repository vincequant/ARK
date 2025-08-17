export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ARK 基金交易追踪器
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ARKK</h2>
            <p className="text-gray-600 mb-4">ARK Innovation ETF</p>
            <a 
              href="/arkk" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              查看详情
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ARKW</h2>
            <p className="text-gray-600 mb-4">ARK Next Generation Internet ETF</p>
            <a 
              href="/arkw" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              查看详情
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ARKG</h2>
            <p className="text-gray-600 mb-4">ARK Genomic Revolution ETF</p>
            <a 
              href="/arkg" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              查看详情
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ARKQ</h2>
            <p className="text-gray-600 mb-4">ARK Autonomous Technology & Robotics ETF</p>
            <a 
              href="/arkq" 
              className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              查看详情
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ARKF</h2>
            <p className="text-gray-600 mb-4">ARK Fintech Innovation ETF</p>
            <a 
              href="/arkf" 
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              查看详情
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">ARKX</h2>
            <p className="text-gray-600 mb-4">ARK Space Exploration & Innovation ETF</p>
            <a 
              href="/arkx" 
              className="inline-block bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              查看详情
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}