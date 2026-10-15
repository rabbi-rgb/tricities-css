
// This script will run when the document is ready.
document.addEventListener('DOMContentLoaded', function() {
    // Define the specific URL where this script should run
    const targetUrl = 'https://www.jewishtricities.com/templates/section_cdo/aid/6326564/jewish/Hebrew-School.htm';

    // Check if the current page's URL matches the target URL
    if (window.location.href === targetUrl) {
        // Select the paragraph element with the class 'HeaderTitle'
        const headerElement = document.querySelector('p.HeaderTitle');

        // Check if the element exists to prevent errors
        if (headerElement) {
            // Get the current text content of the element
            let currentText = headerElement.textContent;

            // Replace 'Schools' with 'School'
            // Using replace() will only replace the first occurrence, which is fine here.
            // For case-insensitive or global replacement, more advanced regex would be needed,
            // but for this specific request, a simple replace is sufficient.
            const newText = currentText.replace('Schools', 'School');

            // Update the text content of the element
            headerElement.textContent = newText;

            console.log("Header text updated successfully on the target page!");
        } else {
            console.warn("Element with class 'HeaderTitle' not found on the target page.");
        }
    } else {
        console.log("Script not running: Current page is not the target page.");
    }
});
