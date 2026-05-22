<template>
  <div id="app">
    <!-- Custom Cursor -->
    <div class="custom-cursor" :style="cursorStyle"></div>
    
    <!-- Navigation -->
    <nav :class="['navbar', { scrolled: isScrolled }]">
      <div class="nav-container">
        <div class="logo" @click="scrollToTop">
          <div class="logo-icon">C</div>
          <div class="logo-text">
            <span class="logo-main">Colors of</span>
            <span class="logo-sub">Combine</span>
          </div>
        </div>
        
        <div class="nav-links" :class="{ active: mobileMenuOpen }">
          <a v-for="item in navItems" :key="item" :href="`#${item.toLowerCase().replace(/\s+/g, '')}`" 
             @click.prevent="scrollToSection(item)" class="nav-link">
            {{ item }}
          </a>
        </div>
        
        <button class="booking-btn desktop">Book Your Stay</button>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero" ref="heroSection">
      <div class="hero-bg">
        <img src="/hero.jpeg" alt="Colors of Combine Luxury Farmhouse" class="hero-image">
        <div class="hero-overlay"></div>
        <div class="light-rays"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge" ref="heroBadge">
          <i class="fas fa-sparkles"></i>
          <span>Award-Winning Luxury Estate</span>
        </div>
        <h1 class="hero-title" ref="heroTitle">
          <span class="title-line">Embrace the</span>
          <span class="title-gradient">Spectrum of Serenity</span>
        </h1>
        <p class="hero-subtitle" ref="heroSubtitle">
          Where nature's palette meets architectural poetry — an exclusive sanctuary for the discerning soul.
        </p>
        <div class="hero-buttons" ref="heroButtons">
          <button class="btn-primary" @click="scrollToSection('booking')">
            Begin Your Journey <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn-secondary" @click="scrollToSection('theestate')">
            Explore the Estate
          </button>
        </div>
      </div>
      
      <div class="scroll-indicator" @click="scrollToSection('theestate')">
        <span>Scroll to Discover</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </section>

    <!-- Floating Booking Widget -->
    <div class="floating-booking" ref="floatingBooking">
      <div class="booking-header">
        <h3>Book Your Escape</h3>
      </div>
      <form @submit.prevent="submitBooking" class="booking-form">
        <input type="date" v-model="booking.checkIn" required>
        <input type="date" v-model="booking.checkOut" required>
        <select v-model="booking.guests">
          <option v-for="n in 6" :key="n">{{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}</option>
        </select>
        <button type="submit" :disabled="bookingLoading">
          {{ bookingLoading ? 'Processing...' : 'Check Availability' }}
        </button>
      </form>
    </div>

    <!-- The Estate Section -->
    <section id="theestate" class="section estate">
      <div class="container">
        <div class="estate-grid">
          <div class="estate-content" ref="estateContent">
            <span class="section-tag">The Estate</span>
            <h2 class="section-title">
              Where <span class="italic">Architecture</span> Meets the<br>
              <span class="gradient-text">Wilderness</span>
            </h2>
            <p class="section-text">Spanning over 50 acres of pristine landscape, Colors of Combine is a masterpiece of sustainable luxury. Each villa is meticulously crafted to harmonize with the natural contours of the land, offering uninterrupted views of the rolling hills and ancient forests.</p>
            <div class="stats-grid">
              <div v-for="stat in stats" :key="stat.label" class="stat-item">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
            <button class="btn-text">Discover the Story <i class="fas fa-arrow-right"></i></button>
          </div>
          <div class="estate-media" ref="estateMedia">
            <div class="media-container">
              <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800" alt="Estate View">
              <div class="play-btn">
                <i class="fas fa-play"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Villas Section -->
    <section id="villas" class="section villas">
      <div class="container">
        <div class="section-header" ref="villasHeader">
          <span class="section-tag">Private Sanctuaries</span>
          <h2 class="section-title">The <span class="italic">Villas</span></h2>
        </div>
        <div class="villas-grid">
          <div v-for="(villa, index) in villas" :key="villa.id" class="villa-card" :ref="el => setCardRef(el, index)" data-animate="fade-up">
            <div class="villa-image">
              <img :src="villa.image" :alt="villa.name">
              <div v-if="villa.popular" class="villa-badge">SIGNATURE</div>
              <div class="villa-price">
                <span class="price">${{ villa.price }}</span>
                <span class="period">/night</span>
              </div>
            </div>
            <div class="villa-info">
              <h3>{{ villa.name }}</h3>
              <div class="villa-features">
                <span v-for="feature in villa.features.slice(0, 3)" :key="feature">{{ feature }}</span>
              </div>
              <button class="btn-outline" @click="scrollToSection('booking')">Explore Villa</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experiences Section -->
    <section id="experiences" class="section experiences">
      <div class="container">
        <div class="section-header" ref="experiencesHeader">
          <span class="section-tag">Curated Journeys</span>
          <h2 class="section-title">Immersive <span class="italic">Experiences</span></h2>
        </div>
        <div class="experiences-grid">
          <div v-for="(exp, index) in experiences" :key="exp.title" class="exp-card" :style="{ transitionDelay: `${index * 100}ms` }">
            <div :class="['exp-icon', exp.color]">
              <i :class="exp.icon"></i>
            </div>
            <h3>{{ exp.title }}</h3>
            <p>{{ exp.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Wellness Section -->
    <section id="wellness" class="section wellness">
      <div class="container">
        <div class="wellness-grid">
          <div class="wellness-media" ref="wellnessMedia">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800" alt="Wellness Spa">
          </div>
          <div class="wellness-content" ref="wellnessContent">
            <span class="section-tag">Holistic Wellness</span>
            <h2 class="section-title text-white">Rejuvenate Your<br><span class="italic">Mind & Body</span></h2>
            <p class="section-text text-white/70">Our award-winning spa combines ancient healing traditions with modern wellness science. From personalized yoga sessions to detoxifying treatments, every experience is designed to restore your natural harmony.</p>
            <div class="wellness-list">
              <div v-for="item in wellnessItems" :key="item" class="wellness-item">
                <i class="fas fa-check-circle"></i>
                <span>{{ item }}</span>
              </div>
            </div>
            <button class="btn-primary">Explore Wellness</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="section gallery">
      <div class="container">
        <div class="section-header" ref="galleryHeader">
          <span class="section-tag">Visual Poetry</span>
          <h2 class="section-title">The <span class="italic">Gallery</span></h2>
        </div>
        <div class="gallery-grid">
          <div v-for="(img, index) in galleryImages" :key="index" class="gallery-item" :ref="el => setGalleryRef(el, index)">
            <img :src="img" :alt="`Gallery ${index + 1}`">
            <div class="gallery-overlay"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Journal Section -->
    <section id="journal" class="section journal">
      <div class="container">
        <div class="section-header" ref="journalHeader">
          <span class="section-tag">Stories & Inspiration</span>
          <h2 class="section-title">The <span class="italic">Journal</span></h2>
        </div>
        <div class="journal-grid">
          <div v-for="(post, index) in journalPosts" :key="post.title" class="journal-card">
            <div class="journal-image">
              <img :src="post.image" :alt="post.title">
            </div>
            <div class="journal-info">
              <span class="journal-date">{{ post.date }}</span>
              <h3>{{ post.title }}</h3>
              <p>{{ post.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section contact">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info" ref="contactInfo">
            <span class="section-tag">Get in Touch</span>
            <h2 class="section-title">Begin Your<br><span class="italic">Journey Today</span></h2>
            <p class="section-text">Our dedicated concierge team is available 24/7 to assist with reservations, special requests, and personalized itineraries.</p>
            <div class="contact-details">
              <div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>Colors of Combine Estate, Serenity Valley</span></div>
              <div class="contact-item"><i class="fas fa-phone"></i><span>+1 (888) 123-4567</span></div>
              <div class="contact-item"><i class="fas fa-envelope"></i><span>hello@colorsofcombine.com</span></div>
            </div>
          </div>
          <div class="contact-form" ref="contactForm">
            <form @submit.prevent="submitContact">
              <div class="form-row">
                <input type="text" v-model="contact.name" placeholder="Full Name" required>
                <input type="email" v-model="contact.email" placeholder="Email Address" required>
              </div>
              <input type="tel" v-model="contact.phone" placeholder="Phone Number">
              <div class="form-row">
                <input type="date" v-model="contact.checkIn">
                <input type="date" v-model="contact.checkOut">
              </div>
              <select v-model="contact.villa">
                <option value="">Select Villa / Package</option>
                <option v-for="villa in villas" :key="villa.id">{{ villa.name }}</option>
              </select>
              <textarea v-model="contact.message" rows="4" placeholder="Special Requests or Questions"></textarea>
              <button type="submit" class="btn-primary w-full">Send Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">Colors of Combine</div>
            <p>Sustainable luxury nestled in nature's embrace.</p>
          </div>
          <div class="footer-links">
            <h4>Explore</h4>
            <ul><li v-for="item in ['The Estate', 'Villas', 'Experiences', 'Wellness']" :key="item"><a href="#">{{ item }}</a></li></ul>
          </div>
          <div class="footer-links">
            <h4>Legal</h4>
            <ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms & Conditions</a></li></ul>
          </div>
          <div class="footer-social">
            <h4>Connect</h4>
            <div class="social-icons">
              <i class="fab fa-instagram"></i><i class="fab fa-facebook"></i><i class="fab fa-twitter"></i><i class="fab fa-youtube"></i>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 Colors of Combine. All rights reserved. | Crafted with ♥ for the discerning traveler.</p>
        </div>
      </div>
    </footer>

    <!-- Admin Button -->
    <router-link to="/admin" class="admin-btn">
      <i class="fas fa-cog"></i>
    </router-link>
  </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'App',
  data() {
    return {
      isScrolled: false,
      mobileMenuOpen: false,
      bookingLoading: false,
      cursorStyle: { transform: 'translate(0, 0)' },
      navItems: ['Home', 'The Estate', 'Villas', 'Experiences', 'Wellness', 'Gallery', 'Journal', 'Contact'],
      stats: [
        { label: 'Acres of Wilderness', value: '50+' },
        { label: 'Private Villas', value: '12' },
        { label: 'Award Winning', value: '2024' },
        { label: 'Guest Rating', value: '5.0' }
      ],
      villas: [
        { id: 1, name: 'The Canopy Villa', price: 890, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600', features: ['Private Pool', 'Forest View', 'Butler Service'], popular: false },
        { id: 2, name: 'The Horizon Suite', price: 1290, image: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=600', features: ['Infinity Pool', 'Sunset View', 'Private Chef'], popular: true },
        { id: 3, name: 'The Heritage Manor', price: 2490, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600', features: ['Multi-bedroom', 'Wine Cellar', 'Spa Access'], popular: false }
      ],
      experiences: [
        { title: 'Nature Pools', desc: 'Crystal-clear infinity pools blending with horizon', icon: 'fas fa-water', color: 'cyan' },
        { title: 'Farm to Table', desc: 'Gourmet dining with organic local ingredients', icon: 'fas fa-mug-hot', color: 'amber' },
        { title: 'Wellness Retreats', desc: 'Holistic healing and rejuvenation programs', icon: 'fas fa-leaf', color: 'emerald' },
        { title: 'Curated Excursions', desc: 'Private tours of nearby vineyards and trails', icon: 'fas fa-compass', color: 'rose' }
      ],
      wellnessItems: ['Ayurvedic Treatments', 'Guided Meditation', 'Cryotherapy & Sauna', 'Personalized Nutrition Plans'],
      galleryImages: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
        'https://images.unsplash.com/photo-1540206395-68808572332f?w=400',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'
      ],
      journalPosts: [
        { title: 'The Art of Slow Living', date: 'Dec 15, 2024', desc: 'Embracing mindfulness in the modern world', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
        { title: 'Farm to Fork: Our Philosophy', date: 'Dec 10, 2024', desc: 'How we\'re redefining sustainable dining', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600' },
        { title: 'Architecture in Harmony', date: 'Dec 5, 2024', desc: 'Designing spaces that celebrate nature', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600' }
      ],
      booking: { checkIn: '', checkOut: '', guests: 2 },
      contact: { name: '', email: '', phone: '', checkIn: '', checkOut: '', villa: '', message: '' },
      cardRefs: [],
      galleryRefs: []
    };
  },
  mounted() {
    this.initScrollEvents();
    this.initAnimations();
    this.initCursor();
    this.initHeroAnimations();
    this.initParallax();
    this.initAnimeEffects();
  },
  beforeUnmount() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    setCardRef(el, index) {
      if (el) this.cardRefs[index] = el;
    },
    setGalleryRef(el, index) {
      if (el) this.galleryRefs[index] = el;
    },
    initScrollEvents() {
      window.addEventListener('scroll', this.handleScroll);
      this.handleScroll();
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    initCursor() {
      document.addEventListener('mousemove', (e) => {
        this.cursorStyle = { transform: `translate(${e.clientX - 16}px, ${e.clientY - 16}px)` };
      });
    },
    initHeroAnimations() {
      const tl = gsap.timeline();
      tl.from(this.$refs.heroBadge, { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out' })
        .from(this.$refs.heroTitle, { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.4')
        .from(this.$refs.heroSubtitle, { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.6')
        .from(this.$refs.heroButtons, { duration: 0.8, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.4');
      
      gsap.to('.hero-image', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        scale: 1.1,
        duration: 1
      });
    },
    initAnimations() {
      // Estate section animations
      gsap.from(this.$refs.estateContent, {
        scrollTrigger: { trigger: '.estate', start: 'top 80%' },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      gsap.from(this.$refs.estateMedia, {
        scrollTrigger: { trigger: '.estate', start: 'top 80%' },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      
      // Villas cards animation
      this.cardRefs.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: '.villas', start: 'top 70%' },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'back.out(0.7)'
        });
      });
      
      // Experiences
      gsap.from('.exp-card', {
        scrollTrigger: { trigger: '.experiences', start: 'top 70%' },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Wellness section
      gsap.from(this.$refs.wellnessMedia, {
        scrollTrigger: { trigger: '.wellness', start: 'top 70%' },
        x: -50,
        opacity: 0,
        duration: 1
      });
      gsap.from(this.$refs.wellnessContent, {
        scrollTrigger: { trigger: '.wellness', start: 'top 70%' },
        x: 50,
        opacity: 0,
        duration: 1
      });
      
      // Gallery
      this.galleryRefs.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: '.gallery', start: 'top 70%' },
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out'
        });
      });
      
      // Journal
      gsap.from('.journal-card', {
        scrollTrigger: { trigger: '.journal', start: 'top 70%' },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8
      });
      
      // Contact
      gsap.from(this.$refs.contactInfo, {
        scrollTrigger: { trigger: '.contact', start: 'top 70%' },
        x: -40,
        opacity: 0,
        duration: 0.8
      });
      gsap.from(this.$refs.contactForm, {
        scrollTrigger: { trigger: '.contact', start: 'top 70%' },
        x: 40,
        opacity: 0,
        duration: 0.8
      });
      
      // Floating booking widget
      gsap.from(this.$refs.floatingBooking, {
        scrollTrigger: { trigger: 'body', start: 'top 0' },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: 1.5
      });
    },
    initParallax() {
      document.querySelectorAll('.parallax').forEach(el => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          y: (i, target) => -parseInt(target.dataset.speed) || 100,
          ease: 'none'
        });
      });
    },
    initAnimeEffects() {
      anime({
        targets: '.light-rays',
        translateX: ['-100%', '100%'],
        duration: 20000,
        loop: true,
        easing: 'linear'
      });
      
      anime({
        targets: '.scroll-indicator i',
        translateY: ['0px', '10px', '0px'],
        duration: 1500,
        loop: true,
        easing: 'easeInOutQuad'
      });
      
      // Floating leaves animation
      this.createFloatingLeaves();
    },
    createFloatingLeaves() {
      const leavesContainer = document.querySelector('.hero-bg');
      if (!leavesContainer) return;
      
      for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'floating-leaf';
        leaf.innerHTML = '🍃';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDelay = `${Math.random() * 10}s`;
        leaf.style.animationDuration = `${8 + Math.random() * 10}s`;
        leavesContainer.appendChild(leaf);
      }
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.mobileMenuOpen = false;
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    async submitBooking() {
      this.bookingLoading = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Booking request sent! We will contact you soon.');
      this.bookingLoading = false;
    },
    async submitContact() {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Message sent successfully! We will get back to you within 24 hours.');
      this.contact = { name: '', email: '', phone: '', checkIn: '', checkOut: '', villa: '', message: '' };
    }
  }
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Playfair Display', system-ui, sans-serif;
  background: #FDFBF7;
  overflow-x: hidden;
  cursor: none;
}

/* Custom Cursor */
.custom-cursor {
  position: fixed;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FF6B6B);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: transform 0.1s ease;
}

@media (max-width: 1024px) {
  .custom-cursor { display: none; }
  body { cursor: auto; }
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.5s ease;
  padding: 24px 0;
}

.navbar.scrolled {
  background: rgba(26, 46, 38, 0.95);
  backdrop-filter: blur(12px);
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: #1A2E26;
}

.logo-main {
  font-size: 18px;
  font-weight: 300;
  color: white;
}

.logo-sub {
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #FFD700, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, #FFD700, #FF6B6B);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: white;
}

.nav-link:hover::after {
  width: 100%;
}

.booking-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  border: none;
  border-radius: 40px;
  color: #1A2E26;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.booking-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

.mobile-menu-btn {
  display: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 18px;
}

/* Hero Section */
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.6));
}

.light-rays {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent);
  animation: lightRay 15s linear infinite;
}

@keyframes lightRay {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.floating-leaf {
  position: absolute;
  font-size: 24px;
  opacity: 0;
  animation: floatLeaf linear infinite;
  pointer-events: none;
}

@keyframes floatLeaf {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translate(var(--tx, 100px), var(--ty, -200px)) rotate(360deg); opacity: 0; }
}

.hero-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 24px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  margin-bottom: 24px;
}

.hero-badge i, .hero-badge span {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  letter-spacing: 0.1em;
}

.hero-title {
  font-size: clamp(48px, 8vw, 120px);
  font-weight: 300;
  color: white;
  line-height: 1.1;
  margin-bottom: 24px;
}

.title-line {
  display: block;
  font-family: 'Playfair Display', serif;
  font-style: italic;
}

.title-gradient {
  background: linear-gradient(135deg, #FFD700, #FF8C00, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  border: none;
  color: #1A2E26;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(8px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.btn-text {
  background: none;
  border: none;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 4px;
  color: #1A2E26;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: gap 0.3s ease;
}

.btn-text:hover {
  gap: 12px;
}

.btn-outline {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(26, 46, 38, 0.2);
  background: transparent;
  border-radius: 40px;
  color: #1A2E26;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #1A2E26;
  color: white;
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.scroll-indicator span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  letter-spacing: 0.2em;
}

.scroll-indicator i {
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
}

/* Floating Booking Widget */
.floating-booking {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 1280px) {
  .floating-booking { display: none; }
}

.booking-header {
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  padding: 16px;
  text-align: center;
}

.booking-header h3 {
  color: #1A2E26;
  font-size: 18px;
}

.booking-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-form input, .booking-form select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

.booking-form button {
  padding: 12px;
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  border: none;
  border-radius: 40px;
  color: #1A2E26;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.booking-form button:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Section Styles */
.section {
  padding: 100px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  color: #FF8C00;
  font-size: 14px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 300;
  color: #1A2E26;
  line-height: 1.2;
}

.italic {
  font-family: 'Playfair Display', serif;
  font-style: italic;
}

.gradient-text {
  background: linear-gradient(135deg, #FFD700, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.text-white {
  color: white;
}

/* Estate Section */
.estate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin: 32px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #FF8C00;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.media-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.media-container img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.play-btn {
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn i {
  color: #1A2E26;
  font-size: 20px;
  margin-left: 4px;
}

.play-btn:hover {
  transform: scale(1.1);
}

/* Villas Section */
.villas {
  background: #F5F2ED;
}

.villas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.villa-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.villa-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.villa-image {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.villa-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.villa-card:hover .villa-image img {
  transform: scale(1.1);
}

.villa-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #FFD700, #FF8C00);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: bold;
  color: #1A2E26;
}

.villa-price {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 8px;
  border-radius: 10px;
}

.villa-price .price {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.villa-price .period {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}

.villa-info {
  padding: 24px;
}

.villa-info h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #1A2E26;
}

.villa-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.villa-features span {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Experiences Section */
.experiences-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.exp-card {
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.exp-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.exp-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  transition: transform 0.3s ease;
}

.exp-card:hover .exp-icon {
  transform: scale(1.1);
}

.exp-icon.cyan { background: linear-gradient(135deg, #06b6d4, #3b82f6); }
.exp-icon.amber { background: linear-gradient(135deg, #f59e0b, #f97316); }
.exp-icon.emerald { background: linear-gradient(135deg, #10b981, #14b8a6); }
.exp-icon.rose { background: linear-gradient(135deg, #f43f5e, #ec4899); }

.exp-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #1A2E26;
}

.exp-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* Wellness Section */
.wellness {
  background: #1A2E26;
}

.wellness-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.wellness-media img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 24px;
}

.wellness-list {
  margin: 32px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.wellness-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.wellness-item i {
  color: #FFD700;
  font-size: 18px;
}

/* Gallery Section */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  background: rgba(0, 0, 0, 0.3);
}

/* Journal Section */
.journal {
  background: #F5F2ED;
}

.journal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.journal-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.journal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.journal-image {
  height: 250px;
  overflow: hidden;
}

.journal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.journal-card:hover .journal-image img {
  transform: scale(1.1);
}

.journal-info {
  padding: 24px;
}

.journal-date {
  font-size: 12px;
  color: #FF8C00;
  display: block;
  margin-bottom: 8px;
}

.journal-info h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #1A2E26;
}

.journal-info p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* Contact Section */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

.contact-details {
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-item i {
  width: 40px;
  height: 40px;
  background: rgba(26, 46, 38, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A2E26;
}

.contact-form {
  background: white;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.contact-form input, .contact-form select, .contact-form textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 16px;
}

.contact-form input:focus, .contact-form select:focus, .contact-form textarea:focus {
  outline: none;
  border-color: #FF8C00;
}

.w-full {
  width: 100%;
}

/* Footer */
.footer {
  background: #1A2E26;
  padding: 60px 0 30px;
  color: rgba(255, 255, 255, 0.5);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 300;
  background: linear-gradient(135deg, #FFD700, #FF8C00, #FF6B6B);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 16px;
}

.footer-links h4, .footer-social h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 16px;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icons i {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.social-icons i:hover {
  color: #FFD700;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
}

/* Admin Button */
.admin-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  background: #1A2E26;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.admin-btn:hover {
  transform: scale(1.1);
  background: #2D4A3E;
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: #1A2E26;
    flex-direction: column;
    padding: 100px 40px;
    transition: right 0.3s ease;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
  }
  
  .nav-links.active {
    right: 0;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .booking-btn.desktop {
    display: none;
  }
  
  .estate-grid, .wellness-grid, .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .villas-grid, .experiences-grid, .journal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .villas-grid, .experiences-grid, .journal-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section {
    padding: 60px 0;
  }
  
  .container {
    padding: 0 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
}
</style>