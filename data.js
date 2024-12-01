const Discord = require('discord.js')

const fs = require('node:fs');
const path = require('node:path');

const LRUCache = require('./lru_cache');

const cache = new LRUCache(10);

module.exports = {
    /**
     * 
     * @param {string | Discord.GuildResolvable} key 
     * @returns {object}
     */
    get: (id) => {
        let result = cache.get(id);
        if (result == null) {
            const filepath = path.join('data', id);
            if (fs.existsSync(filepath)) {
                result = JSON.parse(fs.readFileSync(path));
            } else {
                result = {}
                fs.writeFileSync(filepath, result);
            }
            cache.put(id, result);
        }
        return result;
    },
    /**
     * 
     * @param {string | Discord.GuildResolvable} id 
     * @param {object} data 
     */
    put: (id, data) => {
        cache.put(id, data);
        fs.writeFileSync(id, JSON.stringify(data));
    },
    getKey: (id, key) => {
        return this.get(id)[key];
    },
    setKey: (id, key, value) => {
        this.get(id)[key] = value;
        fs.writeFileSync(id, JSON.stringify(data));
    },
    delKey: (id, key) => {
        delete this.get(id)[key];
        fs.writeFileSync(id, JSON.stringify(data));
    },
    delete: (id) => {
        return cache.delete(id);
    }
}