export const metadata = {
  title: "Style Guide | Power Clean",
};

export default function StyleGuidePage() {
  return (
    <article className="prose-default">
      <header className="mb-10">
        <h1 className="post-title">Style Guide</h1>
        <p className="post-meta">A minimal blog-like look powered by Tailwind.</p>
      </header>

      <section>
        <h2>Typography</h2>
        <p>
          This site uses a clean, content-first style. Text is black on white, with generous spacing
          for comfortable reading. Links like <a href="#">this one</a> are always underlined
          in a retro blue.
        </p>
        <h3>Subheading</h3>
        <p className="prose-muted">
          This paragraph uses a muted style for secondary text. You can also use <strong>strong</strong>
          and <em>emphasis</em> inline.
        </p>
      </section>

      <section>
        <h2>Blockquote</h2>
        <blockquote>
          Great writing is clear thinking made visible.
        </blockquote>
      </section>

      <section>
        <h2>Code</h2>
        <p>
          Inline code looks like <code>const x = 1</code>.
        </p>
        <pre>
<code>{`function greet(name: string) {
  console.log('Hello, ' + name)
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Lists</h2>
        <ul>
          <li>Simple</li>
          <li>Readable</li>
          <li>Focused on content</li>
        </ul>
      </section>

      <section>
        <h2>Buttons</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="btn">Primary</button>
          <button className="btn-outline">Outline</button>
          <a href="#" className="btn-link">Link button</a>
        </div>
      </section>

      <section>
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              <th>Column</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Color</td>
              <td>Black (#000000), White (#ffffff), Link Blue (#137fec)</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>Generous paddings and margins for comfortable reading</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Form Elements</h2>
        <form className="grid gap-4 max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input id="name" placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea id="message" placeholder="Write your thoughts..." />
          </div>
          <button type="submit" className="btn">Submit</button>
        </form>
      </section>

      <footer className="my-16 text-sm text-black/60">
        Tip: Use the <code>site-container</code> class for page layout and <code>prose-default</code> for article content.
      </footer>
    </article>
  );
}
