export default function ARKWPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 返回首页
          </a>
          <h1 className="text-4xl font-bold mb-4 text-blue-600">ARKW 交易追踪</h1>
          <p className="text-xl text-gray-600">ARK Next Generation Internet ETF</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">交易数据概览</h2>
          <p className="text-gray-600">ARKW 交易数据即将上线...</p>
        </div>
      </div>
    </main>
  );
}