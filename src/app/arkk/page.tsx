interface FundPageProps {
  fund: string;
  name: string;
  color: string;
}

function FundPage({ fund, name, color }: FundPageProps) {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← 返回首页
          </a>
          <h1 className="text-4xl font-bold mb-4" style={{ color }}>
            {fund} 交易追踪
          </h1>
          <p className="text-xl text-gray-600">{name}</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">交易数据概览</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">$125M</div>
              <div className="text-sm text-green-700">总买入</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">$89M</div>
              <div className="text-sm text-red-700">总卖出</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">+$36M</div>
              <div className="text-sm text-blue-700">净流入</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">近期交易</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">TSLA</span>
                  <span className="ml-2 text-gray-600">Tesla Inc</span>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">买入 $12.5M</div>
                  <div className="text-sm text-gray-500">2024-01-15</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">NVDA</span>
                  <span className="ml-2 text-gray-600">NVIDIA Corp</span>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-medium">卖出 $8.3M</div>
                  <div className="text-sm text-gray-500">2024-01-14</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">ROKU</span>
                  <span className="ml-2 text-gray-600">Roku Inc</span>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">买入 $6.7M</div>
                  <div className="text-sm text-gray-500">2024-01-13</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ARKKPage() {
  return (
    <FundPage 
      fund="ARKK" 
      name="ARK Innovation ETF" 
      color="#8b5cf6" 
    />
  );
}