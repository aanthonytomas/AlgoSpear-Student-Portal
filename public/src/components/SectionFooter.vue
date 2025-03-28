<template>
  <footer class="footer dark-background">
    <div class="container footer-top py-5">
      <div class="row gy-4">
        <div class="col-lg-3 col-md-6 footer-about">
          <router-link class="logo d-flex align-items-center" to="/">
            <span class="sitename">AlgoSpear</span>
          </router-link>
          <div class="footer-contact pt-3">
            <p>Bulacan State University</p>
            <p class="mt-3"><strong>Phone:</strong> <span>Call +63 123456789</span></p>
            <p><strong>Email:</strong> <span>algospear@gmail.com</span></p>
          </div>
          <div class="social-links d-flex mt-4">
            <a href=""><i class="bi bi-facebook"></i></a>
            <a href=""><i class="bi bi-instagram"></i></a>
            <a href=""><i class="bi bi-linkedin"></i></a>
          </div>
        </div>
        <div class="col-lg-3 col-md-3 footer-links">
          <h4>Info</h4>
          <p>Understand complex Data Structures and Algorithms through engaging, interactive visualizations.</p>
        </div>
        <div class="col-lg-2 col-md-3 footer-links">
          <h4>Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/readings">Reading Materials</router-link></li>
            <li><router-link to="/datastructures">Visualization: Data Structures</router-link></li>
            <li><router-link to="/algorithms">Visualization: Algorithms</router-link></li>
          </ul>
        </div>
        <div class="col-lg-4 col-md-12 footer-youtube">
          <h4>YouTube Channel</h4>
          <p>Subscribe to our YouTube channel for video tutorials!</p>
          <div class="youtube-subscription">
            <a 
              href="https://www.youtube.com/@AlgospearILS" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-danger me-2"
            >
              <i class="bi bi-youtube me-2"></i>Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
.footer-youtube .btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.footer-youtube .btn-danger i {
  font-size: 1.2rem;
}
</style>