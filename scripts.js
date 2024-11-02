import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Declared a function to create HTML element
const createElement = (tag, classNames, attributes, htmlContent) => {
    const element = document.createElement(tag);
    if (classNames) {element.classList = classNames};
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    if (htmlContent) element.innerHTML = htmlContent;
    return element; // Returns the configured element object 
};

const starting = document.createDocumentFragment()

// Function declared, updated code readability. 
const createPreviewButton = ({ author, id, image, title }) => {
    const element = createElement('button', 'preview', {'data-preview': id});
    element.innerHTML = `
        <img
            class="preview__image" src="${image}"/>
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;
    return element; 
};

const createOptionElement = (value, text) => {
    const element = createElement('option', null, { value }, text);
    return element;
};
const updateTheme = () => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDarkMode ? 'night' : 'day';
    const darkColor = prefersDarkMode ? '255, 255, 255' : '10, 10, 20';
    const lightColor = prefersDarkMode ? '10, 10, 20' : '255, 255, 255';
    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', darkColor);
    document.documentElement.style.setProperty('--color-light', lightColor);
};

const updateListButton = () => {
    const remainingBooks = books.length - BOOKS_PER_PAGE;
    const button = document.querySelector('[data-list-button]');
    button.innerText = `Show more (${remainingBooks})`;
    button.disabled = remainingBooks > 0;
};

const renderBooks = (matches) => {
    const fragment = document.createDocumentFragment();
    matches.slice(0, BOOKS_PER_PAGE).forEach((book) => {
        const element = createPreviewButton(book);
        fragment.appendChild(element);
    });
    document.querySelector('[data-list-items]').appendChild(fragment);
};

const renderDropdownOptions = (data, selector) => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createOptionElement('any', `All ${selector}`));
    Object.entries(data).forEach(([id, name]) => {
        fragment.appendChild(createOptionElement(id, name));
    });
    document.querySelector(`[data-search-${selector}]`).appendChild(fragment);
};

const applyListeners = () => {
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    });

    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
    });

    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false;
    });

    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', darkColor);
        document.documentElement.style.setProperty('--color-light', lightColor);
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        const result = books.filter((book) => {
            let genreMatch = filters.genre === 'any';
            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true; }
            }
            return (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (filters.author === 'any' || book.author === filters.author) &&
                genreMatch
            );
        });
        page = 1;
        matches = result;
        document.querySelector('[data-list-message]').classList.toggle('list__message_show', result.length < 1);
        document.querySelector('[data-list-items]').innerHTML = '';
        renderBooks(result);
        updateListButton();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-list-button]').addEventListener('click', () => {
        const fragment = document.createDocumentFragment();
        matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE).forEach((book) => {
            const element = createPreviewButton(book);
            fragment.appendChild(element);
        });
        document.querySelector('[data-list-items]').appendChild(fragment);
        page += 1;
    });

    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
        const target = event.target.closest('[data-preview]');
        if (target) {
            const book = books.find((item) => item.id === target.dataset.preview);
            document.querySelector('[data-list-active]').open = true;
            document.querySelector('[data-list-blur]').src = book.image;
            document.querySelector('[data-list-image]').src = book.image;
            document.querySelector('[data-list-title]').innerText = book.title;
            document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
            document.querySelector('[data-list-description]').innerText = book.description;
        }
    });
};

let page = 1;
let matches = books;
//Implementing abstraction using factory functions.
    renderBooks(books);
    renderDropdownOptions(genres, 'genres');
    renderDropdownOptions(authors, 'authors');
    updateTheme();
    updateListButton();
    applyListeners();