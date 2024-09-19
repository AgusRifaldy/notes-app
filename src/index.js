// index.js
import "whatwg-fetch";
import "./app-bar.js";
import "./note-form.js";
import "./note-item.js";
import { addNote, fetchNotes } from "./script.js";

function init() {
  fetchNotes();

  const noteForm = document.querySelector("note-form");
  if (noteForm) {
    noteForm.addEventListener("add-note", (event) => {
      const { title, body, category } = event.detail;

      addNote(title, body, category); // Update this if you use category
    });
  }
}

init();
