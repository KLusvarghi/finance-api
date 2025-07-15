import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../helper.js';
import { fileURLToPath } from 'url';
// Para que tenhamos acesso ao filename e dirname, temos que fazer esse macete:
// o metodo "fileURLToPath" tira a parte do path que seria por exemplo "file://Users/kaua-lusvarghi/..."
// e o path não pode ter esse "file", transformando em um path convencional
const __filename = fileURLToPath(import.meta.url);
// e aqui pegamos o "dirname" do filename que extraimos acima
const __dirname = path.dirname(__filename);
const execMigrations = async () => {
    // conectando ao pool
    const client = await pool.connect();
    try {
        // eu preciso especificar o diretorio atual que estou executando e depois o path do aql da migration
        const filePath = path.join(__dirname, './01-init.sql');
        // pegando todo o escript dentro do arquivo .sql
        // sendo essencial colocar o encoding para que não gere erros
        const script = fs.readFileSync(filePath, 'utf-8');
        // executando todo o script/query que estpá na migration
        await client.query(script);
        console.log('MIgrations executed successfully');
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await client.release();
    }
};
execMigrations();
