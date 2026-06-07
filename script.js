// Password Modal Logic for Mario Birthday Game
const CORRECT_PASSWORD = 'mehnatkaphalmeethahotah_aashishbedpecheetahotah';
const SOLO_COIN_POSITION = 17;
const BLOCK_SIZE = 50;

// DOM Elements
const modal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const submitButton = document.getElementById('submitPassword');
const errorMessage = document.getElementById('errorMessage');
// const gameSection = document.getElementById('gameSection'); // Not used/needed as we overlay
const successPage = document.getElementById('successPage');

// State tracking
let modalTriggered = false;
let currentBlockPosition = 0;

// Function to show modal
function showModal() {
    if (!modalTriggered) {
        modalTriggered = true;
        setTimeout(() => {
            modal.classList.add('active');
            document.body.classList.add('modal-active');
            passwordInput.focus();
        }, 400);
    }
}

// Function to hide modal
function hideModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-active');
    errorMessage.textContent = '';
    passwordInput.value = '';
}

// Function to transition to success page
function transitionToSuccessPage() {
    // Add success message
    errorMessage.style.color = '#00c853';
    errorMessage.textContent = '✓ Correct! Loading...';

    setTimeout(() => {
        // Hide modal
        hideModal();

        // Show success page with fade-in
        if (successPage) {
            successPage.style.display = 'flex';
            // Slight delay to allow display:flex to apply before adding active class for opacity transition
            setTimeout(() => {
                successPage.classList.add('active');
            }, 10);
        }

        // Lock body scroll
        document.body.classList.add('success-active');

        // Reset HTML scroll to top
        document.documentElement.scrollTo(0, 0);

    }, 1000);
}

// Function to validate password
function validatePassword() {
    const userInput = passwordInput.value.trim();

    if (userInput === CORRECT_PASSWORD) {
        transitionToSuccessPage();
    } else {
        // Wrong password
        errorMessage.style.color = '#ff1744';
        errorMessage.textContent = '✗ Wrong password! Try again...';
        passwordInput.value = '';
        passwordInput.focus();

        // Shake animation
        modal.querySelector('.modal-container').style.animation = 'none';
        setTimeout(() => {
            modal.querySelector('.modal-container').style.animation = '';
        }, 10);
    }
}

// Detect when Mario is near the solo coin block
function checkCollision() {
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    const marioScreenX = viewportWidth * 0;
    const marioGameX = scrollX + marioScreenX;
    const coinBlockGameX = SOLO_COIN_POSITION * BLOCK_SIZE;
    const distance = Math.abs(marioGameX - coinBlockGameX);

    if (distance < BLOCK_SIZE * 1.5 && !modalTriggered) {
        currentBlockPosition = SOLO_COIN_POSITION;
        checkJump();
    }
}

// Track if down arrow (jump) is pressed
let downKeyPressed = false;

function checkJump() {
    if (downKeyPressed && currentBlockPosition === SOLO_COIN_POSITION) {
        showModal();
    }
}

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        downKeyPressed = true;
        checkJump();
    }

    if (e.key === 'Enter' && modal.classList.contains('active')) {
        e.preventDefault();
        validatePassword();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') {
        downKeyPressed = false;
    }
});

// Button click handler
submitButton.addEventListener('click', validatePassword);

// Scroll event listener
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkCollision, 50);
});

// Arrow key movements
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setTimeout(checkCollision, 100);
    }
});

// Initial check
setTimeout(checkCollision, 500);

console.log('🎮 Mario Birthday Game Loaded!');
console.log('💡 Hint: Navigate to the solo coin block (position 17) and press DOWN to jump!');

// ==================== 3D ART GALLERY LOGIC ====================

// Transition Logic
document.querySelector('.text-4').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Moving to Art Gallery...');

    // Hide previous sections
    if (document.getElementById('successPage')) document.getElementById('successPage').style.display = 'none';
    if (document.getElementById('gameSection')) document.getElementById('gameSection').style.display = 'none';

    // Show Gallery
    const gallery = document.getElementById('artGallery');
    gallery.style.display = 'block';
    document.body.classList.add('gallery-active');

    // Initialize Three.js Gallery
    initGallery();
});

