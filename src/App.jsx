import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReviewsList from './components/ReviewsList';
import Tracklist from './components/Tracklist';
import ReviewModal from './components/ReviewModal';

function App() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden selection:bg-primary/30 selection:text-text-main">
      <Navbar />

      <main>
        <Hero onWriteReview={() => setIsReviewModalOpen(true)} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
          {/* Mobile layout order: Hero -> Reviews -> Tracklist (stacking on mobile using flex-col) */}
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 relative items-start">

            {/* Reviews Section (~2/3 width on desktop) */}
            <div className="w-full md:w-[60%] lg:w-[65%] order-1 md:order-1">
              <ReviewsList />
            </div>

            {/* Tracklist Sidebar (~1/3 width on desktop) */}
            <div className="w-full md:w-[40%] lg:w-[35%] order-2 md:order-2 md:sticky md:top-32">
              <Tracklist />
            </div>

          </div>
        </div>
      </main>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}

export default App;
