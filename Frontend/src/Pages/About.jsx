import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../Styles/About.css'

const About = () => {
  return (
    <>
      <Header />

      <div className="page-container">

        <main className="about-main-content">

        
          <section className="about-hero-section">
            <h1 className="about-page-title">About BuzzNews</h1>
          </section>

          <section className="about-content-section">
            <div className="content-block">
              <h2 className="section-heading">Our Mission</h2>
              <p className="about-text">
                BuzzNews was created to cut through the noise. In a world overflowing with opinions 
                and misinformation we deliver sharp fact checked and timely news that empowers readers 
                to stay informed without the clutter. Our mission is simple: make news fast credible and engaging.
              </p>
            </div>

            <div className="content-block">
              <h2 className="section-heading">Who We Are</h2>
              <p className="about-text">
                We are a digital news startup run by a team of writers analysts and tech enthusiasts 
                who believe journalism should be bold and accessible. Our newsroom blends technology 
                and storytelling to bring you coverage that is reliable and always ahead of the curve.
              </p>
            </div>
          </section>

          {/* History Section */}
          <section className="about-content-section">
            <div className="content-block">
              <h2 className="section-heading">How It Started</h2>
              <p className="about-text">
                BuzzNews started as a small idea during late night discussions about the state of online 
                media. Over time the platform grew into a powerful voice trusted by thousands of readers 
                for its clean reporting style and fearless commentary on current events.
              </p>
            </div>

            <div className="content-block">
              <h2 className="section-heading">Our Values</h2>
              <ul className="values-list">
                <li>
                  <strong>Accuracy First</strong>
                  Every headline goes through verification to maintain the trust we have built.
                </li>
                <li>
                  <strong>Unbiased Reporting</strong>
                  We present stories as they are without political tilt or sensationalism.
                </li>
                <li>
                  <strong>Speed with Integrity</strong>
                  Breaking news deserves urgency but never at the cost of truth.
                </li>
                <li>
                  <strong>Innovation Driven</strong>
                  We push digital journalism forward with smart tools and modern storytelling.
                </li>
              </ul>
            </div>
          </section>

          {/* Team Section */}
          <section className="team-section">
            <h2 className="section-heading team-heading">Meet The Team</h2>

            <div className="team-grid">

              <div className="team-member-card">
                <img
                  src="/images/founder.jpg"
                  alt="Founder"
                  className="member-photo"
                />
                <h3 className="member-name">Alex Carter</h3>
                <p className="member-title">Founder & Editor in Chief</p>
                <p className="member-bio">
                  Alex oversees the editorial direction of BuzzNews ensuring that every story reflects 
                  the brand’s commitment to truth clarity and boldness.
                </p>
              </div>

              <div className="team-member-card">
                <img
                  src="/images/lead-writer.jpg"
                  alt="Lead Writer"
                  className="member-photo"
                />
                <h3 className="member-name">Jamie Brooks</h3>
                <p className="member-title">Lead Writer</p>
                <p className="member-bio">
                  Jamie covers politics culture and emerging trends with a storytelling style that 
                  connects deeply with readers.
                </p>
              </div>

              <div className="team-member-card">
                <img
                  src="/images/tech-analyst.jpg"
                  alt="Tech Analyst"
                  className="member-photo"
                />
                <h3 className="member-name">Riley Morgan</h3>
                <p className="member-title">Tech Analyst</p>
                <p className="member-bio">
                  Riley analyzes the latest tech developments and translates complex updates into 
                  accessible insights for the audience.
                </p>
              </div>

            </div>
          </section>

          {/* Contact CTA */}
          <section className="contact-cta">
            <p className="about-text">
              Want to reach out for press inquiries collaborations or story tips?
            </p>
            <a href="/contact" className="cta-link">Contact Our Team</a>
          </section>

        </main>

      </div>

      <Footer />
    </>
  )
}

export default About
