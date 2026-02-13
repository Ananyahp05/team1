document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const outputPanel = document.getElementById('output-panel');
    const generateBtn = document.getElementById('generate-btn');
    const loader = document.getElementById('loader');
    const btnText = generateBtn.querySelector('.btn-text');
    const tabs = document.querySelectorAll('.tab-item');

    let activePlatform = 'twitter';

    // Handle Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activePlatform = tab.dataset.platform;
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI State: Loading
        generateBtn.disabled = true;
        loader.style.display = 'block';
        btnText.style.opacity = '0.5';

        const formData = {
            topic: document.getElementById('topic').value,
            platform: activePlatform,
            tone: document.getElementById('tone').value,
            target: document.getElementById('target').value || 'general audience'
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/generate', {
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

    // Settings Logic
    const settingsModal = document.getElementById('settings-modal');
    const settingsForm = document.getElementById('settings-form');
    const closeSettings = document.getElementById('close-settings');

    // Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            if (item.textContent === 'History') {
                alert('History feature coming soon! Your previous generations will appear here.');
            } else if (item.textContent === 'Settings') {
                settingsModal.style.display = 'flex';
                // Load existing settings
                document.getElementById('api-key').value = localStorage.getItem('socialgen_api_key') || '';
                document.getElementById('default-tone').value = localStorage.getItem('socialgen_tone') || 'professional';
                document.getElementById('custom-instructions').value = localStorage.getItem('socialgen_instructions') || '';
            }
        });
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        navItems[0].click(); // Reset to Dashboard
    });

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('socialgen_api_key', document.getElementById('api-key').value);
        localStorage.setItem('socialgen_tone', document.getElementById('default-tone').value);
        localStorage.setItem('socialgen_instructions', document.getElementById('custom-instructions').value);

        // Update current form tone if it matches default
        document.getElementById('tone').value = document.getElementById('default-tone').value;

        alert('Settings saved successfully! ✨');
        settingsModal.style.display = 'none';
        navItems[0].click();
    });

    // Close modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings.click();
    });

    function renderResult(data) {
        const placeholder = document.getElementById('placeholder-content');
        if (placeholder) placeholder.remove();

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = `result-card ${data.platform}-theme`;

        const hashtagsHtml = data.hashtags.map(tag => `<span class="tag">${tag}</span>`).join('');

        card.innerHTML = `
            <div class="result-header">
                <div>
                    <span class="platform-badge">${data.platform}</span>
                    <span class="char-counter">${data.metadata.char_count} chars</span>
                </div>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="result-body">
                <div class="content-text">${data.content}</div>
                <div class="hashtag-container">${hashtagsHtml}</div>
            </div>
            <div class="result-actions">
                <button class="secondary-btn copy-btn">Copy Post</button>
                <button class="secondary-btn share-btn">Share Preview</button>
                <button class="secondary-btn edit-btn">Modify</button>
            </div>
        `;

        outputPanel.insertBefore(card, outputPanel.firstChild);

        // Copy functionality
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            const fullText = `${data.content}\n\n${data.hashtags.join(' ')}`;
            navigator.clipboard.writeText(fullText);
            copyBtn.textContent = 'Copied! ✨';
            setTimeout(() => copyBtn.textContent = 'Copy Post', 2000);
        });

        // Share functionality
        const shareBtn = card.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => {
            // Social share intent mockup
            const shareText = encodeURIComponent(`${data.content}\n\nGenerated by SocialGen AI`);
            const shareUrl = data.platform === 'twitter'
                ? `https://twitter.com/intent/tweet?text=${shareText}`
                : `https://www.linkedin.com/sharing/share-offsite/?text=${shareText}`;

            window.open(shareUrl, '_blank');
        });

        // Edit functionality mockup
        const editBtn = card.querySelector('.edit-btn');
        const bodyText = card.querySelector('.content-text');
        editBtn.addEventListener('click', () => {
            if (editBtn.textContent === 'Modify') {
                bodyText.contentEditable = true;
                bodyText.focus();
                editBtn.textContent = 'Save';
                editBtn.style.backgroundColor = 'var(--primary)';
            } else {
                bodyText.contentEditable = false;
                editBtn.textContent = 'Modify';
                editBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }
        });
    }
});
