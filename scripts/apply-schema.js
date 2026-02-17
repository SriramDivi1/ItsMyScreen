/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const util = require('util');

const lookup = util.promisify(dns.lookup);

// Use SUPABASE_DB_PASSWORD env var, or update the default for your project
const host = process.env.SUPABASE_DB_HOST || 'db.wvxfiltkomnejscbzalo.supabase.co';
const password = process.env.SUPABASE_DB_PASSWORD || 'YOUR_DB_PASSWORD_HERE';

if (password === 'YOUR_DB_PASSWORD_HERE') {
    console.error('Set SUPABASE_DB_PASSWORD env var or update the password in this script.');
    process.exit(1);
}

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

        const schemaPath = path.join(__dirname, '../supabase/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await client.query(schemaSql);

        const migrationsDir = path.join(__dirname, '../supabase/migrations');
        if (fs.existsSync(migrationsDir)) {
            const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
            for (const file of files) {
                const migrationPath = path.join(migrationsDir, file);
                const migrationSql = fs.readFileSync(migrationPath, 'utf8');
                console.log(`Running migration: ${file}`);
                await client.query(migrationSql);
            }
        }

        console.log('Schema and migrations applied successfully.');
        await client.end();
    } catch (err) {
        console.error('Error applying schema:', err);
    }
}

runSchema();
