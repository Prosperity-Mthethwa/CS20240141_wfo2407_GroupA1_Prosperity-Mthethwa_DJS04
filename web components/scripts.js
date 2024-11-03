class BookPreviewModalComponent extends HTMLElement {
    
    //Creates an instance of BookPreviewModalComponent.
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    
    //Lifecycle callback invoked when the element is added to the DOM.
    //Renders the modal component and attaches event listeners.
    
    connectedCallback() {
      this.render();
      // Add event listeners for closing the modal
      this.shadowRoot
        .querySelector("[data-close-button]")
        .addEventListener("click", this.closeModal.bind(this));
      this.shadowRoot
        .querySelector("[data-modal-overlay]")
        .addEventListener("click", this.closeModal.bind(this));
      // Prevent closing modal when clicking inside modal content
      this.shadowRoot
        .querySelector(".modal-content")
        .addEventListener("click", (event) => event.stopPropagation());
    }
  
    //Renders the modal component with HTML and CSS styles.

    render() {
      this.shadowRoot.innerHTML = `
            <style>
              /* CSS styles for the book preview modal */
              .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
              }
              .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
              }
            </style>
            <div class="modal-overlay" data-modal-overlay>
              <div class="modal-content">
                <button class="close-button" data-close-button>&times;</button>
                <!-- Content goes here -->
              </div>
            </div>
          `;
    }
  
    
    //Closes the modal by removing it from the DOM.
    closeModal() {
      this.remove(); // Remove the modal from the DOM
    }
  };

// Define the custom element
customElements.define("book-preview-modal", BookPreviewModalComponent);

class ThemeToggleComponent extends HTMLElement {
    //Creates an instance of ThemeToggleComponent.
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    // Lifecycle method called when the component is connected to the DOM.
    //Renders the toggle button and attaches event listeners.
    connectedCallback() {
      this.render();
      this.shadowRoot
        .querySelector("button")
        .addEventListener("click", this.toggleTheme.bind(this));
    }
  
    // Toggles the theme between 'night' and 'day'
    toggleTheme() {
      const currentTheme =
        document.documentElement.style.getPropertyValue("--color-dark") ===
        "255, 255, 255"
          ? "night"
          : "day";
      const newTheme = currentTheme === "night" ? "day" : "night";
      applyTheme(newTheme);
    }
  
    // Renders the toggle button
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          button {
            padding: 0.5rem 1rem;
            background-color: var(--color-dark);
            color: var(--color-light);
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
        <button>Toggle Theme</button>
      `;
    }
  };
  
  // Define the custom element
  customElements.define("theme-toggle", ThemeToggleComponent);