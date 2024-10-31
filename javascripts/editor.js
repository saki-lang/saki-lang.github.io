import * as shiki from 'https://cdn.jsdelivr.net/npm/shiki@1.22.1/+esm'
import  { shikiToMonaco } from 'https://cdn.jsdelivr.net/npm/@shikijs/monaco@1.22.1/+esm'
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/+esm'

const colorSchemeMetaTag = document.querySelector('meta[name="color-scheme"]');
if (colorSchemeMetaTag) {
    // Create a MutationObserver to watch for attribute changes
    const observer = new MutationObserver(() => updateTheme());
    // Start observing the `content` attribute on the meta tag
    observer.observe(colorSchemeMetaTag, {
        attributes: true, // Only observe attribute changes
        attributeFilter: ["content"], // Only watch the `content` attribute
    });
}

setUpEditor().then(() => {
    for (let element of document.getElementsByClassName('code-editor')) {
        createEditor(element, null, true, true)
    }

    for (let element of document.getElementsByClassName('playground-editor')) {
        createEditor(element, null, true, false)
    }

    // for (let element of document.getElementsByClassName('result-editor')) {
    //     createEditor(element, null, false, true)
    // }
})

async function createEditor(element, overrideContent = null, doHighlight = true, editorReadOnly = true) {
    let content = element.textContent.trim().replace(/^```|```$/g, '').trim();
    element.textContent = undefined;
    if (overrideContent) {
        content = overrideContent.trim();
    }
    let language = "text";
    if (doHighlight) language = 'saki';
    let darkMode = document.querySelector('meta[name="color-scheme"]').getAttribute("content");

    let editorConfig = {
        value: content,
        language: language,
        theme: darkMode === 'dark' ? 'dark-plus' : 'github-light',
        automaticLayout: true,
        minimap: { enabled: false }, // Disable minimap if desired
        scrollBeyondLastLine: !editorReadOnly, // Prevent scrolling beyond the last line
        scrollbar: {
            vertical: editorReadOnly ? "hidden" : "visible",   // Disables vertical scroll bar
            alwaysConsumeMouseWheel: !editorReadOnly,
        },
        cursorSmoothCaretAnimation: 'on',
        readOnly: editorReadOnly,
        cursorBlinking: editorReadOnly ? 'hidden' : 'smooth',
        unicodeHighlight: { ambiguousCharacters: false },
        lineNumbersMinChars: 4,
        lineDecorationsWidth: 0,
        lineHeight: 1.5,
        padding: { top: 10, bottom: 10 }
    }

    if (editorReadOnly) {
        editorConfig.renderLineHighlight = 'none';
        editorConfig.lineNumbers = 'off';
        editorConfig.glyphMargin = false;
        editorConfig.folding = false;
        editorConfig.lineDecorationsWidth = 16;
        editorConfig.lineNumbersMinChars = 0;
    }

    let codeEditor = await monaco.editor.create(element, editorConfig);

    if (editorReadOnly) {
        const resizeEditor = () => {
            const editorHeight = codeEditor.getContentHeight(); // minimum height
            codeEditor.layout({ width: codeEditor.getLayoutInfo().width, height: editorHeight });
        };
        codeEditor.onDidContentSizeChange(resizeEditor);
    }

    element.codeEditor = codeEditor;
    updateTheme();
}

async function setUpEditor() {
    const grammar = (await fetch('/assets/Saki.tmLanguage.json')).json();
    const langConf = (await fetch('/assets/language-configuration.json')).json();
    const highlighter = await shiki.createHighlighter({
        themes: [
            'dark-plus',
            'github-light',
        ],
        langs: [ grammar ],
    });
    monaco.languages.register({ id: 'saki' });
    monaco.languages.setLanguageConfiguration('saki', langConf);
    shikiToMonaco(highlighter, monaco);
}

async function updateTheme() {
    let darkMode = document.querySelector('meta[name="color-scheme"]').getAttribute("content");
    monaco.editor.setTheme(darkMode === 'dark' ? 'dark-plus' : 'github-light');
}

export async function runCodeInEditor(codeEditorElementId, resultEditorElementId) {
    let codeEditorElement = document.getElementById(codeEditorElementId);
    let resultEditorElement = document.getElementById(resultEditorElementId);
    await createEditor(resultEditorElement, null, false, true);
    let code = codeEditorElement.codeEditor.getValue();
    resultEditorElement.codeEditor.setValue("Running...");
    resultEditorElement.style.display = "flex";
    fetch("https://api.saki-lang.tech/v1/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sandbox: "saki",
            command: "run",
            files: { "": code },
        }),
    }).then(response => response.json()).then(data => {
        resultEditorElement.codeEditor.setValue(data.stdout);
    }).catch(error => {
        resultEditorElement.codeEditor.setValue(error.message);
    });
}

window.runCodeInEditor = runCodeInEditor;
