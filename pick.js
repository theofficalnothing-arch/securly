
export function createPicker() {
  const container = document.createElement("div");

  container.innerHTML = `
    <style>
      .picker {
        background: #10131a;
        color: white;
        font-family: Arial, sans-serif;
        padding: 30px;
        border-radius: 14px;
        text-align: center;
      }

      .picker-options {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-top: 25px;
      }

      .picker a {
        flex: 1;
        max-width: 220px;
        padding: 25px 12px;
        border-radius: 12px;
        background: #1c2230;
        border: 1px solid #343d50;
        color: white;
        text-decoration: none;
        font-weight: bold;
      }

      .picker a:hover {
        background: #29344a;
        border-color: #879bff;
      }
    </style>

    <section class="picker">
      <h2>Choose a Page</h2>
      <p>Select which page you want to open.</p>

      <div class="picker-options">
        <a href="https://raw.esm.sh/gh/theofficalnothing-arch/securly@main/duckmath.svg">
          🦆 DuckMath
        </a>

        <a href="https://raw.esm.sh/gh/theofficalnothing-arch/securly@main/securly.svg">
          🔒 Securly
        </a>
      </div>
    </section>
  `;

  return container;
}
