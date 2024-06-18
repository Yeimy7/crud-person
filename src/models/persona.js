const mongoose = require('mongoose')

const personaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    minlength: 3,
    required: true,
  },
  apellido_paterno: {
    type: String,
    required: true,
    minlength:3,
  },
  apellido_materno: {
    type: String,
    minlength: 5,
    required: true,
  },
  fecha_nacimiento: {
    type: String,
  },
  
})


module.exports = mongoose.model('Persona', personaSchema);