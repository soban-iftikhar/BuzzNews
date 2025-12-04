import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../Styles/Contact.css';

const Contact = () => {
  return (
    <>
      <Header />

      <div className="page-container">

        <main className="about-main-content">

          {/* Hero Section */}
          <section className="about-hero-section">
            <h1 className="about-page-title">Contact BuzzNews</h1>
          </section>

          {/* Intro */}
          <section className="about-content-section" style={{ flexDirection: "column" }}>
            <p className="about-text">
              Have a story tip collaboration request advertising inquiry or need to reach our editorial team? 
              BuzzNews is always open to hearing from readers creators and partners. Use the form below or contact us through our official channels.
            </p>
          </section>

          {/* Contact Split */}
          <section className="about-content-section">

            {/* Contact Information */}
            <div className="content-block">
              <h2 className="section-heading">Get In Touch</h2>

              <ul className="values-list">
                <li>
                  <strong>Email</strong>
                  support@buzznews.com
                </li>
                <li>
                  <strong>Press & Media</strong>
                  press@buzznews.com
                </li>
                <li>
                  <strong>Phone</strong>
                  +92 300 1234567
                </li>
                <li>
                  <strong>Office Hours</strong>
                  Monday to Friday | 10 AM to 6 PM
                </li>
              </ul>
            </div>

            {/* Contact Form */}
            <div className="content-block">
              <h2 className="section-heading">Send A Message</h2>

              <form className="contact-form">

                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your Name"
                  required
                />

                <input
                  type="email"
                  className="contact-input"
                  placeholder="Email Address"
                  required
                />

                <input
                  type="text"
                  className="contact-input"
                  placeholder="Subject"
                  required
                />

                <textarea
                  className="contact-textarea"
                  placeholder="Your Message"
                  rows="6"
                  required
                ></textarea>

                <button
                  type="submit"
                  className="contact-submit-btn"
                >
                  Send Message
                </button>
              </form>
            </div>

          </section>

          {/* CTA */}
          <section className="contact-cta">
            <p className="about-text">
              Want to explore who we are and what drives our newsroom?
            </p>
            <a href="/about" className="cta-link">Read About Us</a>
          </section>

        </main>

      </div>

      <Footer />
    </>
  )
}

export default Contact
