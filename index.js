const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require('cors')

app.use(cors())
app.use(express.json());


const secretKey = "supersecretkey"; 

const users = [
  {
    id: 1,
    username: "admin",
    passwordHash: "$2a$10$pymPJNxERwzdzS2Wy9i9EOkinsObnt097VlWSzI11VLewpWKUeMXG", // Contraseña hasheada de 'admin123'
    role: "admin",
  },
  {
    id: 2,
    username: "user",
    passwordHash: "$2a$10$A8IeDZQixu4Z6AL9Tqq77.G.xLMacELP5mZUIHr0YxgPpl2Fn9y6K", // Contraseña hasheada de 'contra'
    role: "user",
  },
];

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); 
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); 
  }
};


app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
console.log(username, password);
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Contraseña hasheada:", hash);
  });
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey);
    res.json({ token });
  });
})

let medio_de_contacto1 = {
  tipo: "correo",
  valor: "jholland@gmail.com",
};
let medio_de_contacto2 = {
  tipo: "celular",
  valor: "7777717",
};

let personas = [
  {
    id: 1,
    nombre: "Juan",
    apellido_paterno: "Holland",
    apellido_materno: "Green",
    fecha_nacimiento: "05-10-2000",
    sueldo: 3000,
    medios_de_contacto: [medio_de_contacto1, medio_de_contacto2],
  },
  {
    id: 2,
    nombre: "Ana",
    apellido_paterno: "Jimenez",
    apellido_materno: "Mendez",
    fecha_nacimiento: "05-10-1992",
    sueldo: 4000,
    medios_de_contacto: [medio_de_contacto1, medio_de_contacto2],
  },
  {
    id: 3,
    nombre: "Pedro",
    apellido_paterno: "Dumas",
    apellido_materno: "Gutierrez",
    fecha_nacimiento: "05-10-1991",
    sueldo: 3500,
    medios_de_contacto: [medio_de_contacto1, medio_de_contacto2],
  },
];



app.get("/api/personas", verifyToken,(request, response) => {
  response.json(personas);
});
app.get("/api/personas/:id", verifyToken,(request, response) => {
  const id = Number(request.params.id);
  const persona = personas.find((persona) => persona.id === id);
  if (persona) {
    response.json(persona);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/personas/:id", verifyToken, (request, response) => {
  const id = Number(request.params.id);
  personas = personas.filter((persona) => persona.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId =
    personas.length > 0 ? Math.max(...personas.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/personas", verifyToken, (request, response) => {
  const body = request.body;

  if (!body.nombre || body.nombre == null || body.nombre == "") {
    return response.status(400).json({
      error: "Se necesita el Nombre de persona",
    });
  }
  if (!body.apellido_paterno || body.apellido_paterno == null || body.apellido_paterno == "") {
    return response.status(400).json({
      error: "Se necesita el Apellido paterno",
    });
  }
  if (!body.apellido_materno || body.apellido_materno == null || body.apellido_materno == "") {
    return response.status(400).json({
      error: "Se necesita el Apellido materno",
    });
  }
  if (!body.fecha_nacimiento || body.fecha_nacimiento == null || body.fecha_nacimiento == "") {
    return response.status(400).json({
      error: "Se necesita la Fecha de nacimiento",
    });
  }
  if (!body.sueldo || body.sueldo == null || body.sueldo == 0) {
    return response.status(400).json({
      error: "Se necesita el sueldo",
    });
  }

  const persona = {
    id: generateId(),
    nombre: body.nombre,
    apellido_paterno: body.apellido_paterno,
    apellido_materno: body.apellido_materno,
    fecha_nacimiento: body.fecha_nacimiento,
    sueldo: body.sueldo,
    medios_de_contacto: body.medios_de_contacto,
  };

  personas = personas.concat(persona);
  response.json(request.body);
});

app.patch("/api/personas/:id/sueldo", verifyToken, (request, response) => {
    const id = Number(request.params.id);
    const nuevoSueldo = request.body.sueldo;
  
    const persona = personas.find((persona) => persona.id === id);
  
    if (persona) {
      persona.sueldo = nuevoSueldo;
      response.json(persona);
    } else {
      response.status(404).json({ error: `No se encontró persona con id ${id}` });
    }
  });
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
