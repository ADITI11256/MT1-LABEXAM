import express from "express";

const app = express();

app.use(express.json());


let books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 350,
    category: "Fiction",
  },
  {
    id: 2,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 400,
    category: "Finance",
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 550,
    category: "Programming",
  },
];
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// 2. GET BOOK BY ID
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  res.status(200).json(book);
});


app.post("/books", (req, res) => {
  const { id, title, author, price, category } = req.body;

  if (
    id === undefined ||
    !title ||
    !author ||
    price === undefined ||
    price === null
  ) {
    return res.status(400).json({
      message: "All required fields must be provided",
    });
  }

  if (books.some((b) => b.id === Number(id))) {
    return res.status(400).json({
      message: "Book ID already exists",
    });
  }

  const newBook = {
    id: Number(id),
    title,
    author,
    price,
    category,
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook,
  });
});


app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  const { title, author, price, category } = req.body;

  if (
    title === undefined ||
    author === undefined ||
    price === undefined ||
    category === undefined
  ) {
    return res.status(400).json({
      message: "Provide title, author, price and category",
    });
  }

  books[index] = {
    id,
    title,
    author,
    price,
    category,
  };

  res.status(200).json({
    message: "Book updated successfully",
    book: books[index],
  });
});


app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  const deletedBook = books.splice(index, 1);

  res.status(200).json({
    message: "Book deleted successfully",
    book: deletedBook[0],
  });
});


app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
