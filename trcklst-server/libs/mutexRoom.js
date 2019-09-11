class MutexRoom {
    constructor() {
        this.queue = [];
        this.locked = false;
    }

    lock(roomId) {
        return new Promise((resolve, reject) => {
            if (this.locked) {
                if (roomId in this.queue)
                    this.queue[roomId].push([resolve, reject]);
                else
                    this.queue[roomId] = [[resolve, reject]];
            } else {
                this.locked = true;
                resolve();
            }
        });
    }

    release(roomId) {
        if (roomId in this.queue && this.queue[roomId].length > 0) {
            const [resolve, reject] = this.queue[roomId].shift();
            resolve();
        } else {
            this.locked = false;
        }

    }
}

module.exports = MutexRoom;