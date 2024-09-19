document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.getElementById("note-list");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const loadingIndicator = document.getElementById("loading-indicator");

  let notes = [];
  let editMode = false;
  let editNoteId = null;

  // Daftar kategori yang diperbolehkan
  const validCategories = ["project", "business", "personal", "archived"];

  async function fetchNotes() {
    setLoading(true);
    try {
      const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
      const result = await response.json();
      if (result.status === "success") {
        notes = result.data;
        renderNotes(notes);
      } else {
        showError("Failed to fetch notes: " + result.message);
      }
    } catch (error) {
      showError("Error fetching notes: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(title, body, category) {
    setLoading(true);
    if (!validCategories.includes(category)) {
      showError(
        "Invalid category. Allowed categories are: " +
          validCategories.join(", ")
      );
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }), // Kategori tidak disertakan jika API tidak mendukung
      });
      const result = await response.json();
      if (result.status === "success") {
        fetchNotes(); // Refresh notes list
      } else {
        showError("Failed to add note: " + result.message);
      }
    } catch (error) {
      showError("Error adding note: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(noteId) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        fetchNotes(); // Refresh notes list
      } else {
        showError("Failed to delete note: " + result.message);
      }
    } catch (error) {
      showError("Error deleting note: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateNote(noteId, title, body, category, archived = false) {
    setLoading(true);
    if (!validCategories.includes(category)) {
      showError(
        "Invalid category. Allowed categories are: " +
          validCategories.join(", ")
      );
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${noteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body, archived }), // Kategori tidak disertakan jika API tidak mendukung
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        fetchNotes(); // Refresh notes list
      } else {
        showError("Failed to update note: " + result.message);
      }
    } catch (error) {
      showError("Error updating note: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function renderNotes(filteredNotes) {
    noteList.innerHTML = "";

    filteredNotes.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("title", note.title);
      noteElement.setAttribute("body", note.body);
      noteElement.setAttribute("category", note.category || "project");
      noteElement.setAttribute("id", note.id);
      noteElement.setAttribute("archived", note.archived);

      noteElement.addEventListener("edit", (event) => {
        const noteId = event.detail;
        const note = notes.find((note) => note.id === noteId);
        const noteForm = document.querySelector("note-form");
        noteForm.noteTitleInput.value = note.title;
        noteForm.noteBodyInput.value = note.body;
        noteForm.noteCategorySelect.value = note.category || "project"; // Set default to project

        editMode = true;
        editNoteId = noteId;
        const addNoteBtn = document.querySelector("#add-note-btn");
        if (addNoteBtn) {
          addNoteBtn.textContent = "Update Note";
        }
      });

      noteElement.addEventListener("delete", (event) => {
        const noteId = event.detail;
        deleteNote(noteId);
      });

      noteElement.addEventListener("archive", (event) => {
        const noteId = event.detail;
        const note = notes.find((note) => note.id === noteId);
        updateNote(noteId, note.title, note.body, note.category, true);
      });

      noteElement.addEventListener("unarchive", (event) => {
        const noteId = event.detail;
        const note = notes.find((note) => note.id === noteId);
        updateNote(noteId, note.title, note.body, note.category, false);
      });

      noteList.appendChild(noteElement);
    });
  }

  function setLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? "block" : "none";
  }

  function showError(message) {
    alert(message);
  }

  document.querySelector("note-form").addEventListener("add-note", (event) => {
    const { title, body, category } = event.detail;

    if (editMode) {
      updateNote(editNoteId, title, body, category); // Sertakan kategori saat memperbarui
      editMode = false;
      editNoteId = null;
      const addNoteBtn = document.querySelector("#add-note-btn");
      if (addNoteBtn) {
        addNoteBtn.textContent = "Add New Note";
      }
    } else {
      addNote(title, body, category); // Sertakan kategori saat menambahkan
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      if (filter === "all") {
        renderNotes(notes);
      } else if (filter === "archived") {
        const filteredNotes = notes.filter((note) => note.archived);
        renderNotes(filteredNotes);
      } else {
        const filteredNotes = notes.filter((note) => note.category === filter);
        renderNotes(filteredNotes);
      }
    });
  });

  fetchNotes(); // Fetch notes on load
});
