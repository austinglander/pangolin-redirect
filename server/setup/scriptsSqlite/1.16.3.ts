import { APP_PATH } from "@server/lib/consts";
import Database from "better-sqlite3";
import path from "path";

const version = "1.16.3";

export default async function migration() {
    console.log(`Running setup script ${version}...`);

    const location = path.join(APP_PATH, "db", "db.sqlite");
    const db = new Database(location);

    try {
        db.pragma("foreign_keys = OFF");

        db.transaction(() => {
            db.prepare(
                `ALTER TABLE 'resources' ADD 'type' text DEFAULT 'proxy' NOT NULL;`
            ).run();
            db.prepare(
                `ALTER TABLE 'resources' ADD 'redirectUrl' text;`
            ).run();
            db.prepare(
                `ALTER TABLE 'resources' ADD 'preservePath' integer DEFAULT 0 NOT NULL;`
            ).run();
            db.prepare(
                `ALTER TABLE 'resources' ADD 'redirectCode' integer DEFAULT 302 NOT NULL;`
            ).run();
        })();

        db.pragma("foreign_keys = ON");

        console.log(`Migrated database`);
    } catch (e) {
        console.log("Failed to migrate db:", e);
        throw e;
    }

    console.log(`${version} migration complete`);
}
