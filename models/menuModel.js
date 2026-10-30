// TODO A: Rancang Schema & Model Menu sesuai tabel skema pada README.md
//
// Ketentuan:
//   nama       String, wajib diisi, spasi di awal/akhir dibuang
//   kode       String, wajib, UNIK, berformat "MN-" diikuti tepat 6 digit angka
//   bahan      Array of String (EMBEDDED), minimal 1 bahan
//   gizi       Subdocument (EMBEDDED, tanpa _id sendiri):
//                kalori  Number, wajib, 0 s.d. 5000
//                protein Number, tidak boleh negatif, default 0
//   harga      Number, wajib, tidak boleh negatif
//   kantinId   ObjectId (REFERENCING ke model "Kantin"), wajib
//   tersedia   Boolean, default true
//   createdAt  Date, default waktu saat ini


// Petunjuk: lihat models/kantinModel.js sebagai contoh sintaks dasar,
// dan materi Pertemuan 9-10 (embedding vs referencing).

const mongoose = require("mongoose");

// TODO A1: buat schema subdocument gizi
// gizi.kalori	Number	wajib, 0 s.d. 5000
// gizi.protein	Number	tidak boleh negatif, default 0
const giziSchema = new mongoose.Schema(
    {
        kalori: {
            type: Number;
            required: true,
            min: 0,
            max: 5000
        },
        protein: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    {
        _id: false
    }
);



// TODO A2: buat menuSchema
const menuSchema = new mongoose.Schema({
    //type: String --- wajib, spasi awal/akhir dibuang
    nama: {
        type: String,
        required: true,
        trim: true
    },
    //type: String --- wajib, unik, format MN- diikuti tepat 6 digit angka (contoh MN-004217)
    kode: {
        type: String,
        required: true,
        unique: true,
        match: /^MN-\d{6}$/
    },
    //type: Array of String --- embedded, minimal 1 bahan
    bahan: {
        type: [{
            type: String,
            trim: true
        }],
        required: true,
        validate: {
            validator: function(bahan){
                return bahan.length >=1;
            },
            message: "Minimal 1 bahan"
        }
    },
    //type: Subdocument	--- embedded, tanpa _id sendiri
    gizi: {
        type: giziSchema,
        required: true
    },
    //type: Number --- wajib, tidak boleh negatif
    harga: {
        type: Number,
        required: true,
        min: 0
    },
    //type: ObjectId --- referencing ke Kantin, wajib
    kantinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kantin",
        required: true
    },
    //type: Boolean	--- default true
    tersedia: {
        type: Boolean,
        default: true
    },
    //type: Date --- default waktu saat dokumen dibuat
    createdAt: {
        type: Date,
        default: Date.now
    }
});



// TODO A3: export model dengan nama "Menu"
module.exports = mongoose.model("Menu", menuSchema);


