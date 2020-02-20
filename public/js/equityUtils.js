const chartSize = { width: 800, height: 600 };
const margin = { left: 100, right: 10, top: 20, bottom: 150 };
const width = chartSize.width - margin.left - margin.right;
const height = chartSize.height - margin.top - margin.bottom;

const Rs = d => `${d} ₹`;
const kCrRs = d => `${d / 1000}k Cr ₹`;
const Percent = d => `${d}%`;

const fieldFormat = {
  CMP: Rs,
  MarketCap: kCrRs,
  DivYld: Percent,
  ROCE: Percent,
  QNetProfit: kCrRs,
  QSales: kCrRs
};

const calculateAvg = numList => {
  const sum = numList.reduce((acc, val) => acc + val, 0);
  const avg = sum / numList.length;
  return avg;
};

const calculateSME = (quotes, index, sizeOfSlice) => {
  const start = index - sizeOfSlice + 1;
  const end = start + sizeOfSlice;
  const requiredPortion = quotes.slice(start, end);
  const closes = requiredPortion.map(q => q.Close);
  const avg = _.round(calculateAvg(closes));
  return avg;
};

const getOrDefaultSME = (quotes, currentQuote, index, sizeOfSlice) => {
  if (index < sizeOfSlice) {
    currentQuote.SME = 0;
  } else {
    currentQuote.SME = calculateSME(quotes, index, sizeOfSlice);
  }
  return currentQuote;
};

const insertSME = quotes => {
  const sizeOfSlice = 100;
  const newQuotes = quotes.map((quote, index) =>
    getOrDefaultSME(quotes, quote, index, sizeOfSlice)
  );
  return newQuotes;
};

const parse = ({ Date, Volume, AdjClose, ...rest }) => {
  _.forEach(rest, (v, k) => (rest[k] = +v));
  return { Date, ...rest };
};
