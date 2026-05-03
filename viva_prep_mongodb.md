# 🎓 Viva Prep: MongoDB Atlas + Backend — Smart Library Reservation System

> **Mode:** Structured Revision → Viva Questions (answer one by one)
> All content is tied to YOUR actual code, not generic theory.

---

## ⚡ PART 1 — 2-Minute Rapid Revision (Read this before the viva)

### 1.1 MongoDB Atlas Architecture (What's actually behind your URI)

Your `MONGO_URI` starts with `mongodb+srv://` — here's what that means end-to-end:

**Atlas Cluster = 3-Node Replica Set**
```
Primary Node   ← All writes go here
Secondary #1   ← Replicates from Primary (async)
Secondary #2   ← Replicates from Primary (async)
```
- **SRV URI (`mongodb+srv://`)** → DNS SRV record lookup → resolves to all 3 node hostnames automatically. You don't hardcode IPs. If Atlas shifts nodes, DNS updates — your app reconnects transparently.
- **Mongos Router** (in sharded clusters) routes queries. For your M0 free cluster, it's a replica set without sharding — the primary handles all writes, secondaries serve reads if read preference is set.

**What `mongoose.connect(process.env.MONGO_URI)` does (your `db.js` line 5):**
1. Parses the SRV URI → performs DNS lookup for node list
2. Establishes a **connection pool** (default: 5 connections, configurable)
3. Performs a handshake with the Primary node (SCRAM-SHA-256 auth)
4. Monitors topology continuously (heartbeats every 10s)
5. On success: `conn.connection.host` is logged (line 6 in your `db.js`)

**If Atlas drops:** Mongoose enters reconnect mode automatically — it does NOT crash unless you set `serverSelectionTimeoutMS` too low. Your current code calls `process.exit(1)` only on the **initial** connect failure (catch block, line 8-9), not on mid-run disconnects.

---

### 1.2 Complete Request Lifecycle (Your exact flow)

**Example: User searches for "Python" books**

```
React (BookList component)
  → axios.get('/api/books?keyword=Python')
    → Express Router (bookRoutes.js): GET /api/books → getBooks
      → bookController.js:
          query = { $text: { $search: "Python" } }
          Book.find(query).sort({ createdAt: -1 })
        → Mongoose serializes to MongoDB Wire Protocol (OP_MSG)
          → Sent over TLS to Atlas Primary
            → Atlas: hits text index on {name, shelfNumber, author, category}
              → Returns matching BSON documents
            ← Mongoose deserializes BSON → JS objects
          ← Express: res.json(books)
        ← Axios receives JSON
      ← React renders book cards
```

**For protected routes (reservations):**
```
React → axios with { headers: { Authorization: 'Bearer <JWT>' } }
  → authMiddleware.js:
      jwt.verify(token) → decoded.id
      User.findById(decoded.id).select('-password') → req.user
  → reservationController.js runs with req.user populated
```

---

### 1.3 Your 3 Collections — Exact Schema Design

#### `users` collection
```js
{ name, rollNumber (unique index), branch, password (bcrypt hashed), fines, timestamps }
```
- `unique: true` on `rollNumber` → Mongoose creates a **unique B-Tree index** in MongoDB
- Password never stored in plaintext — `pre('save')` hook hashes it (bcrypt, 10 salt rounds)
- `select('-password')` in middleware ensures password never leaks in JWT-decoded user

#### `books` collection
```js
{ name (single field index), author, shelfNumber, category, imageUrl, status, stock, reservationCount, timestamps }
```
- **Text index** on `{ name, shelfNumber, author, category }` → compound text index
- `stock` field is the source of truth for availability — `status` is derived from it
- `reservationCount` tracks popularity (used for "most reserved" sorting)

#### `reservations` collection
```js
{ userId (ObjectId → users), bookId (ObjectId → books), reservationDate, deadlineDate, returnDate, status, timestamps }
```
- **No JOIN** — ObjectId references + `.populate('bookId')` does a second query internally
- When returned: **document is deleted** (hard delete, not soft delete) — by design
- Active reservation count = `Reservation.countDocuments({ userId })` — works because returned = deleted

