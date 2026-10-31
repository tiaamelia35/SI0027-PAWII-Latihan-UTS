// TODO D: Middleware error handling terpusat (Pertemuan 5 & 11-12)
// Didaftarkan PALING AKHIR pada app.js. Respons error SELALU berbentuk { message }.
//
// Pemetaan error -> status:
//   err.status ada (mis. { status: 404, message })  -> pakai status & message tersebut
//   ValidationError (Mongoose)                        -> 400, message dari error
//   CastError (format id/ObjectId salah)              -> 400, "Format <err.path> tidak valid"
//   Duplicate key (err.code === 11000)                -> 400, "Data dengan nilai unik tersebut sudah ada"
//   error lain yang tidak terduga                     -> 500, catat ke console.error,
//                                                        message ke client TETAP generik
//                                                        ("Terjadi kesalahan pada server"),
//                                                        stack trace jangan dibocorkan

function errorHandler(err, req, res, next) {
  // TODO D1
  let status = 500;
  let message = "Terjadi kesalahan pada server";


   //D1: Error dengan status dan message dari controller
  if (err.status && err.message) {
    status = err.status;
    message = err.message;
  } else if (err.name === "ValidationError") {            // Error validasi Mongoose
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }


  //Error format ID atau ObjectId
  else if (err.name === "CastError") {  
  status = 400;
  message = `Format ${err.path} tidak valid`;
  } else if (err.code === 11000) {                         //Error kalau duplicate data unik
    status = 400;
    message = "Data dengan nilai unik tersebut sudah ada";
  }

  
  // Error lain yang tidak terduga
  else {
    console.error(err);
  }

  res.status(status).json({ message });
}

module.exports = errorHandler;
