/* eslint-disable @typescript-eslint/no-require-imports */
const dns = require('dns');
const { promisify } = require('util');
const lookupAsync = promisify(dns.lookup);

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local if available
try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const env = fs.readFileSync(envPath, 'utf8');
        env.split('\n').forEach(line => {
            const m = line.match(/^([^#=]+)=(.*)$/);
            if (m && !process.env[m[1].trim()]) {
                process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
            }
        });
    }
} catch { /* ignore */ }

// Connection options (pick one):
//
// 1. SUPABASE_DB_URL - Full connection string from Supabase Dashboard
//    (Settings → Database → Connection string → URI, use Transaction pooler)
//    Example: postgresql://postgres.XXX:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
//
// 2. Pooler (recommended - more reliable than direct):
//    SUPABASE_DB_USE_POOLER=1
//    SUPABASE_DB_PASSWORD=your_password
//    SUPABASE_PROJECT_REF=wvxfiltkomnejscbzalo  (from project URL)
//    SUPABASE_DB_REGION=us-east-1  (optional)
//
// 3. Direct connection:
//    SUPABASE_DB_PASSWORD=your_password
//    SUPABASE_DB_HOST=db.PROJECT_REF.supabase.co  (optional)

function getConnectionConfig() {
    const url = process.env.SUPABASE_DB_URL;
    if (url) {
        return { connectionString: url };
    }

    const password = process.env.SUPABASE_DB_PASSWORD || 'YOUR_DB_PASSWORD_HERE';
    if (password === 'YOUR_DB_PASSWORD_HERE') {
        console.error('Set SUPABASE_DB_PASSWORD or SUPABASE_DB_URL. See script comments.');
        process.exit(1);
    }

    const encodedPassword = encodeURIComponent(password);
    const projectRef = process.env.SUPABASE_PROJECT_REF || 'wvxfiltkomnejscbzalo';
    const region = process.env.SUPABASE_DB_REGION || 'us-east-1';

    if (process.env.SUPABASE_DB_USE_POOLER) {
        const host = `aws-0-${region}.pooler.supabase.com`;
        const user = `postgres.${projectRef}`;
        const connectionString = `postgresql://${user}:${encodedPassword}@${host}:6543/postgres`;
        return { connectionString, host };
    }

    const host = process.env.SUPABASE_DB_HOST || `db.${projectRef}.supabase.co`;
    const connectionString = `postgresql://postgres:${encodedPassword}@${host}:5432/postgres`;
    return { connectionString, host, resolveIpv4: true };
}

async function resolveHostToIpv4(host) {
    const { address } = await lookupAsync(host, { family: 4 });
    return address;
}

async function runSchema() {
    try {
        let config = getConnectionConfig();

        if (config.resolveIpv4 && config.host) {
            try {
                const ip = await resolveHostToIpv4(config.host);
                config.connectionString = config.connectionString.replace(config.host, ip);
                delete config.resolveIpv4;
                console.log(`Resolved ${config.host} to ${ip}`);
            } catch (e) {
                console.warn('Could not resolve IPv4, trying hostname:', e.message);
            }
        }

        const clientConfig = {
            connectionString: config.connectionString,
            ssl: { rejectUnauthorized: false }
        };
        if (config.host) {
            clientConfig.ssl.servername = config.host;
        }

        const client = new Client(clientConfig);
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected.');

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
        console.error('Error applying schema:', err.message);
        console.error('\nFallback: Copy the SQL and run it in Supabase Dashboard → SQL Editor:');
        console.error('  npx node scripts/apply-schema.js --print-sql\n');
        process.exit(1);
    }
}

const printSql = process.argv.includes('--print-sql') || process.argv.includes('--sql');
if (printSql) {
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    let sql = fs.readFileSync(schemaPath, 'utf8');
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    if (fs.existsSync(migrationsDir)) {
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
        for (const file of files) {
            sql += '\n\n-- ' + file + '\n';
            sql += fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        }
    }
    console.log(sql);
} else {
    runSchema();
}
