
/* Component dashboard: Render code tabs for every example. */
const components = document.querySelectorAll('.js-component');

/* Escape nothing manually: textContent safely displays HTML source as text. */
const formatHTML = (element) => {
    // Copy the preview before serializing so live component changes do not alter the displayed markup.
    const clone = element.cloneNode(true);

    // Omit dynamically generated carousel dots, preserving the original source markup.
    clone.querySelectorAll('.js-carousel-dot').forEach((dot) => dot.remove());

    // Strip runtime state from accordion and carousel elements.
    clone.querySelectorAll('[style]').forEach((node) => node.removeAttribute('style'));
    clone.querySelectorAll('.active').forEach((node) => node.classList.remove('active'));
    clone.querySelectorAll('.js-accordion-header').forEach((node) => node.setAttribute('aria-expanded', 'false'));
    clone.querySelectorAll('.js-accordion-content').forEach((node) => node.setAttribute('inert', ''));

    // Normalize line endings and remove surrounding whitespace.
    const html = clone.innerHTML.replace(/\r\n?/g, '\n').trim();
    const lines = html.split('\n');

    // The first line starts at column zero after trim(), so exclude it
    // when finding the common indentation of subsequent lines.
    const indents = lines.slice(1)
        .filter((line) => line.trim() !== '')
        .map((line) => line.match(/^[\t ]*/)[0].length);

    const commonIndent = indents.length ? Math.min(...indents) : 0;

    // Preserve nested indentation while aligning the outer HTML correctly.
    return lines
        .map((line, index) => index === 0 ? line : line.slice(commonIndent))
        .join('\n');
};

/* Load component source files; run through a local server so fetch can read them. */
async function readSources(paths) {

    // Return a message when the component does not require a source file.
    if (!paths) return 'No JavaScript is required for this component.';

    // Split multiple source paths into individual filenames.
    const files = paths.split('|').filter(Boolean);

    // Load all source files and combine their contents.
    const contents = await Promise.all(files.map(async (path) => {

        // Attempt to retrieve the requested source file.
        try {

            // Fetch the source file from the project.
            const response = await fetch(path);

            // Throw an error if the response was unsuccessful.
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            // Return the source filename followed by its contents.
            return `/* Source: ${path} */\n${await response.text()}`;

        } catch (error) {

            // Display an informative message if the file cannot be loaded.
            return `/* Could not load ${path}. Run the site using a local web server and check this file path. */`;

        }

    }));

    // Combine multiple source files into a single string.
    return contents.join('\n\n');
}

