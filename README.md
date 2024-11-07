# Stock Filtering App

## Features
- Filter stocks based on various financial metrics
- Sort columns in the stock table
- Pagination support
- Example query formatting

## Tech Stack
- React
- React Router
- Recharts
- Tailwind CSS

## Installation

1. **Install dependencies**
Make sure you have Node.js installed. Then, install the required dependencies:

```bash
npm install
```

2. **Run the application**
Once the dependencies are installed, run the development server:
```bash
npm start
```

Your app should now be running at http://localhost:3000.



### Filter Stocks: 
Enter filter criteria using the "Search Query" text field.
Sort Columns: Click on any of the column headers in the table to sort the data.
Pagination: Use the "Previous" and "Next" buttons to navigate between pages.
Demo Query: View an example of how to format a query by clicking on the 'DEMO Query' section.
I have used the data in the JSON format for the ease.

#### Example Query:

Example: "Market Capitalization > 50 AND P/E Ratio < 20"
This query will filter stocks that have a market capitalization greater than 50 and a P/E ratio less than 20.

#### Writing a Query:
The query syntax follows the pattern of "Parameter Comparison Value" where:

- The query should be in parameter operator and value format and also you can use the AND for the more the one conditions.
- The parameter should be written with a valid spelling.
- The query support these operators only


  &gt; (greater than)
  
  <  (less than)

  =  (equal to)

  &gt;= (greater than or equal to)
  
  <= (less than or equal to)

#### Parameters
- Market Capitalization
- P/E Ratio
- ROE
- Debt-to-Equity Ratio
- Dividend Yield
- Revenue Growth
- EPS Growth
- Current Ratio
- Gross Margin
  

Value is the number to compare with (e.g., 50, 20).

