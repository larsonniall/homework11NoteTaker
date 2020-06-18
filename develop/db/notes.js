const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    constructor() {
        this.lastId = 0;
    }
    read() {
        return readFileAsync("db/db.json","utf8");
    }
    write(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note));
    }
    getNote() {
        return this.read().then(notes => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }
            return parsedNotes;
        })
    }
    addNote(note) {
        const {title, text}= note;
        if (!title || !text) {
            throw new Error("title and text cannot be blank")
        }
        const newNote = {title, text, id: ++this.lastId};
        return this.getNote()
        .then(notes => [notes, newNote])
        .then(updatedNotes => this.write(updatedNotes))
        .then(() => newNote);
    }
    removeNote(id) {
        return this.getNote()
        .then(notes => notes.filter(note => note.id !== parseInt(id)))
        .then(filteredNotes => this.write(filteredNotes));
    }
}
module.exports = new Store()