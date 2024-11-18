import React, { useState, useEffect } from "react";
import axios from "axios";

const Books = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [data, setData] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [editingBookId, setEditingBookId] = useState(null); // Track which book is being edited

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/books/");
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBook();
  }, []);

  // Adding a book
  const addBooks = async () => {
    const bookData = { title, price };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/books/create/",
        bookData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setData((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
    }
    setTitle("");
    setPrice("");
  };

  // Update a book
  const updateTitle = async (pk, price) => {
    const bookData = { title: newTitle, price };

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/books/${pk}/`,
        bookData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setData((prev) =>
        prev.map((book) => {
          if (book.id === pk) {
            return res.data;
          } else {
            return book;
          }
        })
      );
      setEditingBookId(null); // Close the input field after updating
    } catch (err) {
      console.log(err);
    }
  };

  // Delete a book
  const toDeleteBook = async (pk) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/books/${pk}/`);

      // Remove the deleted book from the local state
      setData((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.error(
        "Delete Error:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex gap-10">
        <input
          className="outline-none px-36 bg-slate-300 rounded-md py-2"
          type="text"
          placeholder="Enter the book name"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="outline-none px-36 bg-slate-300 rounded-md py-2"
          type="Number"
          placeholder="Enter the book price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={addBooks}
          className="bg-green-500 px-8 py-1 rounded-md items-center text-white font-bold hover:bg-green-700 hover:scale-110 translate-x-5 duration-500"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap justify-center flex-row gap-5 ">
        {data.map((book, idx) => (
          <div
            key={idx}
            className="bg-zinc-500 w-96 rounded-md hover:scale-110 duration-500 hover:bg-zinc-600"
          >
            <ul className="p-5 text-white font-mono font-semibold">
              <li>
                Title:
                {book.title}
              </li>
              <li>Price: ₹{book.price}</li>
            </ul>
            <div className=" ml-5">
              {editingBookId === book.id ? (
                <input
                  onChange={(e) => setNewTitle(e.target.value)}
                  value={newTitle}
                  type="text"
                  placeholder="New title..."
                  className="outline-none p-2 rounded-md bg-zinc-300  font-semibold font-mono"
                />
              ) : null}
              <div className="flex justify-around pt-2 mb-5">
                <button
                  onClick={() => {
                    if (editingBookId === book.id) {
                      updateTitle(book.id, book.price);
                    } else {
                      setEditingBookId(book.id); // Open input field for the selected book
                      setNewTitle(book.title); // Pre-fill with current title
                    }
                  }}
                  className=" font-semibold hover:bg-green-400 text-zinc-100 hover:text-white px-5 duration-500 rounded-md"
                >
                  {editingBookId === book.id ? "Save" : "Update"}
                </button>
                <button
                  className=" font-semibold hover:bg-red-400 hover:text-white px-5 duration-500 rounded-md"
                  onClick={() => toDeleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
