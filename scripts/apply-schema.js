
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const util = require('util');

const lookup = util.promisify(dns.lookup);

const host = 'db.wvxfiltkomnejscbzalo.supabase.co';
const password = 'YOUR_DB_PASSWORD_HERE'; // Update with your new Supabase database password
const encodedPassword = encodeURIComponent(password);

async function runSchema() {
    try {
        console.log(`Resolving ${host}...`);
        const { address } = await lookup(host, { family: 4 });
        console.log(`Resolved to ${address}`);

        const connectionString = `postgresql://postgres:${encodedPassword}@${address}:5432/postgres`;

        // We must pass the host header for TLS SNI if we use IP, but pg might not support it easily without custom ssl config.
        // However, Supabase (AWS) usually requires SNI.
        // Let's try connecting. If SSL fails, we might need to skip this and ask user.

        // Actually, let's try to just use valid node options to force IPv4 globally.
        // But since that failed, let's try the direct IP.

        const client = new Client({
            connectionString,
            ssl: {
                rejectUnauthorized: false, // For testing/IP connection often needed if cert doesn't match IP
                servername: host // SNI
            }
        });

        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, '../supabase/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running schema...');
        await client.query(sql);
        console.log('Schema applied successfully.');
        await client.end();
    } catch (err) {
        console.error('Error applying schema:', err);
    }
}

runSchema();
