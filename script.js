// -------------------- Datenarrays --------------------
let notesTitles = [];
let notes = [];

let trashNotesTitles = [];
let trashNotes = [];

let archiveNotesTitles = [];
let archiveNotes = [];

// -------------------- Initialisierung --------------------
function init() {
    loadFromLocalStorage();
    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
}

// -------------------- Renderfunktionen --------------------
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

function renderArchiveNotes() {
    let archiveContentRef = document.getElementById('archive_content');
    archiveContentRef.innerHTML = "";

    for (let indexArchiveNote = 0; indexArchiveNote < archiveNotes.length; indexArchiveNote++) {
        archiveContentRef.innerHTML += getArchiveNoteTemplate(indexArchiveNote);
    }
}

// -------------------- Templates --------------------
function getNoteTemplate(indexNote) {
    return `
        <p>
            + Titel: <strong>${notesTitles[indexNote]}</strong> → ${notes[indexNote]}
            <button onclick="archiveNote(${indexNote})">
                <img src="./assets/icons/archive.png" alt="Archivieren">
            </button>
            <button onclick="pushNoteToTrash(${indexNote})">
                <img src="./assets/icons/trashcan.png" alt="Löschen">
            </button>
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

function getArchiveNoteTemplate(indexArchiveNote) {
    return `
        <p>
            + Titel: <strong>${archiveNotesTitles[indexArchiveNote]}</strong> → ${archiveNotes[indexArchiveNote]}
            <button onclick="restoreArchive(${indexArchiveNote})">🔄 Wiederherstellen</button>
            <button onclick="archiveToTrash(${indexArchiveNote})">🗑️ Papierkorb</button>
            <button onclick="deleteArchive(${indexArchiveNote})">❌ Löschen</button>
        </p>
    `;
}

// -------------------- Funktionen: Notizen --------------------
function addNote() {
    let titleInputRef = document.getElementById('note_title_input');
    let noteInputRef = document.getElementById('note_input');

    let title = titleInputRef.value.trim();
    let note = noteInputRef.value.trim();

    if (title && note) {
        notesTitles.push(title);
        notes.push(note);

        sortNotes(); // alphabetisch sortieren

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
    renderArchiveNotes();
    saveToLocalStorage();
}

function restoreNote(indexTrashNote) {
    let restoredNote = trashNotes.splice(indexTrashNote, 1)[0];
    let restoredNoteTitle = trashNotesTitles.splice(indexTrashNote, 1)[0];

    notes.push(restoredNote);
    notesTitles.push(restoredNoteTitle);

    sortNotes();
    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
    saveToLocalStorage();
}

function deleteNote(indexTrashNote) {
    trashNotes.splice(indexTrashNote, 1);
    trashNotesTitles.splice(indexTrashNote, 1);

    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
    saveToLocalStorage();
}

// -------------------- Funktionen: Archiv --------------------
function archiveNote(indexNote) {
    let archivedNote = notes.splice(indexNote, 1)[0];
    let archivedTitle = notesTitles.splice(indexNote, 1)[0];

    archiveNotes.push(archivedNote);
    archiveNotesTitles.push(archivedTitle);

    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
    saveToLocalStorage();
}

function restoreArchive(indexArchiveNote) {
    let restoredNote = archiveNotes.splice(indexArchiveNote, 1)[0];
    let restoredTitle = archiveNotesTitles.splice(indexArchiveNote, 1)[0];

    notes.push(restoredNote);
    notesTitles.push(restoredTitle);

    sortNotes();
    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
    saveToLocalStorage();
}

function archiveToTrash(indexArchiveNote) {
    let trashedNote = archiveNotes.splice(indexArchiveNote, 1)[0];
    let trashedTitle = archiveNotesTitles.splice(indexArchiveNote, 1)[0];

    trashNotes.push(trashedNote);
    trashNotesTitles.push(trashedTitle);

    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
    saveToLocalStorage();
}

function deleteArchive(indexArchiveNote) {
    archiveNotes.splice(indexArchiveNote, 1);
    archiveNotesTitles.splice(indexArchiveNote, 1);

    renderNotes();
    renderTrashNotes();
    renderArchiveNotes();
    saveToLocalStorage();
}

// -------------------- Speicherfunktionen --------------------
function saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("notesTitles", JSON.stringify(notesTitles));
    localStorage.setItem("trashNotes", JSON.stringify(trashNotes));
    localStorage.setItem("trashNotesTitles", JSON.stringify(trashNotesTitles));
    localStorage.setItem("archiveNotes", JSON.stringify(archiveNotes));
    localStorage.setItem("archiveNotesTitles", JSON.stringify(archiveNotesTitles));
}

function loadFromLocalStorage() {
    let loadedNotes = JSON.parse(localStorage.getItem("notes"));
    let loadedTitles = JSON.parse(localStorage.getItem("notesTitles"));
    let loadedTrashNotes = JSON.parse(localStorage.getItem("trashNotes"));
    let loadedTrashTitles = JSON.parse(localStorage.getItem("trashNotesTitles"));
    let loadedArchiveNotes = JSON.parse(localStorage.getItem("archiveNotes"));
    let loadedArchiveTitles = JSON.parse(localStorage.getItem("archiveNotesTitles"));

    if (loadedNotes) notes = loadedNotes;
    if (loadedTitles) notesTitles = loadedTitles;
    if (loadedTrashNotes) trashNotes = loadedTrashNotes;
    if (loadedTrashTitles) trashNotesTitles = loadedTrashTitles;
    if (loadedArchiveNotes) archiveNotes = loadedArchiveNotes;
    if (loadedArchiveTitles) archiveNotesTitles = loadedArchiveTitles;
}

// -------------------- Sortierfunktion --------------------
function sortNotes() {
    let combined = notesTitles.map((title, i) => {
        return { title: title, note: notes[i] };
    });

    combined.sort((a, b) => a.title.localeCompare(b.title, 'de', { sensitivity: 'base' }));

    notesTitles = combined.map(item => item.title);
    notes = combined.map(item => item.note);
}
