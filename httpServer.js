import http from "http";
import fs from "fs";

let books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 350,
  },
  {
    id: 2,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 400,
  },
];

const server = http.createServer((req, res) => {
  // ROUTE 1: HOME PAGE
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Library Management System</h1>");
  }

  // ROUTE 2: GET ALL BOOKS
  else if (req.url === "/books" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(books));
  }

  // ROUTE 3: ABOUT
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Library Book Management Application</h1>");
  }

  // ROUTE 4: SERVE HTML USING FS
  else if (req.url === "/home" && req.method === "GET") {
    fs.readFile("./public/index.html", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Error reading HTML file");
      } else {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });
        res.end(data);
      }
    });
  }

  // ROUTE 5: ADD BOOK USING POST
  else if (req.url === "/add-book" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newBook = JSON.parse(body);

        if (
          newBook.id === undefined ||
          !newBook.title ||
          !newBook.author ||
          newBook.price === undefined ||
          newBook.price === null
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              message: "All fields are required",
            }),
          );
          return;
        }

        books.push(newBook);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Book added successfully",
            book: newBook,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            message: "Invalid JSON data",
          }),
        );
      }
    });
  }

  // INVALID ROUTE
  else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    res.end("404 Page Not Found");
  }
});

// START SERVER
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
