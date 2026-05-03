const Book = require('../models/Book');
const Reservation = require('../models/Reservation');

// ──────────────────────────────────────────────────────────────────────
// SYNONYM MAP — Lightweight NLP layer
// Maps natural-language keywords & phrases to the vocabulary that
// actually appears in book titles, authors, and categories.
// This lets users type "coding" and still match "Programming", etc.
// ──────────────────────────────────────────────────────────────────────
const SYNONYM_MAP = {
  // Programming / CS fundamentals
  'coding':           ['programming', 'code', 'clean code', 'computer science'],
  'programming':      ['coding', 'code', 'programmer', 'computer science'],
  'code':             ['coding', 'programming', 'clean code'],
  'developer':        ['programming', 'software engineering', 'code'],
  'web':              ['web development', 'javascript', 'html', 'css', 'react'],
  'frontend':         ['web development', 'javascript', 'react', 'css'],
  'backend':          ['node', 'server', 'api', 'express', 'database'],

  // Data structures & Algorithms
  'dsa':              ['algorithms', 'data structures', 'sorting', 'graph'],
  'algo':             ['algorithms', 'data structures'],
  'algorithm':        ['algorithms', 'data structures', 'sorting'],
  'data structure':   ['algorithms', 'data structures', 'linked list', 'tree'],
  'sorting':          ['algorithms', 'quicksort', 'merge sort'],
  'leetcode':         ['algorithms', 'data structures', 'competitive programming'],

  // AI / ML / Data
  'ai':               ['artificial intelligence', 'machine learning', 'deep learning', 'ai & data science'],
  'ml':               ['machine learning', 'artificial intelligence', 'deep learning'],
  'machine learning': ['artificial intelligence', 'deep learning', 'neural network'],
  'deep learning':    ['machine learning', 'neural network', 'artificial intelligence'],
  'data science':     ['ai & data science', 'machine learning', 'statistics', 'data'],
  'data':             ['data science', 'database', 'sql', 'ai & data science'],

  // Databases
  'dbms':             ['database', 'sql', 'nosql', 'mongodb', 'relational'],
  'database':         ['dbms', 'sql', 'nosql', 'data'],
  'sql':              ['database', 'dbms', 'query', 'relational'],
  'mongodb':          ['nosql', 'database', 'dbms'],

  // Software Engineering
  'design pattern':   ['design patterns', 'software engineering', 'architecture'],
  'clean':            ['clean code', 'refactoring', 'software engineering'],
  'architecture':     ['design patterns', 'system design', 'software engineering'],
  'system design':    ['architecture', 'scalability', 'software engineering'],
  'testing':          ['software engineering', 'unit test', 'quality'],

  // Operating Systems / Networking
  'os':               ['operating system', 'operating systems', 'linux', 'kernel'],
  'operating system': ['os', 'linux', 'process', 'kernel'],
  'network':          ['networking', 'tcp', 'http', 'socket', 'computer network'],
  'networking':       ['network', 'tcp', 'http', 'computer network'],

  // General
  'book':             ['programming', 'computer science'],
  'suggest':          [],
  'recommend':        [],
  'best':             [],
  'good':             [],
  'popular':          [],
  'beginner':         ['introduction', 'basics', 'fundamentals'],
  'intro':            ['introduction', 'basics', 'fundamentals'],
  'advanced':         ['deep', 'expert', 'mastery'],
};


// ──────────────────────────────────────────────────────────────────────
// expandQuery  — takes a raw user query and produces a flat list of
//                search tokens after synonym expansion
// ──────────────────────────────────────────────────────────────────────
const expandQuery = (rawQuery) => {
  const words = rawQuery.toLowerCase().trim().split(/\s+/);
  const expanded = new Set(words);                       // always include originals

  // Also try multi-word matches ("data structure", "design pattern")
  const fullPhrase = rawQuery.toLowerCase().trim();
  if (SYNONYM_MAP[fullPhrase]) {
    SYNONYM_MAP[fullPhrase].forEach(s => expanded.add(s));
  }

  // Individual word expansion
  words.forEach(word => {
    expanded.add(word);
    if (SYNONYM_MAP[word]) {
      SYNONYM_MAP[word].forEach(syn => expanded.add(syn));
    }
  });

  // Remove noise words that don't help search
  const stopwords = ['suggest', 'recommend', 'give', 'me', 'want', 'a', 'for',
                     'some', 'books', 'book', 'about', 'on', 'the', 'i', 'need',
                     'show', 'find', 'get', 'best', 'good', 'popular', 'please',
                     'can', 'you', 'any', 'related', 'to'];
  stopwords.forEach(w => expanded.delete(w));

  return [...expanded].filter(Boolean);
};


