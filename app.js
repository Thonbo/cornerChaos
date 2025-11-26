// Box class
class Box {
    constructor(container, corners, content, id) {
        this.container = container;
        this.corners = corners;
        this.content = content;
        this.id = id;
        this.width = 0;
        this.height = 0;
    }

    updateSize(width, height) {
        const changed = (this.width !== width || this.height !== height);
        this.width = width;
        this.height = height;
        return changed;
    }

    render() {
        const { width, height, corners, content, id } = this;

        const tlPath = CORNER_PATHS[corners.topLeft];
        const trPath = CORNER_PATHS[corners.topRight];
        const blPath = BOTTOM_CORNER_PATHS[corners.bottomLeft];
        const brPath = BOTTOM_CORNER_PATHS[corners.bottomRight];

        const edgeWidth = width - (CORNER_WIDTH * 2);
        const bodyHeight = height - (CORNER_HEIGHT * 2);

        // For videos, use SVG with foreignObject to properly mask
        if (content.type === 'video') {
            this.container.innerHTML = `
                <svg width="${width}" height="${height}" style="display: block;">
                    <defs>
                        <mask id="boxMask${id}">
                            <!-- Top left corner -->
                            <path d="${tlPath}" fill="white"/>

                            <!-- Top edge -->
                            <rect x="${CORNER_WIDTH}" y="0" width="${edgeWidth}" height="${CORNER_HEIGHT}" fill="white"/>

                            <!-- Top right corner (mirrored) -->
                            <g transform="translate(${width - CORNER_WIDTH}, 0)">
                                <g transform="scale(-1, 1) translate(-${CORNER_WIDTH}, 0)">
                                    <path d="${trPath}" fill="white"/>
                                </g>
                            </g>

                            <!-- Body -->
                            <rect x="0" y="${CORNER_HEIGHT}" width="${width}" height="${bodyHeight}" fill="white"/>

                            <!-- Bottom left corner -->
                            <g transform="translate(0, ${height - CORNER_HEIGHT})">
                                <path d="${blPath}" fill="white"/>
                            </g>

                            <!-- Bottom edge -->
                            <rect x="${CORNER_WIDTH}" y="${height - CORNER_HEIGHT}" width="${edgeWidth}" height="${CORNER_HEIGHT}" fill="white"/>

                            <!-- Bottom right corner (mirrored) -->
                            <g transform="translate(${width - CORNER_WIDTH}, ${height - CORNER_HEIGHT})">
                                <g transform="scale(-1, 1) translate(-${CORNER_WIDTH}, 0)">
                                    <path d="${brPath}" fill="white"/>
                                </g>
                            </g>
                        </mask>
                    </defs>

                    <g mask="url(#boxMask${id})">
                        <foreignObject x="0" y="0" width="${width}" height="${height}">
                            <div xmlns="http://www.w3.org/1999/xhtml" style="width: ${width}px; height: ${height}px; overflow: hidden; background: #000;">
                                <video id="video${id}" autoplay loop muted playsinline
                                       style="width: 100%; height: 100%; object-fit: cover;">
                                    <source src="${content.value}" type="video/mp4">
                                </video>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            `;

            // Start video playback
            const video = this.container.querySelector(`#video${id}`);
            if (video) {
                video.play().catch(e => console.log('Video autoplay prevented:', e));
            }
            return;
        }

        // Generate pattern/image or direct color
        let fillDef = '';
        let fillValue = '';

        if (content.type === 'image') {
            fillDef = `
                <pattern id="imgPattern${id}" patternUnits="userSpaceOnUse" width="${width}" height="${height}">
                    <image href="${content.value}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
                </pattern>
            `;
            fillValue = `url(#imgPattern${id})`;
        } else if (content.type === 'pattern') {
            // Generate checkerboard pattern
            const patternSize = 40;
            fillDef = `
                <pattern id="pattern${id}" patternUnits="userSpaceOnUse" width="${patternSize}" height="${patternSize}">
                    <rect x="0" y="0" width="${patternSize/2}" height="${patternSize/2}" fill="#2196F3"/>
                    <rect x="${patternSize/2}" y="${patternSize/2}" width="${patternSize/2}" height="${patternSize/2}" fill="#2196F3"/>
                    <rect x="${patternSize/2}" y="0" width="${patternSize/2}" height="${patternSize/2}" fill="#64B5F6"/>
                    <rect x="0" y="${patternSize/2}" width="${patternSize/2}" height="${patternSize/2}" fill="#64B5F6"/>
                </pattern>
            `;
            fillValue = `url(#pattern${id})`;
        } else {
            fillValue = content.value;
        }

        this.container.innerHTML = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    ${fillDef}
                    <mask id="boxMask${id}">
                        <!-- Top left corner -->
                        <path d="${tlPath}" fill="white"/>
                        
                        <!-- Top edge -->
                        <rect x="${CORNER_WIDTH}" y="0" width="${edgeWidth}" height="${CORNER_HEIGHT}" fill="white"/>
                        
                        <!-- Top right corner (mirrored) -->
                        <g transform="translate(${width - CORNER_WIDTH}, 0)">
                            <g transform="scale(-1, 1) translate(-${CORNER_WIDTH}, 0)">
                                <path d="${trPath}" fill="white"/>
                            </g>
                        </g>
                        
                        <!-- Body -->
                        <rect x="0" y="${CORNER_HEIGHT}" width="${width}" height="${bodyHeight}" fill="white"/>
                        
                        <!-- Bottom left corner -->
                        <g transform="translate(0, ${height - CORNER_HEIGHT})">
                            <path d="${blPath}" fill="white"/>
                        </g>
                        
                        <!-- Bottom edge -->
                        <rect x="${CORNER_WIDTH}" y="${height - CORNER_HEIGHT}" width="${edgeWidth}" height="${CORNER_HEIGHT}" fill="white"/>
                        
                        <!-- Bottom right corner (mirrored) -->
                        <g transform="translate(${width - CORNER_WIDTH}, ${height - CORNER_HEIGHT})">
                            <g transform="scale(-1, 1) translate(-${CORNER_WIDTH}, 0)">
                                <path d="${brPath}" fill="white"/>
                            </g>
                        </g>
                    </mask>
                </defs>
                
                <rect x="0" y="0" width="${width}" height="${height}" fill="${fillValue}" mask="url(#boxMask${id})"/>
            </svg>
        `;
    }

    updateAndRender() {
        const rect = this.container.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        
        if (this.updateSize(width, height)) {
            this.render();
        }
    }
}

// App class
class App {
    constructor(config) {
        this.boxes = [];
        this.resizeObserver = null;
        this.config = JSON.parse(JSON.stringify(config)); // Deep clone
        this.images = [];
        this.videos = [];

        this.buildConfigUI();
        this.loadMedia().then(() => {
            this.regenerate();
        });
    }

    async loadMedia() {
        try {
            // Load image and video list from images.json
            const response = await fetch('images.json');
            if (response.ok) {
                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    // Separate images and videos
                    this.images = data.images.filter(file => !file.endsWith('.mp4'));
                    this.videos = data.images.filter(file => file.endsWith('.mp4'));
                    console.log(`Loaded ${this.images.length} images and ${this.videos.length} videos`);
                }
            }
        } catch (error) {
            console.log('No media found, using colors only');
        }
    }

    downloadConfig() {
        const dataStr = JSON.stringify(this.config, null, 4);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    shareConfig() {
        // Encode config as base64 for URL
        const configStr = JSON.stringify(this.config);
        const encoded = btoa(configStr);

        // Create shareable URL
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?config=${encodeURIComponent(encoded)}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('✅ Shareable URL copied to clipboard!\n\nAnyone with this link can view your current configuration.');
        }).catch(err => {
            // Fallback: show URL in prompt
            prompt('Copy this shareable URL:', shareUrl);
        });
    }

    static loadConfigFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const configParam = urlParams.get('config');

        if (configParam) {
            try {
                const decoded = atob(decodeURIComponent(configParam));
                const config = JSON.parse(decoded);
                console.log('Loaded config from URL');
                return config;
            } catch (error) {
                console.error('Failed to parse config from URL:', error);
                return null;
            }
        }

        return null;
    }

    async saveToGitHub() {
        // Get GitHub token from localStorage (or prompt user)
        let token = localStorage.getItem('github_token');

        if (!token) {
            token = prompt('Please enter your GitHub Personal Access Token:\n\n(Create one at: https://github.com/settings/tokens/new with "repo" permission)\n\nThe token will be saved locally for future use.');

            if (!token) {
                alert('GitHub token is required to save to GitHub.');
                return;
            }

            // Save token for future use
            localStorage.setItem('github_token', token);
        }

        const btn = document.getElementById('btnSaveToGitHub');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Saving...';
        btn.disabled = true;

        try {
            const owner = 'Thonbo';
            const repo = 'cornerChaos';
            const branch = 'claude/access-chat-history-013LBCFoRNTFGsEZgrbYUiQA';
            const path = 'config.json';

            // Step 1: Get current file SHA
            const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
            const getResponse = await fetch(getFileUrl, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!getResponse.ok) {
                throw new Error(`Failed to get file: ${getResponse.statusText}`);
            }

            const fileData = await getResponse.json();
            const sha = fileData.sha;

            // Step 2: Update file with new config
            const content = btoa(JSON.stringify(this.config, null, 4)); // Base64 encode

            const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update config.json via web interface',
                    content: content,
                    sha: sha,
                    branch: branch
                })
            });

            if (!updateResponse.ok) {
                const error = await updateResponse.json();
                throw new Error(`Failed to update file: ${error.message || updateResponse.statusText}`);
            }

            btn.textContent = '✅ Saved!';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);

            alert('✅ Config saved to GitHub successfully!\n\nNetlify will auto-deploy if you have continuous deployment enabled.');

        } catch (error) {
            console.error('Error saving to GitHub:', error);
            btn.textContent = '❌ Error';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);

            alert(`Failed to save to GitHub:\n${error.message}\n\nPlease check:\n1. Your GitHub token is valid\n2. Token has "repo" permission\n3. You have write access to the repository`);

            // Clear invalid token
            if (error.message.includes('401') || error.message.includes('403')) {
                localStorage.removeItem('github_token');
            }
        }
    }

    buildConfigUI() {
        const topConfig = document.getElementById('topConfig');
        const bottomConfig = document.getElementById('bottomConfig');

        topConfig.innerHTML = this.config.topCorners.map((item, idx) => `
            <div class="config-item">
                <div class="corner-preview">
                    <svg viewBox="0 0 73 39">
                        <path d="${CORNER_PATHS[item.name]}" fill="black"/>
                    </svg>
                </div>
                <div class="config-item-name">${item.name}</div>
                <div class="config-item-controls">
                    <span class="toggle-label">Unique</span>
                    <label class="toggle">
                        <input type="checkbox" ${item.unique ? 'checked' : ''} 
                               data-type="top" data-index="${idx}" data-field="unique">
                        <span class="toggle-slider"></span>
                    </label>
                    
                    <span class="weight-label">Weight %</span>
                    <input type="number" 
                           class="weight-input" 
                           min="0" 
                           max="100" 
                           step="0.1" 
                           value="${item.weight}"
                           data-type="top" data-index="${idx}" data-field="weight">
                </div>
            </div>
        `).join('');

        bottomConfig.innerHTML = this.config.bottomCorners.map((item, idx) => `
            <div class="config-item">
                <div class="corner-preview">
                    <svg viewBox="0 0 73 39">
                        <path d="${BOTTOM_CORNER_PATHS[item.name]}" fill="black"/>
                    </svg>
                </div>
                <div class="config-item-name">${item.name}</div>
                <div class="config-item-controls">
                    <span class="toggle-label">Unique</span>
                    <label class="toggle">
                        <input type="checkbox" ${item.unique ? 'checked' : ''} 
                               data-type="bottom" data-index="${idx}" data-field="unique">
                        <span class="toggle-slider"></span>
                    </label>
                    
                    <span class="weight-label">Weight %</span>
                    <input type="number" 
                           class="weight-input" 
                           min="0" 
                           max="100" 
                           step="0.1" 
                           value="${item.weight}"
                           data-type="bottom" data-index="${idx}" data-field="weight">
                </div>
            </div>
        `).join('');

        // Add event delegation
        this.setupConfigListeners();
    }

    setupConfigListeners() {
        const configPanel = document.querySelector('.config-panel');
        
        configPanel.addEventListener('change', (e) => {
            const target = e.target;
            const type = target.dataset.type;
            const index = parseInt(target.dataset.index);
            const field = target.dataset.field;
            
            if (type && !isNaN(index) && field) {
                let value = target.type === 'checkbox' ? target.checked : parseFloat(target.value);
                this.updateConfig(type, index, field, value);
            }
        });
    }

    updateConfig(type, index, field, value) {
        const list = type === 'top' ? this.config.topCorners : this.config.bottomCorners;

        // Sanitize weight values (0-100%)
        if (field === 'weight') {
            value = parseFloat(value);
            if (isNaN(value)) value = 0;
            value = Math.max(0, Math.min(100, value)); // Clamp to 0-100
        }

        list[index][field] = value;
        this.regenerate();
    }

    pick(list) {
        const total = list.reduce((sum, item) => sum + item.weight, 0);
        
        // If all weights are 0, return random item
        if (total === 0) {
            return list[Math.floor(Math.random() * list.length)];
        }
        
        let r = Math.random() * total;
        for (const item of list) {
            r -= item.weight;
            if (r <= 0) return item;
        }
        return list[0];
    }

    pickCorners() {
        const used = new Set();
        
        const pickUnique = (configList) => {
            const available = configList.filter(item => 
                !item.unique || !used.has(item.name)
            );
            const picked = this.pick(available);
            if (picked.unique) used.add(picked.name);
            return picked.name;
        };
        
        return {
            topLeft: pickUnique(this.config.topCorners),
            topRight: pickUnique(this.config.topCorners),
            bottomLeft: pickUnique(this.config.bottomCorners),
            bottomRight: pickUnique(this.config.bottomCorners)
        };
    }

    regenerate() {
        const container = document.getElementById('boxes');
        container.innerHTML = '';
        this.boxes = [];

        for (let i = 0; i < 10; i++) {
            const corners = this.pickCorners();

            let content;

            // Positions 4 and 8 get videos (if available)
            if ((i === 4 || i === 8) && this.videos.length > 0) {
                const videoIndex = i === 4 ? 0 : 1; // First video at position 4, second at position 8
                const video = this.videos[videoIndex % this.videos.length]; // Use modulo in case we have fewer videos
                content = {
                    type: 'video',
                    value: video
                };
            }
            // Chess pattern: 2nd and 3rd of every 4 boxes get images
            // Pattern: color, image, image, color, color, image, image, color...
            // Position 0: color (1st of 4)
            // Position 1: image (2nd of 4)
            // Position 2: image (3rd of 4)
            // Position 3: color (4th of 4)
            // Position 5: image (2nd of 4)
            // Position 6: image (3rd of 4)
            // Position 7: color (4th of 4)
            // Position 9: image (2nd of 4)
            else {
                const positionInGroup = i % 4;
                const useImage = (positionInGroup === 1 || positionInGroup === 2);

                if (useImage && this.images.length > 0) {
                    // Use random image from loaded images
                    const randomImage = this.images[Math.floor(Math.random() * this.images.length)];
                    content = {
                        type: 'image',
                        value: randomImage
                    };
                } else {
                    // Use random LEGO color
                    content = {
                        type: 'color',
                        value: LEGO_COLORS[Math.floor(Math.random() * LEGO_COLORS.length)]
                    };
                }
            }

            const boxContainer = document.createElement('div');
            boxContainer.className = 'box-container';
            container.appendChild(boxContainer);

            const box = new Box(boxContainer, corners, content, i);
            this.boxes.push(box);
        }

        // Initial render
        requestAnimationFrame(() => {
            this.boxes.forEach(box => box.updateAndRender());
            // Setup resize observers AFTER initial render
            this.setupResize();
        });
    }

    setupResize() {
        // Disconnect old observer if exists
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        // Use ResizeObserver to watch each container
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const index = parseInt(entry.target.dataset.boxIndex);
                    
                    if (!isNaN(index) && this.boxes[index]) {
                        this.boxes[index].updateAndRender();
                    }
                }
            });

            // Observe all containers
            this.boxes.forEach((box, i) => {
                box.container.dataset.boxIndex = i;
                this.resizeObserver.observe(box.container);
            });
        } else {
            // Fallback to window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.boxes.forEach(box => box.updateAndRender());
                }, 100);
            });
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if config is in URL first
        let config = App.loadConfigFromURL();

        // If no URL config, load from config.json
        if (!config) {
            const response = await fetch('config.json');
            if (!response.ok) {
                throw new Error('Failed to load config.json');
            }
            config = await response.json();
        }

        // Initialize app with loaded config
        const app = new App(config);

        // Setup regenerate button
        document.getElementById('btnRegenerate').addEventListener('click', () => {
            app.regenerate();
        });

        // Setup save config button
        document.getElementById('btnSaveConfig').addEventListener('click', () => {
            app.downloadConfig();
        });

        // Setup save to GitHub button
        document.getElementById('btnSaveToGitHub').addEventListener('click', () => {
            app.saveToGitHub();
        });

        // Setup share config button
        document.getElementById('btnShareConfig').addEventListener('click', () => {
            app.shareConfig();
        });

        // Make app globally accessible for debugging
        window.app = app;

    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Failed to load configuration. Please make sure config.json is in the same directory.');
    }
});
