class BaseRepository {
    constructor() {
        this.items = new Map();
    }

    findAll() {
        return Array.from(this.items.values());
    }

    save(key, item) {
        this.items.set(key, item);
        return item;
    }

    clear() {
        this.items.clear();
    }
}

export default BaseRepository;