// ──────────────────────────────────────────────────────────────────────
// scoreBook  — given a book document and the expanded token list,
//              return a relevance score (higher = better match)
// ──────────────────────────────────────────────────────────────────────
const scoreBook = (book, tokens) => {
  let score = 0;
  const name      = (book.name || '').toLowerCase();
  const author    = (book.author || '').toLowerCase();
  const category  = (book.category || '').toLowerCase();
  const shelf     = (book.shelfNumber || '').toLowerCase();

  tokens.forEach(token => {
    // Title matches are most valuable
    if (name.includes(token))     score += 10;
    // Category match is very relevant
    if (category.includes(token)) score += 8;
    // Author match
    if (author.includes(token))   score += 5;
    // Shelf match (exact or partial)
    if (shelf.includes(token))    score += 3;
  });

  // Boost popular books (frequently reserved) — lightweight popularity signal
  score += Math.min(book.reservationCount || 0, 5);

  return score;
};


// ──────────────────────────────────────────────────────────────────────
// @desc    AI-powered book recommendation from user query
// @route   POST /api/books/ask-ai
// @access  Public
// ──────────────────────────────────────────────────────────────────────
const askAI = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Please enter a query to get recommendations.' });
    }

    // 1. Expand user query with synonyms
    const tokens = expandQuery(query);

    // 2. Fetch only AVAILABLE books from database
    const availableBooks = await Book.find({ status: 'Available' });

    if (availableBooks.length === 0) {
      return res.json({
        query,
        tokens,
        books: [],
        message: 'No books are currently available in the library.'
      });
    }

    // 3. Score each book against expanded tokens
    const scored = availableBooks.map(book => ({
      book,
      score: scoreBook(book, tokens)
    }));

    // 4. Filter out zero-score (completely irrelevant) and sort by score desc
    const relevant = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)                         // top 5 results
      .map(s => s.book);

    // 5. Build a human-readable explanation
    let message = '';
    if (relevant.length === 0) {
      message = 'No matching books found for your query. Try different keywords like "algorithms", "AI", "clean code", etc.';
    } else if (relevant.length === 1) {
      message = `Found 1 book matching "${query}".`;
    } else {
      message = `Found ${relevant.length} books matching "${query}".`;
    }

    res.json({
      query,
      tokens,
      books: relevant,
      message
    });

  } catch (error) {
    console.error('AI Recommendation Error:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};


// ──────────────────────────────────────────────────────────────────────
// @desc    Automatic recommendations for logged-in user
//          (personal = based on past reservation categories,
//           trending = most reserved books overall)
// @route   GET /api/books/recommendations
// @access  Private
// ──────────────────────────────────────────────────────────────────────
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get user's past reservations to find their preferred categories
    const userReservations = await Reservation.find({ userId }).populate('bookId');
    const reservedBookIds = userReservations.map(r => r.bookId?._id?.toString()).filter(Boolean);

    // Count category preferences from user's reservation history
    const categoryCount = {};
    userReservations.forEach(r => {
      if (r.bookId && r.bookId.category) {
        categoryCount[r.bookId.category] = (categoryCount[r.bookId.category] || 0) + 1;
      }
    });

    // Sort to find the user's most-read category
    const sortedCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a);

    // 2. Try personal recommendations first
    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0][0];

      const personalRecs = await Book.find({
        status: 'Available',
        category: topCategory,
        _id: { $nin: reservedBookIds }     // exclude books already reserved
      })
        .sort({ reservationCount: -1 })
        .limit(4);

      if (personalRecs.length > 0) {
        return res.json({
          type: 'personal',
          category: topCategory,
          books: personalRecs
        });
      }
    }

    // 3. Fallback — trending (most reserved available books)
    const trending = await Book.find({
      status: 'Available',
      _id: { $nin: reservedBookIds }
    })
      .sort({ reservationCount: -1 })
      .limit(4);

    return res.json({
      type: 'trending',
      category: 'Popular',
      books: trending
    });

  } catch (error) {
    console.error('Recommendation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { askAI, getRecommendations };
