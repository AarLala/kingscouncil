import React, { useEffect } from 'react';

const App: React.FC = () => {
  // Counter animation effect
  useEffect(() => {
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +(counter.getAttribute('data-target') || 0);
        const count = +(counter.textContent || 0);
        const increment = target / 200;
        if (count < target) {
          counter.textContent = Math.ceil(count + increment).toString();
          setTimeout(updateCount, 20);
        } else {
          counter.textContent = target.toString();
        }
      };
      updateCount();
    });
  }, []);

  // Parallax effect for hero background
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('section[style*="background-image"]');
      if (hero) {
        const offset = window.pageYOffset;
        (hero as HTMLElement).style.backgroundPositionY = offset * 0.7 + "px";
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel functionality
  useEffect(() => {
    const carouselInner = document.getElementById('carousel-inner');
    const dots = document.querySelectorAll('#carousel-dots button');
    let currentIndex = 0;
    const totalSlides = carouselInner?.children.length || 0;

    const goToSlide = (index: number) => {
      if (carouselInner) {
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('bg-blue-400'));
        dots[index]?.classList.add('bg-blue-400');
      }
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      goToSlide(currentIndex);
    };

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
        currentIndex = index;
        goToSlide(currentIndex);
      });
    });

    // Initialize first dot active
    goToSlide(currentIndex);
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <img
              src="https://static.wixstatic.com/media/a624e3_80b6e53c262c4103b1289f4dd31f0b4a~mv2.png"
              alt="King's Council Logo"
              className="w-10 md:w-16"
            />
            <span className="text-xl font-bold hidden md:block">King's Council</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="" className="hover:text-blue-400 transition duration-300">
              Home
            </a>
            <a href="/login" className="hover:text-blue-400 transition duration-300">
              Challenges
            </a>
            <a href="#" className="hover:text-blue-400 transition duration-300">
              Community/Outreach
            </a>
            <a href="#" className="hover:text-blue-400 transition duration-300">
              Book
            </a>
            <a href="/mystory" className="hover:text-blue-400 transition duration-300">
              My Story
            </a>
            <a href="/about" className="hover:text-blue-400 transition duration-300">
              About
            </a>
          </nav>
          <div className="flex space-x-4">
            <a href="https://facebook.com">
              <img
                src="https://static.wixstatic.com/media/23fd2a2be53141ed810f4d3dcdcd01fa.png"
                alt="Facebook"
                className="w-6"
              />
            </a>
            <a href="https://twitter.com">
              <img
                src="https://static.wixstatic.com/media/01ab6619093f45388d66736ec22e5885.png"
                alt="Twitter"
                className="w-6"
              />
            </a>
            <a href="https://youtube.com">
              <img
                src="https://static.wixstatic.com/media/203dcdc2ac8b48de89313f90d2a4cda1.png"
                alt="YouTube"
                className="w-6"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://static.wixstatic.com/media/11062b_bcca276530a3448abd24d6a7dd979d8a~mv2.jpeg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
        <div id="particles-js" className="absolute inset-0 pointer-events-none"></div>
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center px-4 text-center">
          <h1
            className="text-4xl md:text-7xl font-serif-custom font-bold text-white leading-tight opacity-0 animate-fadeInUp"
            style={{ animationDelay: '0.5s' }}
          >
            Master the Chessboard
            <br />
            Master the Mind
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="\Login"
              className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold opacity-0 animate-fadeIn"
              style={{ animationDelay: '1s' }}
            >
              Start Playing
            </a>
            <a
              href="\About"
              className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold opacity-0 animate-fadeIn"
              style={{ animationDelay: '1.2s' }}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section id="metrics" className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-12 font-serif-custom">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-6xl font-metrics text-gold animate-scrollUp" data-target="1006">
                1006
              </div>
              <p className="mt-4 text-xl">Families Empowered</p>
            </div>
            <div>
              <div className="text-6xl font-metrics text-gold animate-scrollUp" data-target="5204">
                5204
              </div>
              <p className="mt-4 text-xl">Chess Games</p>
            </div>
            <div>
              <div className="text-6xl font-metrics text-gold animate-scrollUp" data-target="6739">
                6739
              </div>
              <p className="mt-4 text-xl">Puzzles Solved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Steps Bar Section */}
      <section id="steps" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 font-serif-custom">Learning Steps</h2>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-bold mb-2 hover:scale-105 transition transform duration-300">
                1
              </div>
              <div className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17v-2h-2v2h2zm0-4v-4h-2v4h2zm-1-10C7.96 3 4 6.96 4 12s3.96 9 9 9 9-3.96 9-9-3.96-9-9-9z" />
                </svg>
              </div>
              <p className="text-white text-center">Play Challenges</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-bold mb-2 hover:scale-105 transition transform duration-300">
                2
              </div>
              <div className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2v12h9v2h-11v12h-2V16H2v-2h9V2h2z" />
                </svg>
              </div>
              <p className="text-white text-center">Learn about the Brain</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-bold mb-2 hover:scale-105 transition transform duration-300">
                3
              </div>
              <div className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.24 14.29l-4.66-4.66-1.41 1.41L15.11 12h-2.22c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h4V4H11c-2.21 0-4 1.79-4 4v2c0 2.21 1.79 4 4 4h2.77l-2.87 2.87 1.41 1.41 4.66-4.66c1.44 1.36 2.56 2.96 3.49 4.56l2.22-1.03c-.61-1.66-1.43-3.21-2.5-4.63z" />
                </svg>
              </div>
              <p className="text-white text-center">Score more points</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 font-serif-custom">Community Impact Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <img 
              src="https://static.wixstatic.com/media/a624e3_6471ab168b464e06bc201a005ce85695~mv2.png" 
              alt="Impact 1" 
              className="w-full h-40 object-cover hover:opacity-80 transition duration-300" 
            />
            <img 
              src="https://static.wixstatic.com/media/a624e3_cb3e1a3ef76d4a1ba210bfb30300ccc7~mv2.jpg" 
              alt="Impact 2" 
              className="w-full h-40 object-cover hover:opacity-80 transition duration-300" 
            />
            <img 
              src="https://static.wixstatic.com/media/a624e3_9efef8c495df4ffaaad856c7a8b71614~mv2.png" 
              alt="Impact 3" 
              className="w-full h-40 object-cover hover:opacity-80 transition duration-300" 
            />
            <img 
              src="https://static.wixstatic.com/media/a624e3_6b552b1c63fa4e249a13eaefba86b87f~mv2.png" 
              alt="Impact 4" 
              className="w-full h-40 object-cover hover:opacity-80 transition duration-300" 
            />
          </div>
          <a 
            href="https://www.kingscouncils.org/community-outreach" 
            className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-3 rounded-full inline-block font-semibold"
          >
            View Community Work
          </a>
        </div>
      </section>
    
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-12 font-serif-custom">Achievement Timeline</h2>
          <div className="relative border-l-2 border-gray-600 ml-4">
            <div className="mb-8 ml-6">
              <p className="text-lg font-semibold">2018</p>
              <p className="mt-2">Founded with a vision to empower local communities through chess.</p>
            </div>
            <div className="mb-8 ml-6">
              <p className="text-lg font-semibold">2020</p>
              <p className="mt-2">Expanded outreach programs and chess coaching sessions across multiple regions.</p>
            </div>
            <div className="mb-8 ml-6">
              <p className="text-lg font-semibold">2022</p>
              <p className="mt-2">Engaged over 1000 families with innovative community programs.</p>
            </div>
            <div className="mb-8 ml-6">
              <p className="text-lg font-semibold">2024</p>
              <p className="mt-2">Hosted international chess tournaments and launched online learning modules.</p>
            </div>
          </div>
        </div>
      </section>
    
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-12 font-serif-custom">Testimonials</h2>
          <div className="relative overflow-hidden" id="carousel">
            <div className="flex transition-transform duration-700" id="carousel-inner">
              <div className="min-w-full px-4">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="italic">"My son has loved it and we are so grateful that Aarav created the club!"</p>
                  <p className="mt-4 font-bold">- Wendy Palkki</p>
                </div>
              </div>
              <div className="min-w-full px-4">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="italic">"Thanks for sharing with #mypikeroad! We're so proud of your accomplishments (both food drive-related and chess-related)"</p>
                  <p className="mt-4 font-bold">- Town of Alabama, Pike Road</p>
                </div>
              </div>
              <div className="min-w-full px-4">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="italic">"Tripp had such a great time! Thank you so much for having this event. We look forward to the next one!"</p>
                  <p className="mt-4 font-bold">- Leslie Cole Ellis</p>
                </div>
              </div>
              <div className="min-w-full px-4">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="italic">"Such a bomb group! Aarav is the BEST mentor and friend to these adolescent kids!"</p>
                  <p className="mt-4 font-bold">- Heidi Mense</p>
                </div>
              </div>
              <div className="min-w-full px-4">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="italic">"Aarav, my son really enjoyed this chess club meeting and he is excited to participate again! Thank you for doing this!"</p>
                  <p className="mt-4 font-bold">- Erin Schovel Turnham</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-2" id="carousel-dots">
            <button className="w-3 h-3 bg-gray-500 rounded-full" data-index="0"></button>
            <button className="w-3 h-3 bg-gray-500 rounded-full bg-blue-400" data-index="1"></button>
            <button className="w-3 h-3 bg-gray-500 rounded-full" data-index="2"></button>
            <button className="w-3 h-3 bg-gray-500 rounded-full" data-index="3"></button>
            <button className="w-3 h-3 bg-gray-500 rounded-full" data-index="4"></button>
          </div>
        </div>
      </section>

    
      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <a href="\Index" className="hover:text-blue-400 transition duration-300">Home</a>
            <a href="\Login" className="hover:text-blue-400 transition duration-300">Challenges</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Community/Outreach</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Book</a>
            <a href="\MyStory" className="hover:text-blue-400 transition duration-300">My Story</a>
            <a href="/About" className="hover:text-blue-400 transition duration-300">About</a>
            <a href="\Terms" className="hover:text-blue-400 transition duration-300">Terms</a>
            <a href="\Privacy" className="hover:text-blue-400 transition duration-300">Privacy</a>
          </div>
        </div>
      </footer>
    
      <button id="backToTop" className="hidden">Top</button>
    </>
  );
};

export default App;