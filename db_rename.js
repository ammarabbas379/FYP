require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function main() {
    console.log('Renaming column paypalOrderId to paymentId in creditTransactions table...');
    try {
        await sql`ALTER TABLE "creditTransactions" RENAME COLUMN "paypalOrderId" TO "paymentId";`;
        console.log('Successfully renamed column!');
    } catch (e) {
        if (e.message.includes('does not exist')) {
            console.log('Column paypalOrderId does not exist (it may have already been renamed). Checking if paymentId exists...');
            try {
                // Check if paymentId already exists, if not, create it
                await sql`ALTER TABLE "creditTransactions" ADD COLUMN "paymentId" text;`;
                console.log('Created paymentId column.');
            } catch (e2) {
                console.log('paymentId column might already exist or another error occurred:', e2.message);
            }
        } else {
            console.error('Error renaming column:', e);
        }
    }
}

main().catch(console.error);
