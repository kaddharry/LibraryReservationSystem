const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Book = require('./models/Book');

dotenv.config();
connectDB();

const books = [
  // ─── Computer Science ───────────────────────────────────
  {
    name: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    shelfNumber: 'A-12',
    category: 'Computer Science',
    status: 'Available',
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 12
  },
  {
    name: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson',
    shelfNumber: 'A-14',
    category: 'Computer Science',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 5
  },

  // ─── Algorithms ─────────────────────────────────────────
  {
    name: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    shelfNumber: 'B-04',
    category: 'Algorithms',
    status: 'Available',
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 18
  },
  {
    name: 'Algorithm Design Manual',
    author: 'Steven Skiena',
    shelfNumber: 'B-07',
    category: 'Algorithms',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 8
  },

  // ─── Software Engineering ───────────────────────────────
  {
    name: 'Design Patterns: Elements of Reusable Software',
    author: 'Erich Gamma',
    shelfNumber: 'A-08',
    category: 'Software Engineering',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 15
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    shelfNumber: 'C-01',
    category: 'Software Engineering',
    status: 'Available',
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 22
  },
  {
    name: 'The Mythical Man-Month',
    author: 'Frederick Brooks',
    shelfNumber: 'C-03',
    category: 'Software Engineering',
    status: 'Available',
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 7
  },

  // ─── AI & Data Science ──────────────────────────────────
  {
    name: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    shelfNumber: 'D-15',
    category: 'AI & Data Science',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 20
  },
  {
    name: 'Deep Learning',
    author: 'Ian Goodfellow',
    shelfNumber: 'D-18',
    category: 'AI & Data Science',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 14
  },
  {
    name: 'Hands-On Machine Learning with Scikit-Learn',
    author: 'Aurélien Géron',
    shelfNumber: 'D-20',
    category: 'AI & Data Science',
    status: 'Available',
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 16
  },

  // ─── Databases ──────────────────────────────────────────
  {
    name: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    shelfNumber: 'E-02',
    category: 'Databases',
    status: 'Available',
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 11
  },
  {
    name: 'MongoDB: The Definitive Guide',
    author: 'Shannon Bradshaw',
    shelfNumber: 'E-05',
    category: 'Databases',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 9
  },

  // ─── Operating Systems ──────────────────────────────────
  {
    name: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    shelfNumber: 'F-01',
    category: 'Operating Systems',
    status: 'Available',
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 10
  },

  // ─── Networking ─────────────────────────────────────────
  {
    name: 'Computer Networking: A Top-Down Approach',
    author: 'James Kurose',
    shelfNumber: 'G-03',
    category: 'Networking',
    status: 'Available',
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1000',
    reservationCount: 6
  },
];

const importData = async () => {
  try {
    await Book.deleteMany();
    await Book.insertMany(books);
    console.log(`Data Imported! ${books.length} books seeded successfully.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();