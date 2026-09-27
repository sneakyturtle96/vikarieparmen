export function renderNotFound(app) {
  app.innerHTML = `
    <section class="page-intro">
      <div class="container">
        <nav class="breadcrumb">
          <a href="#/">Hem</a> ›
          <span>Sidan hittades inte</span>
        </nav>
        <h1>Sidan hittades inte</h1>
        <p class="lead">
          Sidan du försöker nå finns inte. Välj ett ämne i menyn ovan.
        </p>
        <a href="#/" class="btn btn-primary">Till startsidan</a>
      </div>
    </section>
  `;
}