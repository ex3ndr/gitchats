require('dotenv').config();
import { startApi } from "./modules/api/startApi";
import { db } from "./modules/storage/db";
import { log } from "./utils/log";
import { awaitShutdown } from "./utils/shutdown";

async function main() {

    //
    // Connect to the database
    //

    log('Connecting to DB...');
    await db.$connect();

    //
    // Start API
    //

    await startApi();

    //
    // Ready
    //

    log('Ready');
    await awaitShutdown();
    log('Shutting down...');
}

main().catch(async (e) => {
    console.error(e);
    await db.$disconnect()
    process.exit(1);
}).then(async () => {
    log('Disconnecting from DB...');
    await db.$disconnect();
    process.exit(0);
});