export interface Comment {
  id: string;
  text: string;
  product: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  date: string;
  likes: number;
}

export interface Product {
  id: string;
  name: string;
  mentions: number;
  positive: number;
  neutral: number;
  negative: number;
  keywords: string[];
  trend: { date: string; positive: number; negative: number; neutral: number }[];
}

export interface Insight {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: "success" | "warning" | "danger" | "info";
}

export const comments: Comment[] = [
  { id: "1", text: "ស្អាតណាស់ ខ្ញុំចូលចិត្ត 😍", product: "Summer Dress", sentiment: "positive", score: 0.92, date: "2024-01-15", likes: 24 },
  { id: "2", text: "ថ្លៃពេក មិនសមនឹងតម្លៃ", product: "Laptop Bag", sentiment: "negative", score: 0.18, date: "2024-01-14", likes: 3 },
  { id: "3", text: "ដឹកយូរពេកហើយ មិនទាន់មកដល់", product: "Samsung S23", sentiment: "negative", score: 0.12, date: "2024-01-14", likes: 7 },
  { id: "4", text: "quality laor nas នឹងទិញទៀត", product: "Wireless Earphones", sentiment: "positive", score: 0.88, date: "2024-01-13", likes: 15 },
  { id: "5", text: "battery ot sok bonthe 😤", product: "iPhone 15", sentiment: "negative", score: 0.15, date: "2024-01-13", likes: 11 },
  { id: "6", text: "shipping លឿនណាស់ អរគុណ", product: "Running Shoes", sentiment: "positive", score: 0.95, date: "2024-01-12", likes: 19 },
  { id: "7", text: "ពណ៌ស្អាត ពេញចិត្ត", product: "Sunglasses", sentiment: "positive", score: 0.85, date: "2024-01-12", likes: 8 },
  { id: "8", text: "Design ល្អ តែ price ថ្លៃ", product: "Watch", sentiment: "neutral", score: 0.52, date: "2024-01-11", likes: 5 },
  { id: "9", text: "ទិញពីរដង ពេញចិត្តណាស់", product: "Coffee Maker", sentiment: "positive", score: 0.91, date: "2024-01-11", likes: 22 },
  { id: "10", text: "Size មិនត្រូវ ត្រូវ return", product: "Summer Dress", sentiment: "negative", score: 0.2, date: "2024-01-10", likes: 4 },
  { id: "11", text: "Best phone ever! ចូលចិត្តណាស់", product: "iPhone 15", sentiment: "positive", score: 0.93, date: "2024-01-10", likes: 31 },
  { id: "12", text: "Sound quality ល្អ for the price", product: "Wireless Earphones", sentiment: "positive", score: 0.82, date: "2024-01-09", likes: 14 },
  { id: "13", text: "មិនប្រើបានទេ ខូចក្នុង 1 week", product: "Backpack", sentiment: "negative", score: 0.08, date: "2024-01-09", likes: 9 },
  { id: "14", text: "Color ស្អាតណាស់ recommend!", product: "Running Shoes", sentiment: "positive", score: 0.89, date: "2024-01-08", likes: 17 },
  { id: "15", text: "Camera ល្អ តែ battery ធម្មតា", product: "Samsung S23", sentiment: "neutral", score: 0.55, date: "2024-01-08", likes: 6 },
  { id: "16", text: "Perfect gift! ម៉ែខ្ញុំចូលចិត្ត", product: "Coffee Maker", sentiment: "positive", score: 0.94, date: "2024-01-07", likes: 28 },
  { id: "17", text: "តម្លៃសមរម្យ quality ok", product: "Backpack", sentiment: "neutral", score: 0.58, date: "2024-01-07", likes: 3 },
  { id: "18", text: "Fast delivery! 2 days only 🚀", product: "iPhone 15", sentiment: "positive", score: 0.9, date: "2024-01-06", likes: 20 },
  { id: "19", text: "Screen ធំ ល្អសម្រាប់មើល video", product: "Samsung S23", sentiment: "positive", score: 0.83, date: "2024-01-06", likes: 12 },
  { id: "20", text: "ចង់បាន more colors", product: "Summer Dress", sentiment: "neutral", score: 0.5, date: "2024-01-05", likes: 10 },
];

