const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

app.use(express.json());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
});

conn.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

/**
 * Cria uma rota GET para buscar todos os registros de uma tabela específica do banco de dados.
 *
 * @param {string} path - O caminho da rota (por exemplo, '/clientes').
 * @param {string} table - O nome da tabela no banco de dados da qual os dados serão buscados.
 */
const createGetRoute = (path, table) => {
    app.get(path, (req, res) => {
        const sql = `SELECT * FROM ${table}`;
        conn.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(`Erro ao buscar dados da tabela ${table}`);
            } else {
                res.send(result);
            }
        });
    });
};

/**
 * Cria uma rota POST para inserir um novo registro em uma tabela específica do banco de dados.
 *
 * @param {string} path - O caminho da rota (por exemplo, '/clientes').
 * @param {string} table - O nome da tabela no banco de dados na qual os dados serão inseridos.
 * @param {string[]} fields - Uma lista de nomes de campos que serão inseridos na tabela.
 *
 * @example
 * // Exemplo de uso para a tabela 'clientes'
 * createPostRoute('/clientes', 'clientes', ['nome', 'email', 'telefone', 'cidade']);
 */
const createPostRoute = (path, table, fields) => {
    app.post(path, (req, res) => {
        const values = fields.map(field => req.body[field]);
        const placeholders = fields.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(`Erro ao inserir dados na tabela ${table}`);
            } else {
                res.redirect(path);
            }
        });
    });
};

const routes = [
    { path: '/clientes', table: 'clientes', fields: ['nome', 'email', 'telefone', 'cidade'] },
    { path: '/produtos', table: 'produtos', fields: ['nome', 'categoria', 'preco', 'quantidade'] },
    { path: '/livros', table: 'livros', fields: ['titulo', 'autor', 'genero', 'ano'] },
    { path: '/carros', table: 'carros', fields: ['marca', 'modelo', 'ano', 'preco'] },
    { path: '/musicas', table: 'musicas', fields: ['titulo', 'artista', 'album', 'ano'] }
];

routes.forEach(route => {
    createGetRoute(route.path, route.table);
    createPostRoute(route.path, route.table, route.fields);
});

app.listen(PORT, () => {
    console.log(`Servidor escutando na porta: ${PORT}`);
});
