const Discord = require('discord.js')

const fs = require('node:fs');
const path = require('node:path');

const LRUCache = require('./lru_cache');

const cache = new LRUCache(10);

module.exports = {
    getPath: (id) => {
        return path.join('data', id + '.json')
    },
    /**
     * 
     * @param {string | Discord.GuildResolvable} key 
     * @returns {object}
     */
    get: (id) => {
        let result = cache.get(id);
        if (result == null) {
            const filepath = module.exports.getPath(id);
            if (fs.existsSync(filepath)) {
                result = JSON.parse(fs.readFileSync(filepath));
            } else {
                result = {}
                fs.writeFileSync(filepath, JSON.stringify(result));
            }
            cache.put(id, result);
        }
        return result;
    },
    /**
     * 
     * @param {string} id 
     * @param {object} data 
     */
    put: (id, data) => {
        cache.put(id, data);
        fs.writeFileSync(module.exports.getPath(id), JSON.stringify(data));
    },
    /**
     * 
     * @param {string} id 
     * @param {*} key 
     * @returns 
     */
    getKey: (id, key) => {
        return module.exports.get(id)[key];
    },
    setKey: (id, key, value) => {
        const data = module.exports.get(id);
        data[key] = value;
        fs.writeFileSync(module.exports.getPath(id), JSON.stringify(data));
    },
    delKey: (id, key) => {
        const data = module.exports.get(id);
        delete data[key];
        fs.writeFileSync(id, JSON.stringify(data));
    },
    delete: (id) => {
        return cache.delete(id);
    }
}