const links = document.querySelectorAll(".nav a");
const sections = {
  resume: document.getElementById("resume"),
  "what-i-do": document.getElementById("what-i-do"),
  projects: document.getElementById("projects"),
};

let current = "resume";

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default anchor behavior

    const target = link.dataset.target;
    if (target === current) return;

    // Set active link style
    links.forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    const currentSection = sections[current];
    const nextSection = sections[target];

    const forward = Object.keys(sections).indexOf(target) > Object.keys(sections).indexOf(current);

    // Animate current out
    currentSection.classList.remove("visible");
    currentSection.classList.add(forward ? "hidden-left" : "hidden-right");

    // Reset next section position
    nextSection.classList.remove("hidden-left", "hidden-right", "visible");
    nextSection.classList.add(forward ? "hidden-right" : "hidden-left");

    // Force reflow to apply new position
    void nextSection.offsetWidth;

    // Animate next in
    nextSection.classList.remove(forward ? "hidden-right" : "hidden-left");
    nextSection.classList.add("visible");

    current = target;
  });
});

let night_dark_colors = ['#000','#400','#040','#004','#440','#044','#404','#222'];
let night_bright_colors = ['#888','#F88','#8F8','#88F','#FF8','#8FF','#F8F','#FFF'];
let day_dark_colors = ['#000','#800','#080','#008','#880','#088','#808','#888'];
let day_bright_colors = ['#CCC','#FCC','#CFC','#CCF','#FFC','#CFF','#FCF','#FFF'];
var mode = "night", dark_color_index = 0, bright_color_index = 0;
var bg = '#000', fg = '#FFF';

function randomize_colors(){
  mode = Math.random() > 0.5? 'night': 'day';
  dark_color_index = Math.floor(Math.random() * 8);
  bright_color_index = Math.floor(Math.random() * 8);
}

// dom
const log = document.getElementById('pre');

var font_width = 0, font = 'jgs5', font_size = 40;

function get_font_size(){
  if (font == 'ubuntu' || font == 'topaz') {
    font_width = 8;
  } else if (font == 'jgs5') {
    font_width = 7;
  } else if (font == 'jgs9') {
    font_width = 9;
  }

  if (window.innerWidth <= 480) {
    font_width = Math.floor(font_width * 1.75);
  }

  return (font_width * 2) * Math.floor(window.innerWidth / 80 / font_width);
}

function update_dom() {
  font_size = get_font_size();
  let margin_left = Math.floor((window.innerWidth - (font_size / 2) * 80) / 2);
  let margin_top = Math.floor((window.innerHeight - font_size * 22) / 2);
  
  if (mode == 'night') {
    bg = night_dark_colors[dark_color_index];
    fg = night_bright_colors[bright_color_index];
  } else {
    bg = day_bright_colors[bright_color_index];
    fg = day_dark_colors[dark_color_index];
  }
  
  log.style.fontSize = font_size + 'px';
  log.style.lineHeight = font_size + 'px'; 
  // log.style.width = (font_size / 2) * 80 + 'px';
  // log.style.height = font_size * 22 + 'px';
  // mainthing.style.marginTop = margin_top + 'px';
  log.style.fontFamily = font;
  
  // Apply fg and bg to all input fields
  document.querySelectorAll('input, textarea').forEach(input => {
    input.style.backgroundColor = bg;
    input.style.color = fg;
    input.style.borderColor = fg;
  });
}

update_dom();

const totalImages = 8; // Number of images
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

for (let i = 1; i <= totalImages; i++) {
  const img = document.createElement('img');
  img.src = `Photos/${i}.webp`;
  img.alt = `Image ${i}`;
  img.loading = "lazy";
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
  });
  gallery.appendChild(img);
}

// Close lightbox when clicking outside image
lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxImg.src = '';
});

// Load your sound file (replace 'jump-sound.mp3' with your actual file path)
const jumpSound = new Audio("jump.wav");

dino.addEventListener("click", () => {
  if (!dino.classList.contains("jump")) {
    // Play the sound
    jumpSound.currentTime = 0; // rewind to start in case it's still playing
    jumpSound.play();

    dino.classList.add("jump");
    setTimeout(() => {
      dino.classList.remove("jump");
    }, 600); // match animation duration
  }
});

let isOver = false;
const gameBox = document.getElementById('gameBox');
const ship = document.getElementById('ship');
const alien = document.getElementById('alien');

gameBox.addEventListener('click', () => {
  if (!isOver) {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
  
    jumpSound.currentTime = 0; // rewind to start in case it's still playing
    jumpSound.play();
    
    // Set initial position
    projectile.style.bottom = '30px';
    projectile.style.left = `${ship.offsetLeft}px`;
  
    gameBox.appendChild(projectile);
  
    let interval = setInterval(() => {
      let bottom = parseInt(projectile.style.bottom);
      projectile.style.bottom = `${bottom + 5}px`;
  
      // Get positions
      const projRect = projectile.getBoundingClientRect();
      const alienRect = alien.getBoundingClientRect();
  
      if (
        projRect.top < alienRect.bottom &&
        projRect.bottom > alienRect.top &&
        projRect.left < alienRect.right &&
        projRect.right > alienRect.left
      ) {
        clearInterval(interval);
        projectile.remove();
        alien.classList.add('explode');
        isOver = true;
        setTimeout(() => {
          alien.style.display = 'none';
          reloadBtn.style.display = 'block'; // ← Show reload icon
        }, 400);
      }
  
      if (bottom > 600) {
        clearInterval(interval);
        projectile.remove();
      }
    }, 16);
  }
});

const reloadBtn = document.getElementById('reload');

gameBox.addEventListener('click', () => {
  // Reset alien state
  alien.classList.remove('explode');
  alien.style.display = 'block';

  // Hide the reload icon
  reloadBtn.style.display = 'none';

  // Game can resume
  isOver = false;
});