---

### 1.4 Text Index — How It Actually Works

Your `Book.js` line 43:
```js
bookSchema.index({ name: 'text', shelfNumber: 'text', author: 'text', category: 'text' });
```

**Internally:**
1. MongoDB tokenizes all text fields → stems words (e.g., "running" → "run")
2. Builds an **inverted index**: `word → [docId, score, position]`
3. When you query `$text: { $search: "Python" }`:
   - MongoDB hits inverted index directly → O(log n) lookup
   - Returns docs with relevance score
4. **vs. Regex scan** (`$regex: /python/i`): Scans EVERY document — O(n) — no index used
5. **vs. Single field index**: A single field index (B-Tree) on `name` only — doesn't search author/category simultaneously

**B-Tree index on `rollNumber`:**
- Balanced tree structure, O(log n) lookup
- MongoDB auto-creates it when `unique: true` is set
- Ensures uniqueness at the storage engine level (WiredTiger) — not just Mongoose validation

---

### 1.5 Atomicity Concern (THE MOST IMPORTANT WEAKNESS)

Your `createReservation` function does these steps **separately**:
```
Step 1: countDocuments (check limit)
Step 2: findOne (check duplicate)
Step 3: findById (check stock)
Step 4: Reservation.create()
Step 5: book.save() (decrement stock)
```

**⚠️ This is NOT atomic.** There is a race condition window between Step 3 and Step 5.

**The proper fix** would be `findOneAndUpdate` with atomic operators:
```js
Book.findOneAndUpdate(
  { _id: bookId, stock: { $gt: 0 } },
  { $inc: { stock: -1 } },
  { new: true }
)
```
This either decrements OR fails — in a single atomic operation. Be honest about this in the viva.

---

### 1.6 Atlas UI Queries (Shell-style, ready to use)

**Find a user by rollNumber:**
```js
db.users.findOne({ rollNumber: "22BCE1234" })
```

**Find all available books:**
```js
db.books.find({ status: "Available" }).pretty()
```

**Text search (simulates your search endpoint):**
```js
db.books.find({ $text: { $search: "Python" } }, { score: { $meta: "textScore" } })
         .sort({ score: { $meta: "textScore" } })
```

**Insert a book:**
```js
db.books.insertOne({
  name: "Clean Code",
  author: "Robert Martin",
  shelfNumber: "CS-05",
  category: "Programming",
  imageUrl: "https://example.com/img.jpg",
  status: "Available",
  stock: 5,
  reservationCount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Update stock (return a book):**
```js
db.books.updateOne(
  { _id: ObjectId("...book_id...") },
  { $inc: { stock: 1 }, $set: { status: "Available" } }
)
```

**Delete a reservation:**
```js
db.reservations.deleteOne({ _id: ObjectId("...reservation_id...") })
```

**Count active reservations for a user:**
```js
db.reservations.countDocuments({ userId: ObjectId("...user_id...") })
```

**Find reservations with book details (simulates .populate()):**
```js
db.reservations.aggregate([
  { $match: { userId: ObjectId("...user_id...") } },
  { $lookup: {
      from: "books",
      localField: "bookId",
      foreignField: "_id",
      as: "book"
  }},
  { $unwind: "$book" }
])
```

---

## 🔥 PART 2 — VIVA MODE (18 Questions)

> **Instructions for you:** Answer each question one at a time. Type your answer. I will evaluate it critically and give the ideal answer.

---

**Q1.** Your `db.js` calls `mongoose.connect(process.env.MONGO_URI)`. What exactly happens between that line executing and the `console.log("MongoDB Connected: ...")` printing? Walk me through every step.

---

**Q2.** You used `mongodb+srv://` in your connection string. If I replace it with `mongodb://` and hardcode one node's IP, what breaks and why?

---

**Q3.** Look at your `bookController.js`. When a user searches for "Python programming", your code builds `query = { $text: { $search: "Python programming" } }`. How does MongoDB process this query internally? What data structure does it hit?