function initGallery() {
    const CONFIG = {
        slideCount: 4,
        spacingX: 45,

        pWidth: 14,
        pHeight: 18,

        camZ: 30,
        wallAngleY: -0.25,

        snapDelay: 200,
        lerpSpeed: 0.06
    };

    const totalGalleryWidth = CONFIG.slideCount * CONFIG.spacingX;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f5);
    scene.fog = new THREE.Fog(0xf7f7f5, 10, 110);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, CONFIG.camZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const container = document.getElementById('canvas-container');
    if (container) {
        container.innerHTML = ''; // Clear just in case
        container.appendChild(renderer.domElement);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    const textureLoader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);

    const images = [
        'bachi.jpeg',
        'car.jpeg',
        'chudel.jpeg',
        'together.jpeg'
    ];

    const paintingGroups = [];

    for (let i = 0; i < CONFIG.slideCount; i++) {
        const group = new THREE.Group();
        group.position.set(i * CONFIG.spacingX, 0, 0);
        const mat = new THREE.MeshBasicMaterial({ map: textureLoader.load(images[i]) });
        const mesh = new THREE.Mesh(planeGeo, mat);
        const edges = new THREE.EdgesGeometry(planeGeo);
        const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x222222 }));

        const shadowGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.position.set(0.8, -0.8, -0.5);

        const lineZ = -1;
        const lineLen = CONFIG.spacingX;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-lineLen / 2, 14, lineZ), new THREE.Vector3(lineLen / 2, 14, lineZ),
            new THREE.Vector3(-lineLen / 2, -14, lineZ), new THREE.Vector3(lineLen / 2, -14, lineZ)
        ]);
        const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xdddddd }));

        group.add(shadow);
        group.add(mesh);
        group.add(outline);
        group.add(lines);

        galleryGroup.add(group);
        paintingGroups.push(group);
    }

    galleryGroup.rotation.y = CONFIG.wallAngleY;
    galleryGroup.position.x = 8;

    let currentScroll = 0;
    let targetScroll = 0;
    let snapTimer = null;
    let mouse = { x: 0, y: 0 };

    function snapToNearest() {
        const index = Math.round(targetScroll / CONFIG.spacingX);
        targetScroll = index * CONFIG.spacingX;
    }

    window.addEventListener('wheel', (e) => {
        if (!document.body.classList.contains('gallery-active')) return;
        targetScroll += e.deltaY * 0.1;
        if (snapTimer) clearTimeout(snapTimer);
        snapTimer = setTimeout(snapToNearest, CONFIG.snapDelay);
    });

    let touchStart = 0;
    window.addEventListener('touchstart', e => {
        if (!document.body.classList.contains('gallery-active')) return;
        touchStart = e.touches[0].clientX;
        if (snapTimer) clearTimeout(snapTimer);
    });

    window.addEventListener('touchmove', e => {
        if (!document.body.classList.contains('gallery-active')) return;
        const diff = touchStart - e.touches[0].clientX;
        targetScroll += diff * 0.6;
        touchStart = e.touches[0].clientX;
        if (snapTimer) clearTimeout(snapTimer);
    });

    window.addEventListener('touchend', () => {
        if (!document.body.classList.contains('gallery-active')) return;
        snapToNearest();
    });

    window.addEventListener('mousemove', (e) => {
        if (!document.body.classList.contains('gallery-active')) return;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function updateUI(scrollX) {
        const rawIndex = Math.round(scrollX / CONFIG.spacingX);
        const safeIndex = ((rawIndex % CONFIG.slideCount) + CONFIG.slideCount) % CONFIG.slideCount;
        for (let i = 0; i < CONFIG.slideCount; i++) {
            const el = document.getElementById(`slide-${i}`);
            if (el) {
                if (i === safeIndex) el.classList.add('active');
                else el.classList.remove('active');
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!document.body.classList.contains('gallery-active')) return; // Stop rendering if hidden? Or keep running.

        currentScroll += (targetScroll - currentScroll) * CONFIG.lerpSpeed;
        const xMove = currentScroll * Math.cos(CONFIG.wallAngleY);
        const zMove = currentScroll * Math.sin(CONFIG.wallAngleY);
        camera.position.x = xMove;
        camera.position.z = CONFIG.camZ - zMove;
        paintingGroups.forEach((group, i) => {
            const originalX = i * CONFIG.spacingX;
            const distFromCam = currentScroll - originalX;
            const shift = Math.round(distFromCam / totalGalleryWidth) * totalGalleryWidth;
            group.position.x = originalX + shift;
        });
        camera.rotation.x = mouse.y * 0.05;
        camera.rotation.y = -mouse.x * 0.05;
        updateUI(currentScroll);
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        if (!document.body.classList.contains('gallery-active')) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}
