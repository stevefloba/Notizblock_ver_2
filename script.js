let notesTitles = [];
let notes = [];

let trashNotesTitles = [];
let trashNotes = [];

function init() {
    loadFromLocalStorage();
    renderNotes();
    renderTrashNotes();
}

function renderNotes() {
    let contentRef = document.getElementById('content');
    contentRef.innerHTML = "";

    for (let indexNote = 0; indexNote < notes.length; indexNote++) {
        contentRef.innerHTML += getNoteTemplate(indexNote);
    }
}

function renderTrashNotes() {
    let trashContentRef = document.getElementById('trash_content');
    trashContentRef.innerHTML = "";

    for (let indexTrashNote = 0; indexTrashNote < trashNotes.length; indexTrashNote++) {
        trashContentRef.innerHTML += getTrashNoteTemplate(indexTrashNote);
    }
}

function getNoteTemplate(indexNote) {
    return `
        <p>
            + Titel: <strong>${notesTitles[indexNote]}</strong> → ${notes[indexNote]}
            <button onclick="pushNoteToTrash(${indexNote})">🗑️</button>
        </p>
    `;
}

function getTrashNoteTemplate(indexTrashNote) {
    return `
        <p>
            + Titel: <strong>${trashNotesTitles[indexTrashNote]}</strong> → ${trashNotes[indexTrashNote]}
            <button onclick="restoreNote(${indexTrashNote})">🔄 Wiederherstellen</button>
            <button onclick="deleteNote(${indexTrashNote})">❌ Löschen</button>
        </p>
    `;
}

function addNote() {
    let titleInputRef = document.getElementById('note_title_input');
    let noteInputRef = document.getElementById('note_input');

    let title = titleInputRef.value.trim();
    let note = noteInputRef.value.trim();

    if (title && note) {
        notesTitles.push(title);
        notes.push(note);

        sortNotes(); // nach Titel sortieren

        renderNotes();
        saveToLocalStorage();

        titleInputRef.value = "";
        noteInputRef.value = "";
    }
}

function pushNoteToTrash(indexNote) {
    let trashNote = notes.splice(indexNote, 1)[0];
    let trashNoteTitle = notesTitles.splice(indexNote, 1)[0];

    trashNotes.push(trashNote);
    trashNotesTitles.push(trashNoteTitle);

    renderNotes();
    renderTrashNotes();
    saveToLocalStorage();
}

function restoreNote(indexTrashNote) {
    let restoredNote = trashNotes.splice(indexTrashNote, 1)[0];
    let restoredNoteTitle = trashNotesTitles.splice(indexTrashNote, 1)[0];

    notes.push(restoredNote);
    notesTitles.push(restoredNoteTitle);

    renderNotes();
    renderTrashNotes();
    saveToLocalStorage();
}

function deleteNote(indexTrashNote) {
    trashNotes.splice(indexTrashNote, 1);
    trashNotesTitles.splice(indexTrashNote, 1);

    renderNotes();
    renderTrashNotes();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("notesTitles", JSON.stringify(notesTitles));
    localStorage.setItem("trashNotes", JSON.stringify(trashNotes));
    localStorage.setItem("trashNotesTitles", JSON.stringify(trashNotesTitles));
}

function loadFromLocalStorage() {
    let loadedNotes = JSON.parse(localStorage.getItem("notes"));
    let loadedTitles = JSON.parse(localStorage.getItem("notesTitles"));
    let loadedTrashNotes = JSON.parse(localStorage.getItem("trashNotes"));
    let loadedTrashTitles = JSON.parse(localStorage.getItem("trashNotesTitles"));

    if (loadedNotes) notes = loadedNotes;
    if (loadedTitles) notesTitles = loadedTitles;
    if (loadedTrashNotes) trashNotes = loadedTrashNotes;
    if (loadedTrashTitles) trashNotesTitles = loadedTrashTitles;
}


function sortNotes() {
    // Ein Array aus Objekten erzeugen, um Titel & Notiz zusammenzuhalten
    let combined = notesTitles.map((title, i) => {
        return { title: title, note: notes[i] };
    });

    // Alphabetisch nach Titel sortieren (case-insensitive)
    combined.sort((a, b) => a.title.localeCompare(b.title, 'de', { sensitivity: 'base' }));

    // Zurück in die Arrays schreiben
    notesTitles = combined.map(item => item.title);
    notes = combined.map(item => item.note);
}