/* Component Setup: Initialize code panels for every documented component. */
components.forEach((section, sectionIndex) => {

    // Preview: Select the element containing the live component.
    const preview = section.querySelector('.js-preview');

    // Showcase: Select the container that will hold the code panel.
    const showcase = section.querySelector('.component-showcase');

    // Title: Read the component name for accessibility labels.
    const title = section.querySelector('h2')?.textContent.trim() || `Component ${sectionIndex + 1}`;

    // Snippets: Store HTML immediately and load CSS/JavaScript when selected.
    const snippets = { html: formatHTML(preview), css: null, javascript: null };

    /* Toolbar: Create the container for language tabs and the copy button. */

    // Create Toolbar: Generate a container element.
    const toolbar = document.createElement('div');

    // Toolbar Class: Apply the dashboard toolbar styling.
    toolbar.className = 'component-code-toolbar';

    // Create Tabs: Generate the language tab container.
    const tabs = document.createElement('div');

    // Tabs Class: Apply the dashboard tab styling.
    tabs.className = 'component-tabs';

    // Tab Role: Identify the element as a tab list.
    tabs.setAttribute('role', 'tablist');

    // Tab Label: Provide an accessible description.
    tabs.setAttribute('aria-label', `${title} code languages`);

    /* Copy Button: Create the button used to copy the displayed code. */

    // Create Button: Generate a new button element.
    const copyButton = document.createElement('button');

    // Button Type: Prevent accidental form submission.
    copyButton.type = 'button';

    // Button Class: Apply the dashboard copy button styling.
    copyButton.className = 'component-copy';

    // Button Text: Set the default copy button label.
    copyButton.textContent = 'Copy code';

    /* Code Viewer: Create the area for displaying source code. */

    // Create Viewer: Generate a preformatted text container.
    const codeView = document.createElement('pre');

    // Viewer Class: Apply the dashboard code viewer styling.
    codeView.className = 'component-code';

    // Create Code: Generate an element to contain source text.
    const code = document.createElement('code');

    // Append Code: Place the code element inside the preformatted container.
    codeView.appendChild(code);

    // Panel ID: Generate a unique identifier for each component panel.
    const panelId = `component-code-${sectionIndex}`;

    // Viewer ID: Apply the unique panel identifier.
    codeView.id = panelId;

    // Panel Role: Identify the source viewer as a tab panel.
    codeView.setAttribute('role', 'tabpanel');

    // Keyboard Access: Allow keyboard users to focus the code panel.
    codeView.tabIndex = 0;

    // Current Language: Track the currently selected code language.
    let currentLanguage = 'html';

    /* Show Language: Switch the displayed source code and selected tab. */
    async function showLanguage(language) {

        // Update Language: Store the newly selected language.
        currentLanguage = language;

        // Display Source: Show the source or a loading message.
        code.textContent = snippets[language] ?? 'Loading source…';

        // Tab Loop: Update the state of every language tab.
        for (const tab of tabs.querySelectorAll('[role="tab"]')) {

            // Selection Check: Determine whether this is the active tab.
            const selected = tab.dataset.language === language;

            // Accessibility State: Update the selected tab attribute.
            tab.setAttribute('aria-selected', String(selected));

            // Keyboard Navigation: Keep only the active tab in the normal tab order.
            tab.tabIndex = selected ? 0 : -1;

            // Panel Label: Associate the code panel with its active tab.
            if (selected) codeView.setAttribute('aria-labelledby', tab.id);

        }

        // Source Check: Load the requested CSS or JavaScript if needed.
        if (snippets[language] === null) {

            // Source Key: Map the selected language to its HTML data attribute.
            const key = language === 'css' ? 'css' : 'js';

            // Fetch Source: Retrieve the component's corresponding source files.
            snippets[language] = await readSources(section.dataset[key]);

            // Display Check: Ensure the user has not switched tabs during loading.
            if (currentLanguage === language) {

                // Update Viewer: Display the newly loaded source code.
                code.textContent = snippets[language];

            }

        }

    }

    /* Language Tabs: Generate HTML, CSS and JavaScript navigation buttons. */

    // Language Loop: Create one tab for each supported language.
    for (const [language, label] of [['html', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript']]) {

        // Create Tab: Generate a new button element.
        const tab = document.createElement('button');

        // Button Type: Prevent accidental form submission.
        tab.type = 'button';

        // Tab Class: Apply the dashboard language tab styling.
        tab.className = 'component-tab';

        // Tab ID: Generate a unique identifier for accessibility.
        tab.id = `component-tab-${sectionIndex}-${language}`;

        // Language Attribute: Store the language associated with this tab.
        tab.dataset.language = language;

        // Tab Label: Display the language name.
        tab.textContent = label;

        // Tab Role: Identify the element as an accessible tab.
        tab.setAttribute('role', 'tab');

        // Panel Relationship: Associate the tab with the code panel.
        tab.setAttribute('aria-controls', panelId);

        // Initial State: Select HTML as the default tab.
        tab.setAttribute('aria-selected', String(language === 'html'));

        // Keyboard State: Make only the initial tab tabbable.
        tab.tabIndex = language === 'html' ? 0 : -1;

        // Click Event: Display the corresponding language when clicked.
        tab.addEventListener('click', () => showLanguage(language));

        /* Keyboard Navigation: Support left and right arrow keys. */
        tab.addEventListener('keydown', (event) => {

            // Key Check: Ignore keys other than left and right arrows.
            if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;

            // Prevent Default: Stop the browser from scrolling horizontally.
            event.preventDefault();

            // Tab Collection: Get all tabs within the current component.
            const allTabs = [...tabs.querySelectorAll('[role="tab"]')];

            // Direction: Determine whether to navigate forwards or backwards.
            const offset = event.key === 'ArrowRight' ? 1 : -1;

            // Next Tab: Calculate the next tab, wrapping when necessary.
            const nextTab = allTabs[(allTabs.indexOf(tab) + offset + allTabs.length) % allTabs.length];

            // Focus Tab: Move keyboard focus to the new tab.
            nextTab.focus();

            // Display Source: Activate the new language tab.
            showLanguage(nextTab.dataset.language);

        });

        // Append Tab: Insert the generated tab into the tab list.
        tabs.appendChild(tab);

    }

    /* Copy Code: Copy the currently displayed source to the clipboard. */
    copyButton.addEventListener('click', async () => {

        // Clipboard Operation: Attempt to copy the current source text.
        try {

            // Copy Text: Write the displayed code to the system clipboard.
            await navigator.clipboard.writeText(code.textContent);

            // Success State: Show confirmation after copying.
            copyButton.textContent = 'Copied!';

            // Reset Label: Restore the original button text after a short delay.
            setTimeout(() => { copyButton.textContent = 'Copy code'; }, 1600);

        } catch (error) {

            // Error State: Inform the user if copying was unsuccessful.
            copyButton.textContent = 'Copy failed';

            // Reset Label: Restore the original button text after a short delay.
            setTimeout(() => { copyButton.textContent = 'Copy code'; }, 1600);

        }

    });

    /* Assemble Code Panel: Add the navigation toolbar and code viewer. */

    // Append Toolbar Contents: Insert tabs and copy button.
    toolbar.append(tabs, copyButton);

    // Append Code Panel: Position the code toolbar and viewer beneath the preview.
    showcase.append(toolbar, codeView);

    // Initial Language: Display HTML when the dashboard loads.
    showLanguage('html');

});

/* Mobile Navigation: Control the responsive dashboard sidebar. */

// Menu Toggle: Select the mobile navigation button.
const menuToggle = document.querySelector('.js-menu-toggle');

// Sidebar: Select the dashboard navigation sidebar.
const sidebar = document.querySelector('.dashboard-sidebar');

// Menu Click: Open or close the sidebar when the toggle is clicked.
menuToggle?.addEventListener('click', () => {

    // Toggle Sidebar: Add or close the sidebar.
    const open = sidebar.classList.toggle('is-open');

    // Accessibility State: Update whether the menu is expanded.
    menuToggle.setAttribute('aria-expanded', String(open));

});

// Sidebar Links: Select navigation links and close the mobile menu on selection.
sidebar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {

    // Close Sidebar: Remove the open state.
    sidebar.classList.remove('is-open');

    // Accessibility State: Mark the mobile navigation as collapsed.
    menuToggle?.setAttribute('aria-expanded', 'false');

}));

/* Active Sidebar Link: Highlight the currently selected component section. */
function markActiveLink() {

    // Navigation Loop: Examine every component navigation link.
    sidebar?.querySelectorAll('.dashboard-nav a').forEach((link) => {

        // Current Location: Highlight the link matching the URL hash.
        if (link.hash === location.hash) {

            // Active State: Mark the current navigation location.
            link.setAttribute('aria-current', 'location');

        } else {

            // Inactive State: Remove the active state from other links.
            link.removeAttribute('aria-current');

        }

    });

}

// Hash Change: Update navigation highlighting when the URL fragment changes.
window.addEventListener('hashchange', markActiveLink);

// Initial Navigation: Highlight the current section when the dashboard loads.
markActiveLink();
