import sqlite3 from 'sqlite3';
import { Database as SqliteDatabase } from 'sqlite';
import { open } from 'sqlite';

export class Database {
    private db: SqliteDatabase | undefined;

    constructor() {
        this.init();
    }

    private async init() {
        this.db = await open({
            filename: __dirname + '/database.db',
            driver: sqlite3.Database,
        });

        await this.db.run(`CREATE TABLE IF NOT EXISTS subscribers (
            chat_id INTEGER PRIMARY KEY
        )`);
    }

    async subscribe(chatId: number) {
        await this.db?.run('INSERT OR IGNORE INTO subscribers (chat_id) VALUES (?)', chatId);
    }

    async unsubscribe(chatId: number) {
        await this.db?.run('DELETE FROM subscribers WHERE chat_id = ?', chatId);
    }

    async getSubscribers(): Promise<number[]> {
        const rows = await this.db?.all('SELECT chat_id FROM subscribers');
        return rows ? rows.map(row => row.chat_id) : [];
    }
}