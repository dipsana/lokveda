/* FORM LOADER MODULE: Loads forms via URLSearchParams */

const formParam = new URLSearchParams(window.location.search).get("form"),
    formContainer = document.getElementById("form-container");

if (formParam) {
    const formPath = `../forms/${formParam}.html`;
    {
        const formTitle = document.getElementById('form-title');
        formTitle?.remove();
    }

    (async function loadForm() {
        try {
            const response = await fetch(formPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            formContainer.innerHTML = await response.text() + `
                    <div class="btn-grp">
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                    </div>
                </form>`;

            const h1 = formContainer.querySelector('h1');
            if (h1) document.title = h1.textContent;
        } catch (err) {
            formContainer.innerHTML = "<p>Error loading form.</p>";
            console.error("Error loading form:", err);
        }
    })();
} else formContainer.innerHTML = "<p>Form not found.</p>";