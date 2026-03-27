-- ============================================
-- RBZ Studios - Extended Seed Data
-- ============================================

-- ============================================
-- MORE NEWS ARTICLES
-- ============================================
INSERT INTO news (title, slug, body, cover_image_url, published) VALUES
(
  'RBZ Studios Partners with IMAX for Exclusive Screenings',
  'rbz-partners-imax-exclusive',
  'RBZ Studios has signed a landmark deal with IMAX Corporation to bring our upcoming slate of films to IMAX theatres worldwide. This partnership will give fans the chance to experience our biggest releases in the most immersive format available. The first film to benefit from this deal will be "Eclipse," which will feature specially shot IMAX sequences that expand the aspect ratio to fill the entire screen.',
  'https://placehold.co/1200x600/0f3460/e94560?text=IMAX+Partnership',
  true
),
(
  'Meet the Cast of "Nightfall"',
  'meet-the-cast-nightfall',
  'We are excited to reveal the full cast for our upcoming thriller "Nightfall." The ensemble includes some of the most talented actors working today, bringing together Oscar winners and rising stars for what promises to be an unforgettable film. Director Sarah Chen has assembled a cast that perfectly embodies the complex characters at the heart of this story about a city plunged into darkness.',
  'https://placehold.co/1200x600/1a1a2e/e94560?text=Nightfall+Cast+Reveal',
  true
),
(
  'RBZ Studios Opens New Production Facility in Vancouver',
  'new-vancouver-production-facility',
  'We are thrilled to announce the opening of our state-of-the-art production facility in Vancouver, British Columbia. The 200,000 square foot complex features six sound stages, a massive water tank for aquatic sequences, and a dedicated virtual production volume using the latest LED wall technology. This facility will serve as the home for several upcoming RBZ productions.',
  'https://placehold.co/1200x600/16213e/e94560?text=Vancouver+Studio',
  true
),
(
  'Annual Fan Awards: Vote for Your Favourite RBZ Moment',
  'annual-fan-awards-2026',
  'It is that time of year again! The RBZ Fan Awards are back, and we want you to decide the winners. From Best Action Sequence to Most Emotional Scene, there are ten categories for you to vote on. Voting opens today and closes on April 15th. Winners will be announced at our annual Fan Appreciation Event in May. Last year, the rooftop chase scene from "Meridian" took home the top prize.',
  'https://placehold.co/1200x600/1a1a2e/0f3460?text=Fan+Awards+2026',
  true
),
(
  'Soundtrack Release: "Eclipse" Original Score Now Streaming',
  'eclipse-soundtrack-streaming',
  'The critically acclaimed original score for "Eclipse" by composer James Whitfield is now available on all major streaming platforms. The 22-track album features the hauntingly beautiful main theme along with the pulse-pounding action cues that made the film such a cinematic experience. A limited edition vinyl release with exclusive bonus tracks will be available through our merchandise store next month.',
  'https://placehold.co/1200x600/0f3460/ffffff?text=Eclipse+Soundtrack',
  true
),
(
  'RBZ Studios Announces Summer Film Camp for Young Filmmakers',
  'summer-film-camp-2026',
  'Aspiring filmmakers aged 14-18 are invited to apply for the RBZ Studios Summer Film Camp. This two-week intensive program gives young creatives hands-on experience with professional equipment, mentorship from industry professionals, and the chance to create their own short film on a real studio lot. Applications are now open and scholarships are available for underrepresented communities.',
  'https://placehold.co/1200x600/16213e/e94560?text=Summer+Film+Camp',
  true
),
(
  '"Meridian" Wins Three Awards at International Film Festival',
  'meridian-wins-three-awards',
  'We are proud to announce that "Meridian" has won three major awards at the Toronto International Film Festival, including Best Director, Best Cinematography, and the coveted People''s Choice Award. This marks the most successful festival run for any RBZ Studios production to date. Director Marcus Webb dedicated the awards to the entire cast and crew who poured their hearts into the project.',
  'https://placehold.co/1200x600/1a1a2e/e94560?text=Meridian+Awards',
  true
);