---

**Q4.** Your `Book.js` has both a **single field index** on `name` (line 7) AND a **compound text index** on `{ name, shelfNumber, author, category }` (line 43). Are these redundant? Does the single field index on `name` even help your text search? Explain.

---

**Q5.** Explain exactly what `.populate('bookId')` does in your `getReservations` controller. How many database round-trips does it make? Is this efficient?

---

**Q6.** Two users click "Reserve" on the last copy of a book (stock = 1) at the exact same millisecond. Walk through your `createReservation` code and tell me what happens. Is there a bug?

---

**Q7.** Why did you choose to **delete** the reservation document on return instead of updating its status to "Returned"? What are the trade-offs of this design decision?

---

**Q8.** Your `authMiddleware.js` does `User.findById(decoded.id).select('-password')` on EVERY protected request. How many DB queries does a "Reserve Book" request make in total from start to finish? List them all.

---

**Q9.** Your `rollNumber` field has `unique: true`. Is this uniqueness enforced by Mongoose, by MongoDB, or by both? What happens if two requests to register the same rollNumber arrive simultaneously?

---

**Q10.** Why did you use MongoDB (NoSQL) instead of SQL (PostgreSQL/MySQL) for this project? Give me 3 concrete reasons tied to your schema, not generic MongoDB benefits.

---

**Q11.** If the connection to MongoDB Atlas drops mid-request (e.g., during `book.save()`), what happens? Does your app crash? What does the user see? How would you handle this properly?

---

**Q12.** Your `Reservation` model uses `mongoose.Schema.Types.ObjectId` with `ref: 'User'`. MongoDB does NOT enforce foreign key constraints. What happens if a user document is deleted from `users` collection but their reservations remain? How would you handle this?

---

**Q13.** Explain the exact MongoDB wire protocol message that gets sent when Mongoose executes `Book.find({ $text: { $search: "Python" } })`. You don't need to know binary format — explain conceptually what the OP_MSG contains.

---

**Q14.** Your `createReservation` calls `Reservation.countDocuments({ userId: req.user._id })` to enforce the 2-book limit. Is this the most efficient way? What index, if any, does this query use?

---

**Q15.** Your `Book.js` has a `status` field with enum `['Available', 'Reserved', 'Unavailable']`. But `stock` is also there. Are these two fields always in sync? Can they get out of sync? When?

---

**Q16.** In Atlas, if I go to the Collections tab and manually update a book's stock to -1, what happens to your application? Does your code handle negative stock?

---

**Q17.** Your passwords are hashed with `bcrypt.genSalt(10)`. What does the `10` mean? If you change it to `15`, what changes? Is there any downside?

---

**Q18.** Explain the difference between your `returnBooks` endpoint using `findByIdAndDelete(id)` vs using `deleteMany({ userId: req.user._id })`. When would each be appropriate?

---

## 📌 Quick Reference Card (For last 5 mins before viva)

| Concept | Your Code Location | Key Point |
|---|---|---|
| DB Connect | `config/db.js` line 5 | `mongoose.connect()` with SRV URI |
| Text Index | `models/Book.js` line 43 | 4-field compound text index |
| Unique Index | `models/User.js` line 12 | `rollNumber: unique: true` |
| Auth Flow | `middleware/authMiddleware.js` | JWT verify → User.findById |
| Race Condition | `controllers/reservationController.js` lines 47-74 | Non-atomic stock check + decrement |
| Populate | `controllers/reservationController.js` line 11 | Fetches book details via 2nd query |
| Hard Delete | `controllers/reservationController.js` line 111 | `findByIdAndDelete` removes history |
| ObjectId Ref | `models/Reservation.js` lines 5,10 | No FK enforcement by MongoDB |
| BSON | Wire Protocol | MongoDB stores/transmits binary JSON |
| Connection Pool | Mongoose default | 5 connections reused per pool |

---

> **HOW TO USE THIS DOC IN VIVA MODE:**
> Reply with your answer to Q1. I will evaluate it and give the next question only after correction.
