// Create floating particles
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 25000);
}

// 3D Robot Setup
let scene, camera, renderer, robot, robotParts = {};

function init3DRobot() {
    const canvas = document.getElementById('robotCanvas');
    const container = document.querySelector('.robot-container');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff00aa, 0.8, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Robot materials
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a2a, 
        shininess: 100,
        specular: 0x00d4ff
    });
    
    const accentMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00d4ff, 
        shininess: 100,
        emissive: 0x001a2e
    });
    
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff00aa, 
        shininess: 100,
        emissive: 0x330011
    });

    // Robot group
    robot = new THREE.Group();

    // Head
    const headGeometry = new THREE.BoxGeometry(2, 2, 2);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 3;
    head.castShadow = true;
    robotParts.head = head;
    robot.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.5, 3.2, 0.9);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 3.2, 0.9);
    robot.add(leftEye);
    robot.add(rightEye);

    // Antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const antenna = new THREE.Mesh(antennaGeometry, accentMaterial);
    antenna.position.set(0, 4.5, 0);
    robot.add(antenna);
    
    const antennaTip = new THREE.SphereGeometry(0.15, 16, 16);
    const tip = new THREE.Mesh(antennaTip, eyeMaterial);
    tip.position.set(0, 5, 0);
    robotParts.antennaTip = tip;
    robot.add(tip);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(2.5, 3, 1.5);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    body.castShadow = true;
    robot.add(body);

    // Chest panel
    const panelGeometry = new THREE.BoxGeometry(1.8, 1.5, 0.1);
    const panel = new THREE.Mesh(panelGeometry, accentMaterial);
    panel.position.set(0, 0.5, 0.8);
    robot.add(panel);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2.5);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-2, 0.5, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.castShadow = true;
    robotParts.leftArm = leftArm;
    robot.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(2, 0.5, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.castShadow = true;
    robotParts.rightArm = rightArm;
    robot.add(rightArm);

    // Hands
    const handGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const leftHand = new THREE.Mesh(handGeometry, accentMaterial);
    leftHand.position.set(-2.8, -1, 0);
    robotParts.leftHand = leftHand;
    robot.add(leftHand);

    const rightHand = new THREE.Mesh(handGeometry, accentMaterial);
    rightHand.position.set(2.8, -1, 0);
    robotParts.rightHand = rightHand;
    robot.add(rightHand);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3);
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(-0.7, -3, 0);
    leftLeg.castShadow = true;
    robot.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(0.7, -3, 0);
    rightLeg.castShadow = true;
    robot.add(rightLeg);

    // Feet
    const footGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.2);
    const leftFoot = new THREE.Mesh(footGeometry, accentMaterial);
    leftFoot.position.set(-0.7, -4.5, 0.2);
    leftFoot.castShadow = true;
    robot.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, accentMaterial);
    rightFoot.position.set(0.7, -4.5, 0.2);
    rightFoot.castShadow = true;
    robot.add(rightFoot);

    // Add robot to scene
    scene.add(robot);

    // Camera position
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Animation loop
    animate3DRobot();
}

function animate3DRobot() {
    requestAnimationFrame(animate3DRobot);

    const time = Date.now() * 0.001;

    // Robot animations
    if (robot) {
        robot.rotation.y = Math.sin(time * 0.5) * 0.1;
        
        // Head bobbing
        if (robotParts.head) {
            robotParts.head.rotation.x = Math.sin(time * 2) * 0.1;
        }
        
        // Arm swinging
        if (robotParts.leftArm) {
            robotParts.leftArm.rotation.z = Math.PI / 6 + Math.sin(time * 1.5) * 0.2;
        }
        if (robotParts.rightArm) {
            robotParts.rightArm.rotation.z = -Math.PI / 6 - Math.sin(time * 1.5) * 0.2;
        }
        
        // Hand floating
        if (robotParts.leftHand) {
            robotParts.leftHand.position.y = -1 + Math.sin(time * 2) * 0.1;
        }
        if (robotParts.rightHand) {
            robotParts.rightHand.position.y = -1 + Math.sin(time * 2 + Math.PI) * 0.1;
        }
        
        // Antenna tip glow
        if (robotParts.antennaTip) {
            robotParts.antennaTip.material.emissive.setHex(
                Math.sin(time * 3) > 0 ? 0x330011 : 0x000000
            );
        }
    }

    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const container = document.querySelector('.robot-container');
    if (container && camera && renderer) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
}

// Create particles periodically
setInterval(createParticle, 2000);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = answer.classList.contains('active');
        
        // Close all answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('active');
        });
        
        // Open clicked answer if it wasn't active
        if (!isActive) {
            answer.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.borderBottom = '1px solid rgba(0, 212, 255, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.9)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    }
});

// CTA button click effect
document.querySelector('.cta-button').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    
    this.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Simulate registration process
    setTimeout(() => {
        alert('🎉 Registration successful! Welcome to HackSphere 2025!');
    }, 300);
});

// Add typing effect to hero text
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Trigger typing effect after page load
window.addEventListener('load', () => {
    const tagline = document.querySelector('.tagline');
    setTimeout(() => {
        typeWriter(tagline, 'Code. Create. Conquer.', 100);
    }, 1000);
    
    // Initialize 3D robot
    setTimeout(init3DRobot, 500);
});

// Initialize particles on page load
window.addEventListener('load', () => {
    // Create initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 500);
    }
});

// Listen for window resize
window.addEventListener('resize', () => {
    mobileMenuToggle();
    onWindowResize();
});

// Mobile menu toggle (for future enhancement)
const mobileMenuToggle = () => {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth <= 768) {
        // Mobile menu functionality can be added here
        console.log('Mobile menu functionality ready for implementation');
    }
};

// Smooth reveal animations for cards
const revealCards = () => {
    const cards = document.querySelectorAll('.about-card, .timeline-item');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
};

// Initialize card animations
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.about-card, .timeline-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateScrollEffects() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.borderBottom = '1px solid rgba(0, 212, 255, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.9)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    }
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);