-- ============================================
-- MORE TRAILERS
-- ============================================
INSERT INTO trailers (title, description, video_url, thumbnail_url, movie_name, published) VALUES
(
  'Eclipse - Final Trailer',
  'The final trailer before the worldwide premiere. Are you ready?',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/1a1a2e/e94560?text=Eclipse+Final+Trailer',
  'Eclipse',
  true
),
(
  'Nightfall - Official Trailer #1',
  'When the lights go out, the real story begins. Coming this fall.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/0f3460/ffffff?text=Nightfall+Official',
  'Nightfall',
  true
),
(
  'Meridian - Anniversary Re-Release Trailer',
  'Celebrating one year of Meridian with a special IMAX re-release.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/16213e/e94560?text=Meridian+Rerelease',
  'Meridian',
  true
),
(
  'Project Horizon - Teaser',
  'Something new is coming from RBZ Studios. First look at Project Horizon.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/1a1a2e/0f3460?text=Project+Horizon',
  'Project Horizon',
  true
),
(
  'The Last Signal - Official Teaser',
  'A sci-fi epic unlike anything you have seen before. 2027.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://placehold.co/800x450/0a0a0f/e94560?text=The+Last+Signal',
  'The Last Signal',
  true
);

-- ============================================
-- MORE EXCLUSIVE CONTENT
-- ============================================
INSERT INTO exclusive_content (title, description, content_type, body, is_gated, published) VALUES
(
  'Interview: Director Marcus Webb on "Meridian"',
  'An in-depth conversation about the creative vision behind the award-winning film.',
  'article',
  'In this exclusive interview, director Marcus Webb opens up about the five-year journey to bring "Meridian" to the screen. "The story started as a short film I made in college," Webb reveals. "I never imagined it would become what it is today." We discuss the challenges of filming on three continents, working with an ensemble cast, and the emotional scene that made the entire crew cry on set. Webb also shares early details about his next project with RBZ Studios, which he describes as "something completely different from anything I have done before."',
  true,
  true
),
(
  'VFX Breakdown: Eclipse Space Station Sequence',
  'See how we created the zero-gravity fight scene that everyone is talking about.',
  'video',
  'The space station sequence in Eclipse took over 14 months to complete and involved a team of 200 VFX artists across three studios. In this exclusive breakdown, VFX Supervisor Lisa Park walks us through the process from pre-visualization to final composite. Learn how the team combined practical wire work with digital environments to create one of the most realistic zero-gravity sequences ever filmed.',
  true,
  true
),
(
  'Early Concept Art: Nightfall City Design',
  'Explore the stunning artwork that defined the look of the city in Nightfall.',
  'gallery',
  'Before a single frame was shot, the art department spent eight months designing the city of Ashford for "Nightfall." Production designer Tom Ramirez drew inspiration from noir cinema, brutalist architecture, and bioluminescent deep-sea creatures. This gallery features 30 pieces of concept art showing the evolution of the city design, from early sketches to the final detailed paintings that guided the construction of the massive sets.',
  false,
  true
),
(
  'On Set Diary: Day 1 of "The Last Signal"',
  'Follow along as production begins on our most ambitious project yet.',
  'article',
  'Day one on "The Last Signal" was nothing short of electric. The crew gathered at 5 AM at our new Vancouver facility, and you could feel the excitement in the air. Director Anika Patel gave an inspiring speech before the first shot, reminding everyone that they were about to create something truly special. We captured the first scene — a quiet, intimate moment between the two leads that sets the emotional foundation for the entire film. Despite the massive scale of this production, Patel insisted on starting small and personal.',
  true,
  true
),
(
  'Composer Spotlight: James Whitfield on the Eclipse Score',
  'The story behind the music that defined Eclipse.',
  'article',
  'James Whitfield recorded the Eclipse score with a 90-piece orchestra at Abbey Road Studios over three weeks. In this exclusive feature, Whitfield reveals that the haunting main theme came to him in a dream. "I woke up at 3 AM and hummed it into my phone," he laughs. "When I played it for the director the next day, we both knew it was the heart of the film." Whitfield also shares how he incorporated sounds recorded in actual space — electromagnetic frequencies from Saturn captured by NASA — into the electronic elements of the score.',
  false,
  true
),
(
  'Stunt Coordinator Breakdown: Meridian Rooftop Chase',
  'How we filmed the most dangerous stunt sequence in RBZ history.',
  'video',
  'The rooftop chase sequence in "Meridian" spans seven buildings and was filmed over 12 days in downtown Chicago. Stunt coordinator Dave Chen explains how the team rigged safety systems across actual rooftops, trained the lead actor for four months, and executed a 60-foot jump that had to be done in a single take. "There was no CGI safety net for this one," Chen says. "When you see the actor leap between those buildings, that is real."',
  true,
  true
);
