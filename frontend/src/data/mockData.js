// Realistic data to power the MVP before backend integration
export const books = [
    {
      _id: '1',
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      shelfNumber: 'A-12',
      category: 'Computer Science',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000',
      rating: 4.8
    },
    {
      _id: '2',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      shelfNumber: 'B-04',
      category: 'Algorithms',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000',
      rating: 4.9
    },
    {
      _id: '3',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      shelfNumber: 'A-08',
      category: 'Software Engineering',
      status: 'Reserved',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
      rating: 4.7
    },
    {
      _id: '4',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      shelfNumber: 'C-01',
      category: 'Software Engineering',
      status: 'Available',
      imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=1000',
      rating: 4.9
    },
    {
      _id: '5',
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      shelfNumber: 'D-15',
      category: 'AI & Data Science',
      status: 'Late',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000',
      rating: 4.6
    }
  ];
  
  export const features = [
    {
      title: "Smart Search",
      description: "Find books by title, shelf, or topic using our AI-enhanced search engine.",
      icon: "Search"
    },
    {
      title: "Instant Reservations",
      description: "Book your resources in seconds and pick them up at your convenience.",
      icon: "Clock"
    },
    {
      title: "Digital Tracking",
      description: "Keep track of due dates, fines, and history all in one dashboard.",
      icon: "Smartphone"
    }
  ];