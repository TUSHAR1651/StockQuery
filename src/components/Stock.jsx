import React, { useState, useEffect } from 'react';
import data from './data.json';

const Stock = () => {
  const [Stocks, setStocks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 50;
  const [showNext, setshowNext] = useState(true);
  const [showPrev, setshowPrev] = useState(false);
  const [error, setError] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const arr = [
    "Market Capitalization",
    "P/E Ratio",
    "ROE",
    "Debt-to-Equity Ratio",
    "Dividend Yield",
    "Revenue Growth",
    "EPS Growth",
    "Current Ratio",
    "Gross Margin",
  ]

  const map = new Map([
    ["Market Capitalization (B)", false],
    ["P/E Ratio", false],
    ["ROE (%)", false],
    ["Debt-to-Equity Ratio", false],
    ["Dividend Yield (%)", false],
    ["Revenue Growth (%)", false],
    ["EPS Growth (%)", false],
    ["Current Ratio", false],
    ["Gross Margin (%)", false],
  ]);
  const [mp, setMap] = useState(map);

  // Load stocks data once
  useEffect(() => {
    setLoading(true);
    setStocks(data);
    setFilteredStocks(data); // Initialize filtered stocks with all stocks
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("Filtered Stocks Updated:", filteredStocks);
    // setFilteredStocks(filteredStocks);
  }, [filteredStocks]);

  // Handle search logic and update filteredStocks
  const handleSearch = () => {
    setLoading(true);
    // console.log("query", query);
    if (error !== '') {
      setError('');
    }
  
    // Split the query into conditions and parse each condition
    const conditions = query.split('AND').map(condition => {
      const parts = condition.trim().split(/\s*([<>=!]+)\s*/);
      if (parts.length !== 3) {
        setError("Enter a valid query in the format: 'Field Operator Value'");
        setLoading(false);
        return null; // Return null to indicate an invalid condition
      }
      
      const [field, operator, value] = parts;
      return [field.trim(), operator.trim(), value.trim()];
    }).filter(Boolean);

    
    console.log(conditions);
  
    // Validate the conditions
    const validFields = ['Market Capitalization', 'P/E Ratio', 'ROE', 'Debt-to-Equity Ratio', 'Dividend Yield', 'Revenue Growth', 'EPS Growth', 'Current Ratio', 'Gross Margin'];
    const m = new Map([
      ["Market Capitalization", "Market Capitalization (B)"],
      ["P/E Ratio", "P/E Ratio"],
      ["ROE", "ROE (%)"],
      ["Debt-to-Equity Ratio", "Debt-to-Equity Ratio"],
      ["Dividend Yield", "Dividend Yield (%)"],
      ["Revenue Growth", "Revenue Growth (%)"],
      ["EPS Growth", "EPS Growth (%)"],
      ["Current Ratio", "Current Ratio"],
      ["Gross Margin", "Gross Margin (%)"],
    ]
    )
    for (let i = 0; i < conditions.length; i++) {
      var [field, operator, value] = conditions[i];
      console.log(value);
      if (field === '' || operator === '' || value === '') {
        setError("Enter a valid query");
        setLoading(false);
        return;
      }
      if (!validFields.includes(field)) {
        setError(`Invalid field: ${field}. Please try again.`);
        setLoading(false);
        return;
      }
  
      if (!['>', '<', '=', '>=', '<='].includes(operator)) {
        setError(`Invalid operator: ${operator}. Please try again.`);
        setLoading(false);
        return;
      }
  
      if (isNaN(value)) {
        setError(`Invalid value: ${value}. Please try again.`);
        setLoading(false);
        return;
      }
    }
    
    // Uncomment the code for filtering stocks
    const filteredStocks = Stocks.filter(stock => {
      return conditions.every(([field, operator, value]) => {
        const stockValue = stock[m.get(field)]; // Directly access the field value from the stock
        // console.log(`Checking stock field: ${field}, operator: ${operator}, value: ${value}, stockValue: ${stockValue}`);
    
        if (stockValue === undefined || stockValue === null) return false; // Skip if field is missing
    
        // Perform the condition check based on operator
        switch (operator) {
          case '>':
            return stockValue > value;
          case '<':
            return stockValue < value;
          case '=':
            return stockValue === value;
          case '>=':
            return stockValue >= value;
          case '<=':
            return stockValue <= value;
          default:
            return false;
        }
      });
    });
    
    console.log('Filtered Stocks:', filteredStocks);
    
    
    setFilteredStocks(filteredStocks);
  
    setLoading(false);
  };
    

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedStocks = filteredStocks.slice(startIndex, endIndex);

  const loadMore = () => {
    if (currentPage < Math.ceil(filteredStocks.length / resultsPerPage)) {
      setCurrentPage(currentPage + 1);
      setshowPrev(true);
    }
    if (currentPage + 1 >= Math.ceil(filteredStocks.length / resultsPerPage)) {
      setshowNext(false);
    }
  };

  const loadPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setshowNext(true);
    }
    if (currentPage - 1 === 1) {
      setshowPrev(false);
    }
  };

  const handleSort = (key) => {
    const isAscending = mp.get(key);
    const sortedStocks = [...filteredStocks].sort((a, b) =>
      isAscending ? a[key] - b[key] : b[key] - a[key]
    );

    setFilteredStocks(sortedStocks);
    setMap((prevMap) => new Map(prevMap).set(key, !isAscending));
  };


  return (
    <div className="bg-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Stock Data</h1>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border text-left text-blue-500">Sno.</th>
                    <th className="py-2 px-4 border text-left text-blue-500">Ticker</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Market Capitalization (B)')}>Market Capitalization (B)</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('P/E Ratio')}>P/E Ratio</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('ROE (%)')}>ROE (%)</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Debt-to-Equity Ratio')}>Debt-to-Equity Ratio</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Dividend Yield (%)')}>Dividend Yield (%)</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Revenue Growth (%)')}>Revenue Growth (%)</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('EPS Growth (%)')}>EPS Growth (%)</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Current Ratio')}>Current Ratio</th>
                    <th className="py-2 px-4 border text-left text-blue-500" onClick={() => handleSort('Gross Margin (%)')}>Gross Margin (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStocks.length > 0 ? (
                    paginatedStocks.map((stock, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-gray-800`}>
                        <td className="py-2 px-4 border">{startIndex + index + 1}</td>
                        <td className="py-2 px-4 border text-blue-500">{stock.Ticker}</td>
                        <td className="py-2 px-4 border">{stock['Market Capitalization (B)']}</td>
                        <td className="py-2 px-4 border">{stock['P/E Ratio']}</td>
                        <td className="py-2 px-4 border">{stock['ROE (%)']}</td>
                        <td className="py-2 px-4 border">{stock['Debt-to-Equity Ratio']}</td>
                        <td className="py-2 px-4 border">{stock['Dividend Yield (%)']}</td>
                        <td className="py-2 px-4 border">{stock['Revenue Growth (%)']}</td>
                        <td className="py-2 px-4 border">{stock['EPS Growth (%)']}</td>
                        <td className="py-2 px-4 border">{stock['Current Ratio']}</td>
                        <td className="py-2 px-4 border">{stock['Gross Margin (%)']}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="py-2 px-4 border text-center text-gray-500">No matching stocks found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              <button onClick={loadPrev} disabled={!showPrev} className={`px-4 py-2 ${showPrev ? 'text-gray-600 hover:bg-gray-100 hover:text-blue-500' : 'text-gray-300 cursor-not-allowed'}`}>
                ← Previous
              </button>
              <button onClick={loadMore} disabled={!showNext} className={`px-4 py-2 ${showNext ? 'text-gray-600 hover:bg-gray-100 hover:text-blue-500' : 'text-gray-300 cursor-not-allowed'}`}>
                Next →
              </button>
            </div>
          </div>


          <div className="flex flex-col items-center mt-8 space-y-4 w-full">
            {/* Heading and paragraph */}
            <div className="w-full max-w-screen-xl mb-6">
              <h2 className="font-bold text-blue-800 text-[20px]">Search Query</h2>
              <p className="text-gray-700 mt-2 text-[17px]">You can customize your query below:</p>
            </div>

            {/* Error field */}
            {error && (
              <div className="w-full max-w-screen-xl mb-4 p-4 text-red-700 border border-red-500 rounded-lg">
                <p className="font-semibold">Error: {error}</p>
              </div>
            )}

            {/* Input field and DEMO Query */}
            <div className="flex w-full max-w-screen-xl space-x-2">
              <input
                type="text"
                placeholder="Search stocks by criteria..."
                className="w-2/3 h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-[25px]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="w-1/3 h-40 p-4 bg-yellow-100 text-blue-800 border border-yellow-300 rounded-lg shadow-md">
                <h3 className="font-semibold mb-2 text-[30px]">DEMO Query</h3>
                <p className="text-[19px]">Example: "Market Capitalization &gt; 50 AND P/E Ratio &lt; 20"</p>
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Run This Query
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Stock;
