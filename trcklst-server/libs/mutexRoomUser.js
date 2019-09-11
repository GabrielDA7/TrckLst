class MutexRoomUser {
    constructor() {
        this.queue = [];
        this.locked = false;
    }

    lock(roomId, userId) {
        return new Promise((resolve, reject) => {
            if (this.locked) {
                if (roomId in this.queue && userId in this.queue[roomId])
                    this.queue[roomId][userId].push([resolve, reject]);
                else
                    this.queue[roomId] = [];
                    this.queue[roomId][userId] = [[resolve, reject]];
            } else {
                this.locked = true;
                resolve();
            }
        });
    }

    release(roomId, userId) {
        if (roomId in this.queue && userId in this.queue[roomId] && this.queue[roomId][userId].length > 0) {
            const [resolve, reject] = this.queue[roomId][userId].shift();
            resolve();
        } else {
            this.locked = false;
        }

    }
}

module.exports = MutexRoomUser;