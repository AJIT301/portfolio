function copyToClipboard(event, text) {
    event.stopPropagation();
    navigator.clipboard.writeText(text).then(function() {
        alert('Text copied successfully!');
    }, function() {
        alert('Failed to copy text.');
    });
}

function positionTooltip() {
    const link = document.querySelector('footer p a.section-link');
    const tooltip = document.querySelector('footer .tooltip');
    if (link && tooltip) {
        const rect = link.getBoundingClientRect();
        tooltip.style.top = `${rect.top + rect.height / 2}px`;
        tooltip.style.left = `${rect.right + 10}px`;
    }
}

