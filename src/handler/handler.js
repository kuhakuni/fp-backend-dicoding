const { nanoid } = require("nanoid");
const books = require("../books/books");

const addBookHandler = (req, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = req.payload;
	if (readPage > pageCount) {
		return h
			.response({
				status: "fail",
				message:
					"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
			})
			.code(400);
	}
	if (!name) {
		return h
			.response({
				status: "fail",
				message: "Gagal menambahkan buku. Mohon isi nama buku",
			})
			.code(400);
	}
	const id = nanoid();
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};
	books.push(newBook);

	const isSuccess = books.filter((book) => book.id === id).length > 0;
	if (isSuccess) {
		return h
			.response({
				status: "success",
				message: "Buku berhasil ditambahkan",
				data: {
					bookId: id,
				},
			})
			.code(201);
	}
	return h
		.response({
			status: "error",
			message: "Buku gagal ditambahkan",
		})
		.code(500);
};

const getAllBooksHandler = (req, h) => {
	const { name, reading, finished } = req.query;
	const dataQuery = books.filter((book) => {
		if (name !== undefined) {
			return book.name.toLowerCase().includes(name.toLowerCase());
		}
		if (reading !== undefined) {
			return Number(book.reading) === reading;
		}
		if (finished !== undefined) {
			return Number(book.finished) === finished;
		}
		return [];
	});
	if (dataQuery.length !== 0) {
		return h
			.response({
				status: "success",
				data: {
					books: dataQuery.map((book) => ({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					})),
				},
			})
			.code(200);
	}
	return h
		.response({
			status: "success",
			data: {
				books: books.map((book) => ({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				})),
			},
		})
		.code(200);
};

const getBookByIdHandler = (req, h) => {
	const { id } = req.params;

	const book = books.filter((b) => b.id === id)[0];

	if (!book) {
		return h
			.response({
				status: "fail",
				message: "Buku tidak ditemukan",
			})
			.code(404);
	}
	return h
		.response({
			status: "success",
			data: {
				book,
			},
		})
		.code(200);
};

const editBookByIdHandler = (req, h) => {
	const { id } = req.params;

	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = req.payload;
	const updatedAt = new Date().toISOString();
	if (readPage > pageCount) {
		return h
			.response({
				status: "fail",
				message:
					"Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
			})
			.code(400);
	}
	if (!name) {
		return h
			.response({
				status: "fail",
				message: "Gagal memperbarui buku. Mohon isi nama buku",
			})
			.code(400);
	}
	const index = books.findIndex((note) => note.id === id);
	if (index === -1) {
		return h
			.response({
				status: "fail",
				message: "Gagal memperbarui buku. Id tidak ditemukan",
			})
			.code(404);
	}
	const finished = pageCount === readPage;
	books[index] = {
		...books[index],
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		finished,
		updatedAt,
	};
	return h
		.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		})
		.code(200);
};

const deleteBookByIdHandler = (req, h) => {
	const { id } = req.params;

	const index = books.findIndex((note) => note.id === id);
	if (index === -1) {
		return h
			.response({
				status: "fail",
				message: "Buku gagal dihapus. Id tidak ditemukan",
			})
			.code(404);
	}
	books.splice(index, 1);
	return h
		.response({
			status: "success",
			message: "Buku berhasil dihapus",
		})
		.code(200);
};

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};
