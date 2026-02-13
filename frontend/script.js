// Mouse Glow Effect Logic
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});

// ... rest of existing code ...
const form = document.getElementById('generator-form');
const outputPanel = document.getElementById('output-panel');
const generateBtn = document.getElementById('generate-btn');
const loader = document.getElementById('loader');
const btnText = generateBtn.querySelector('.btn-text');
const tabs = document.querySelectorAll('.tab-item');

let activePlatform = 'twitter';

// Brand Identity State
let brandName = localStorage.getItem('socialgen_brand_name') || 'SocialStudio';
let brandHandle = localStorage.getItem('socialgen_brand_handle') || '@studio_ai';

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

function updateDevicePreview(data = null) {
    const previewEl = document.getElementById('device-preview');
    if (!data) {
        previewEl.innerHTML = `<div class="preview-placeholder" style="color: #64748b; padding: 2rem; text-align: center;">Wait for generation...</div>`;
        return;
    }

    const platform = data.platform;
    let previewHtml = '';

    if (platform === 'twitter') {
        previewHtml = `
                <div class="tw-nav" style="padding: 12px; border-bottom: 1px solid #f2f2f2; background: #fff; position: sticky; top: 0;">
                    <span style="font-weight: 800; font-size: 18px;">Post</span>
                </div>
                <div class="tw-post" style="padding: 16px;">
                    <div style="display: flex; gap: 12px;">
                        <div style="width: 44px; height: 44px; background: linear-gradient(45deg, #1d9bf0, #8ed0f8); border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white;">${brandName[0]}</div>
                        <div>
                            <div style="display: flex; gap: 4px; align-items: center;">
                                <span style="font-weight: 700;">${brandName}</span>
                                <span style="color: #536471; font-size: 14px;">${brandHandle} · 1m</span>
                            </div>
                            <p style="margin-top: 4px; font-size: 15px; line-height: 1.4; color: #0f1419;">${data.content}</p>
                            <div style="color: #1d9bf0; margin-top: 10px; font-size: 14px;">${data.hashtags.join(' ')}</div>
                            <div style="display: flex; justify-content: space-between; margin-top: 15px; color: #536471; font-size: 13px; max-width: 200px;">
                                <span>💬 0</span> <span>🔁 0</span> <span>❤️ 0</span> <span>📊 0</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    } else if (platform === 'instagram') {
        previewHtml = `
                <div style="padding: 12px; border-bottom: 1px solid #efefef; display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-radius: 50%;"></div>
                    <span style="font-weight: 600; font-size: 14px;">${brandName}</span>
                </div>
                <div style="width: 100%; aspect-ratio: 1; background: #fafafa; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">📸</div>
                    <div style="color: #8e8e8e; font-size: 12px;">Image Preview Not Available</div>
                </div>
                <div style="padding: 12px;">
                    <div style="display: flex; gap: 15px; margin-bottom: 10px; font-size: 20px;">
                        ❤️ 💬 🚀 <span style="margin-left: auto;">🔖</span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.4;">
                        <span style="font-weight: 600;">${brandName}</span> ${data.content}
                        <div style="color: #00376b; margin-top: 5px;">${data.hashtags.join(' ')}</div>
                    </div>
                    <div style="color: #8e8e8e; font-size: 11px; margin-top: 8px; text-transform: uppercase;">1 minute ago</div>
                </div>
            `;
    } else {
        previewHtml = `
                <div style="padding: 20px; font-size: 14px;">
                    <strong>${brandName}</strong> posted:<br><br>
                    ${data.content}<br><br>
                    ${data.hashtags.join(' ')}
                </div>
            `;
    }

    previewEl.innerHTML = previewHtml;
}

// Initial Preview State
updateDevicePreview();

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
            alert('History feature coming soon!');
        } else if (item.textContent === 'Settings') {
            settingsModal.style.display = 'flex';
            // Load existing settings
            document.getElementById('brand-name').value = localStorage.getItem('socialgen_brand_name') || '';
            document.getElementById('brand-handle').value = localStorage.getItem('socialgen_brand_handle') || '';
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
    brandName = document.getElementById('brand-name').value || 'SocialStudio';
    brandHandle = document.getElementById('brand-handle').value || '@studio_ai';

    localStorage.setItem('socialgen_brand_name', brandName);
    localStorage.setItem('socialgen_brand_handle', brandHandle);
    localStorage.setItem('socialgen_api_key', document.getElementById('api-key').value);
    localStorage.setItem('socialgen_tone', document.getElementById('default-tone').value);
    localStorage.setItem('socialgen_instructions', document.getElementById('custom-instructions').value);

    // Update current form tone if it matches default
    document.getElementById('tone').value = document.getElementById('default-tone').value;

    alert('Studio Identity Updated! ✨');
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
