const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Book = require('./models/Book');

dotenv.config();
connectDB();

const books = [
  {
    name: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    shelfNumber: 'A-12',
    category: 'Computer Science',
    status: 'Available',
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 0
  },
  {
    name: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    shelfNumber: 'B-04',
    category: 'Algorithms',
    status: 'Available',
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 0
  },
  {
    name: 'Design Patterns',
    author: 'Erich Gamma',
    shelfNumber: 'A-08',
    category: 'Software Engineering',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 0
  },
  {
    name: 'Clean Code',
    author: 'Robert C. Martin',
    shelfNumber: 'C-01',
    category: 'Software Engineering',
    status: 'Available',
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 0
  },
  {
    name: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    shelfNumber: 'D-15',
    category: 'AI & Data Science',
    status: 'Available', 
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 0
  }
];

const importData = async () => {
  try {
    await Book.deleteMany();
    await Book.insertMany(books);
    console.log('✅ Data Imported Successfully with STOCK!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();