export const products: Product[] = [
  {
    id: "1", name: "iPhone 15", mentions: 48, positive: 65, neutral: 15, negative: 20,
    keywords: ["battery", "camera", "fast delivery", "expensive", "quality"],
    trend: [
      { date: "Jan 1", positive: 8, negative: 3, neutral: 2 },
      { date: "Jan 5", positive: 10, negative: 2, neutral: 1 },
      { date: "Jan 10", positive: 12, negative: 4, neutral: 3 },
      { date: "Jan 15", positive: 9, negative: 3, neutral: 2 },
    ],
  },
  {
    id: "2", name: "Samsung S23", mentions: 35, positive: 55, neutral: 25, negative: 20,
    keywords: ["screen", "camera", "shipping slow", "battery", "value"],
    trend: [
      { date: "Jan 1", positive: 5, negative: 3, neutral: 3 },
      { date: "Jan 5", positive: 7, negative: 2, neutral: 4 },
      { date: "Jan 10", positive: 8, negative: 4, neutral: 2 },
      { date: "Jan 15", positive: 6, negative: 3, neutral: 3 },
    ],
  },
  {
    id: "3", name: "Summer Dress", mentions: 42, positive: 72, neutral: 18, negative: 10,
    keywords: ["beautiful", "colors", "size issue", "quality", "style"],
    trend: [
      { date: "Jan 1", positive: 9, negative: 1, neutral: 2 },
      { date: "Jan 5", positive: 11, negative: 2, neutral: 3 },
      { date: "Jan 10", positive: 13, negative: 1, neutral: 2 },
      { date: "Jan 15", positive: 10, negative: 2, neutral: 1 },
    ],
  },
  {
    id: "4", name: "Wireless Earphones", mentions: 29, positive: 80, neutral: 12, negative: 8,
    keywords: ["sound quality", "price", "comfortable", "bass", "wireless"],
    trend: [
      { date: "Jan 1", positive: 7, negative: 1, neutral: 1 },
      { date: "Jan 5", positive: 9, negative: 1, neutral: 2 },
      { date: "Jan 10", positive: 8, negative: 1, neutral: 1 },
      { date: "Jan 15", positive: 10, negative: 0, neutral: 1 },
    ],
  },
  {
    id: "5", name: "Running Shoes", mentions: 38, positive: 85, neutral: 10, negative: 5,
    keywords: ["comfortable", "fast shipping", "color", "durable", "fit"],
    trend: [
      { date: "Jan 1", positive: 10, negative: 0, neutral: 1 },
      { date: "Jan 5", positive: 12, negative: 1, neutral: 1 },
      { date: "Jan 10", positive: 11, negative: 1, neutral: 2 },
      { date: "Jan 15", positive: 13, negative: 0, neutral: 1 },
    ],
  },
  {
    id: "6", name: "Backpack", mentions: 22, positive: 40, neutral: 25, negative: 35,
    keywords: ["broke quickly", "cheap", "design ok", "zipper issue", "size"],
    trend: [
      { date: "Jan 1", positive: 3, negative: 3, neutral: 2 },
      { date: "Jan 5", positive: 2, negative: 4, neutral: 2 },
      { date: "Jan 10", positive: 4, negative: 3, neutral: 1 },
      { date: "Jan 15", positive: 2, negative: 5, neutral: 2 },
    ],
  },
  {
    id: "7", name: "Coffee Maker", mentions: 31, positive: 88, neutral: 8, negative: 4,
    keywords: ["perfect gift", "quality", "easy to use", "great taste", "recommend"],
    trend: [
      { date: "Jan 1", positive: 8, negative: 0, neutral: 1 },
      { date: "Jan 5", positive: 9, negative: 1, neutral: 1 },
      { date: "Jan 10", positive: 10, negative: 0, neutral: 0 },
      { date: "Jan 15", positive: 11, negative: 0, neutral: 1 },
    ],
  },
  {
    id: "8", name: "Watch", mentions: 18, positive: 60, neutral: 25, negative: 15,
    keywords: ["design", "expensive", "looks good", "battery life", "strap"],
    trend: [
      { date: "Jan 1", positive: 4, negative: 1, neutral: 2 },
      { date: "Jan 5", positive: 5, negative: 1, neutral: 1 },
      { date: "Jan 10", positive: 4, negative: 2, neutral: 2 },
      { date: "Jan 15", positive: 5, negative: 1, neutral: 1 },
    ],
  },
];

export const sentimentOverTime = [
  { date: "Jan 1", positive: 45, neutral: 20, negative: 15 },
  { date: "Jan 3", positive: 52, neutral: 18, negative: 12 },
  { date: "Jan 5", positive: 48, neutral: 22, negative: 18 },
  { date: "Jan 7", positive: 61, neutral: 15, negative: 10 },
  { date: "Jan 9", positive: 55, neutral: 19, negative: 14 },
  { date: "Jan 11", positive: 67, neutral: 16, negative: 11 },
  { date: "Jan 13", positive: 58, neutral: 21, negative: 16 },
  { date: "Jan 15", positive: 72, neutral: 14, negative: 9 },
];

export const insights: Insight[] = [
  { id: "1", icon: "📦", title: "Shipping complaints increasing", description: "Consider partnering with a faster courier service. 23% of negative comments mention slow delivery.", type: "warning" },
  { id: "2", icon: "💰", title: "Price sensitivity detected", description: "Electronics category shows high price sensitivity. Consider running promotions or bundle deals.", type: "warning" },
  { id: "3", icon: "⭐", title: "Running Shoes: 95% satisfaction", description: "Feature this product in your next campaign. Customers love the comfort and fast shipping.", type: "success" },
  { id: "4", icon: "🔄", title: "More colors requested", description: "Customers are asking for more color options in the Summer Dress category. Top requested: navy, burgundy.", type: "info" },
  { id: "5", icon: "🔧", title: "Backpack quality concerns", description: "35% negative feedback on Backpack. Main issues: zipper breaking, material quality. Consider supplier change.", type: "danger" },
  { id: "6", icon: "🎯", title: "Coffee Maker is a hidden gem", description: "88% positive with strong gift-buying intent. Perfect for holiday season promotion.", type: "success" },
];

export const trendingTopics = [
  { word: "quality", count: 89, sentiment: "positive" as const },
  { word: "shipping", count: 67, sentiment: "neutral" as const },
  { word: "battery", count: 54, sentiment: "negative" as const },
  { word: "price", count: 48, sentiment: "neutral" as const },
  { word: "comfortable", count: 43, sentiment: "positive" as const },
  { word: "beautiful", count: 41, sentiment: "positive" as const },
  { word: "expensive", count: 38, sentiment: "negative" as const },
  { word: "fast delivery", count: 35, sentiment: "positive" as const },
  { word: "camera", count: 32, sentiment: "positive" as const },
  { word: "broke", count: 28, sentiment: "negative" as const },
  { word: "recommend", count: 26, sentiment: "positive" as const },
  { word: "size issue", count: 22, sentiment: "negative" as const },
  { word: "gift", count: 20, sentiment: "positive" as const },
  { word: "design", count: 19, sentiment: "positive" as const },
  { word: "color", count: 17, sentiment: "neutral" as const },
];
