import { contact } from "../data/content.js";
import { Reveal } from "./Reveal.jsx";
import { srcSetFor } from "../data/media.js";

export default function Closing() {
  return (
    <section className="closing" id="contact">
        <div className="closing__bg" aria-hidden="true">
        <img
          src={contact.image}
          srcSet={srcSetFor(contact.image)}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="closing__veil" aria-hidden="true" />
      <div className="closing__tint" aria-hidden="true" />

      <div className="container closing__inner">
        <Reveal className="closing__statement" y={34}>
          <p>
            {contact.statement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>

        <Reveal as="p" className="closing__note" delay={0.1}>
          {contact.note}
        </Reveal>

        <div className="closing__foot">
          <span className="latin">© 2026 曲靖 · 山水与田野</span>
          <a className="to-top" href="#top">
            回到顶部
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path
                d="M6 11V1.6M6 1.6 1.8 5.8M6 1.6l4.2 4.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
