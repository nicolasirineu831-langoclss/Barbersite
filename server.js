const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// Criar tabela
db.run(`
CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    servico TEXT,
    horario TEXT
)
`);

// Salvar agendamento
app.post("/agendar", (req, res) => {

    const { nome, servico, horario } = req.body;

    db.run(
        "INSERT INTO agendamentos (nome, servico, horario) VALUES (?, ?, ?)",
        [nome, servico, horario],
        function(err) {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                sucesso: true,
                id: this.lastID
            });
        }
    );
});

// Listar agendamentos
app.get("/agendamentos", (req, res) => {

    db.all(
        "SELECT * FROM agendamentos",
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(rows);
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

