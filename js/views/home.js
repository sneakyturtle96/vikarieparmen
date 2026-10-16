export function renderHome(app) {
  app.innerHTML = `
    <section class="hero">
      <div class="container">
        <h1>Mindre tid för förberedelser.<br>Mer tid för undervisning.</h1>
        <p class="lead">
          Lärarhjälpen är ett verktyg för dig som arbetar i svensk grundskola.
          Här kan du snabbt skapa färdiga uppgifter och lösningsförslag –
          anpassade för att fungera direkt i klassrummet, även när du är sjuk
          och behöver lämna över till en vikarie.
        </p>
        <a href="#/matematik" class="btn btn-primary">Kom igång med matematik</a>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Så hjälper verktyget dig</h2>
        <div class="feature-grid">

          <div class="feature-card">
            <div class="feature-icon">÷</div>
            <h3>Generera uppgifter</h3>
            <p>
              Välj område och svårighetsgrad. Verktyget skapar nya uppgifter
              varje gång – inga gamla arbetsblad som återanvänds.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">→</div>
            <h3>Steg för steg-lösningar</h3>
            <p>
              Varje uppgift visas med en tydlig lösning som följer den metod
              som lärs ut i svenska klassrum.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">✓</div>
            <h3>Redo för vikarien</h3>
            <p>
              Materialet är självinstruerande. En vikarie kan dela ut det
              utan att kunna ämnet – eleven kan ändå arbeta vidare.
            </p>
          </div>

        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Börja med matematik</h2>
        <p>
          Första modulen är kort division samt uppställning med addition och
          subtraktion. Fler ämnen och områden kommer.
        </p>
        <a href="#/matematik" class="btn btn-secondary">Öppna matematikverktyget</a>
      </div>
    </section>
  `;
}
