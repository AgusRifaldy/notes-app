const noteFormTemplate = document.createElement("template");
noteFormTemplate.innerHTML = `
  <style>
    .note-form {
      background-color: #fefae0;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .note-form h2 {
      font-family: "Montserrat", sans-serif;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    .note-form .form-group {
      margin-bottom: 15px;
    }
    .note-form .form-group input,
    .note-form .form-group textarea,
    .note-form .form-group select {
      width: 100%;
      padding: 10px;
      border: 2px solid #009080;
      border-radius: 5px;
      font-size: 1rem;
    }
    .note-form .form-group textarea {
      height: 100px;
      resize: vertical;
    }
    .note-form .primary-btn {
      width: 100%;
      padding: 15px;
      background-color: #009080;
      color: #fefae0;
      border: none;
      border-radius: 5px;
      font-size: 1.2rem;
      cursor: pointer;
      font-family: "Montserrat", sans-serif;
    }
    .note-form .primary-btn:hover {
      background-color: #1faa59;
    }
    .note-form .error-message {
      color: red;
      font-size: 0.875rem;
      display: none;
    }
  </style>
  <div class="note-form">
    <h2>Note Form</h2>
    <div class="form-group">
      <input type="text" id="note-title" placeholder="Title" />
    </div>
    <div class="form-group">
      <textarea id="note-body" placeholder="Body"></textarea>
    </div>
    <div class="form-group">
      <select id="note-category">
        <option value="project">Project</option>
        <option value="business">Business</option>
        <option value="personal">Personal</option>
      </select>
    </div>
    <button class="primary-btn" id="add-note-btn">Add New Note</button>
    <p class="error-message" id="error-message">Error message</p>
  </div>
`;

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(noteFormTemplate.content.cloneNode(true));

    this.noteTitleInput = this.shadowRoot.getElementById("note-title");
    this.noteBodyInput = this.shadowRoot.getElementById("note-body");
    this.noteCategorySelect = this.shadowRoot.getElementById("note-category");
    this.addNoteBtn = this.shadowRoot.getElementById("add-note-btn");
    this.errorMessage = this.shadowRoot.getElementById("error-message");

    this.addNoteBtn.addEventListener("click", () => {
      this.handleAddNote();
    });
  }

  handleAddNote() {
    const title = this.noteTitleInput.value.trim();
    const body = this.noteBodyInput.value.trim();
    const category = this.noteCategorySelect.value;

    if (!title || !body) {
      this.errorMessage.textContent = "Title and body are required.";
      this.errorMessage.style.display = "block";
      return;
    }

    this.errorMessage.style.display = "none";

    this.dispatchEvent(
      new CustomEvent("add-note", {
        detail: { title, body, category },
        bubbles: true,
      })
    );

    this.noteTitleInput.value = "";
    this.noteBodyInput.value = "";
    this.noteCategorySelect.value = "project"; // Reset category to default
  }
}

customElements.define("note-form", NoteForm);
