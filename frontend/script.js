document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const outputPanel = document.getElementById('output-panel');
    const generateBtn = document.getElementById('generate-btn');
    const loader = document.getElementById('loader');
    const btnText = generateBtn.querySelector('.btn-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI State: Loading
        generateBtn.disabled = true;
        loader.style.display = 'block';
        btnText.style.opacity = '0.5';

        const formData = {
            topic: document.getElementById('topic').value,
            platform: document.getElementById('platform').value,
            tone: document.getElementById('tone').value,
            target: document.getElementById('target').value || 'general audience'
        };

        try {
            const response = await fetch('http://localhost:5000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to generate content');

            const data = await response.json();
            renderResult(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Could not connect to the backend. Make sure the Python server is running!');
        } finally {
            // UI State: Reset
            generateBtn.disabled = false;
            loader.style.display = 'none';
            btnText.style.opacity = '1';
        }
    });

    function renderResult(data) {
        // Remove placeholder if it exists
        const placeholder = document.getElementById('placeholder-content');
        if (placeholder) placeholder.remove();

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <div class="result-header">
                <span class="platform-badge">${data.platform}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="result-body">
                ${data.content}
            </div>
            <div class="result-actions">
                <button class="secondary-btn copy-btn">Copy to Clipboard</button>
                <button class="secondary-btn">Edit</button>
            </div>
        `;

        // Prepend to show latest on top
        outputPanel.insertBefore(card, outputPanel.firstChild);

        // Add copy functionality
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(data.content);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy to Clipboard', 2000);
        });
    }
});
