// TODO B: Controller Menu - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Menu tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Menu = require("../models/menuModel");

const MAX_LIMIT = 100;

// GET /menu
// Query opsional:
//   kantinId  filter berdasarkan kantin
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=nama,kode
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kantinId yang ter-populate (objek Kantin)
exports.getAll = async (req, res) => {
  // TODO B1
  const filter = {};

  // Filter berdasarkan Kantin
  if (req.query.kantinId) {
    filter.kantinId = req.query.kantinId;
  }


  //Pagination
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(req.query.limit, 10) || 10)
  );

  const skip = (page - 1) * limit;

  //Sorting (Ascending) berdasarkan createdAt
  const sort = req.query.sort || "createdAt";
  const sortOption = { [sort]: 1};


  //Query utk ambil data menu
  let query = Menu.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate("kantinId");


  //Projection: milih field yang ingin ditampilkan
  if (req.query.fields) {
    const fields = req.query.fields
      .split(",")
      .map(field => field.trim())
      .filter(Boolean);

      //pastiin kantinId tetap tersedia agar bisa di-populate
      if (!fields.includes("kantinId")) {
        field.push("kantinId");
      }

      query = query.select(fields.join(" "));
  }

  const data = await query;


  //Total seluruh dokumen yg cocok dgn Filter
  const total = await Menu.countDocuments(filter);

  res.status(200).json({
    data,
    page,
    limit,
    total
  });
};



// GET /menu/:id
//   - 200 -> dokumen menu, kantinId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  // TODO B2
  const menu = await Menu.findById(req.params.id)
    .populate("kantinId");

  if (!menu) {
    throw {
      status: 404,
      message: "Menu tidak ditemukan"
    };
  }

  res.status(200).json(menu);
};

// POST /menu
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
  const menu = new Menu(req.body);
  const savedMenu = await menu.save();

  res.status(201).json(savedMenu);
};

// PUT /menu/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!menu) {
    throw {
      status: 400,
      message: "Menu tidak ditemukan"
    };
  }

  res.status(200).json(menu);
};

// DELETE /menu/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
  const menu = await Menu.findByIdAndDelete(req.params.id);

  if(!menu) {
    throw {
      status: 404,
      message: "Menu tidak ditemukan"
    };
  }

  res.status(204).end();
};
