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
            result = JSON.parse(fs.readFileSync(path.join('data', id)));
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
    setKey: (id, key, value) => {
        this.get(id)[key] = value;
        fs.writeFileSync(id, JSON.stringify(data));
    },
    delete: (id) => {
        return cache.delete(id);
    }
}