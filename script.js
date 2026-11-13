const $ = s => document.querySelector(s);

const money = n =>
  "₹" + Number(n).toLocaleString("en-IN");

const products = [
  ["Studio Wireless Headphones","Tech",3499,"New","photo-1505740420928-5e560c06d30e"],
  ["Everyday Carry Backpack","Accessories",2299,"Bestseller","photo-1553062407-98eeb64c6a62"],
  ["Ceramic Table Set","Home",1599,"Curated","photo-1490312278390-ab64016e0aa9"],
  ["Minimal Desk Lamp","Home",1899,"New","photo-1507473885765-e6ed057f782c"],
  ["Classic Wrist Watch","Accessories",4299,"Popular","photo-1524592094714-0f0654e20314"],
  ["Smart Fitness Band","Tech",2799,"New","photo-1575311373937-040b8e1fd5b6"],
  ["Daily Journal","Stationery",499,"Essential","photo-1517842645767-c639042777db"],
  ["Botanical Care Set","Wellness",899,"Gentle","photo-1608571423902-eed4a5ad8108"],
  ["Portable Speaker","Tech",1999,"Popular","photo-1608043152269-423dbba4e7e1"],
  ["Leather Card Holder","Accessories",799,"Essential","photo-1627123424574-724758594e93"],
  ["Scented Candle","Home",649,"Curated","photo-1603006905003-be475563bc59"],
  ["Travel Bottle","Wellness",399,"Useful","photo-1602143407151-7111542de6e8"]
];

const imageUrl = id =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

let cart = 0;
let shown = 8;
let category = "All";
let activeLang = "html";
let filtered = [];

function renderProducts() {
  const q = $("#searchInput").value.toLowerCase();
  const sort = $("#sortFilter").value;

  filtered = products.filter(p =>
    (category === "All" || p[1] === category) &&
    (`${p[0]} ${p[1]}`.toLowerCase().includes(q))
  );

  if (sort === "low")
    filtered.sort((a,b) => a[2] - b[2]);

  if (sort === "high")
    filtered.sort((a,b) => b[2] - a[2]);

  $("#productGrid").innerHTML =
    filtered.slice(0,shown).map((p,i) => `
      <article class="product-card">
        <div class="product-image">
          <img loading="lazy" src="${imageUrl(p[4])}" alt="${p[0]}">
          <span class="product-tag">${p[3]}</span>
          <button class="wish" data-wish="${p[0]}">♡</button>
        </div>

        <div class="product-info">
          <div class="product-category">${p[1]}</div>
          <div class="product-name">${p[0]}</div>

          <div class="product-bottom">
            <span class="price">${money(p[2])}</span>
            <button class="add-btn" data-add="${i}">ADD +</button>
          </div>
        </div>
      </article>
    `).join("") || "<p>No matching products. Try another search.</p>";

  $("#resultCount").textContent =
    `Showing ${Math.min(shown,filtered.length)} of ${filtered.length} demo products`;

  $("#loadMore").style.display =
    shown >= filtered.length ? "none" : "inline-flex";
}

$("#productGrid").addEventListener("click", e => {
  if (e.target.dataset.add !== undefined) {
    cart++;
    $("#cartCount").textContent = cart;
    toast("Added to your bag");
  }

  if (e.target.dataset.wish)
    toast("Saved to your wishlist (demo)");
});

$("#searchInput").addEventListener("input", () => {
  shown = 8;
  renderProducts();
});

$("#categoryFilter").addEventListener("change", e => {
  category = e.target.value;
  shown = 8;
  renderProducts();
  syncPills();
});

$("#sortFilter").addEventListener("change", renderProducts);

$("#categoryPills").addEventListener("click", e => {
  if (e.target.dataset.category) {
    category = e.target.dataset.category;
    $("#categoryFilter").value = category;
    shown = 8;
    renderProducts();
    syncPills();
  }
});

function syncPills() {
  $$(".pill").forEach(b =>
    b.classList.toggle("active", b.dataset.category === category)
  );
}

$("#loadMore").onclick = () => {
  shown += 4;
  renderProducts();
};

$("#cartBtn").onclick = () =>
  toast(`${cart} item(s) in your bag — checkout is not connected yet`);

$("#wishlistBtn").onclick = () =>
  toast("Wishlist demo");

$("#searchFocus").onclick = () =>
  $("#searchInput").focus();

$("#menuBtn").onclick = () =>
  toast("Use the page sections below to navigate");

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

$("#year").textContent = new Date().getFullYear();


// ===================================
// 15 USEFUL DAILY TOOLS
// ===================================

const tools = [
  ["Calculator","＋","calculator"],
  ["Scientific calculator","∑","scientific"],
  ["Unit converter","⇄","unit"],
  ["Currency converter","₹","currency"],
  ["Age calculator","⌁","age"],
  ["Date calculator","▦","date"],
  ["Stopwatch","◷","stopwatch"],
  ["Timer","◴","timer"],
  ["Word counter","¶","words"],
  ["Notes","✎","notes"],
  ["To-do list","☑","todo"],
  ["Password generator","✳","password"],
  ["QR generator","▦","qr"],
  ["Percentage calculator","%","percent"],
  ["BMI calculator","♡","bmi"]
];

let toolState = {};

$("#toolList").innerHTML = tools.map((t,i) => `
  <button class="tool-choice ${i===0?"active":""}" data-tool="${t[2]}">
    <span>${t[1]}</span>
    ${String(i+1).padStart(2,"0")} · ${t[0]}
  </button>
`).join("");

$("#toolList").addEventListener("click", e => {
  const b = e.target.closest("[data-tool]");
  if (!b) return;

  $$(".tool-choice").forEach(x =>
    x.classList.toggle("active",x===b)
  );

  showTool(b.dataset.tool);
});

const field = (label,id,type="number",value="") =>
  `<label>${label}</label>
   <input id="${id}" type="${type}" value="${value}" placeholder="${label}">`;

const action = (label="Calculate") =>
  `<button id="toolAction">${label}</button>
   <div class="tool-result" id="toolResult">Your result will appear here.</div>`;

function showTool(id) {
  const w = $("#toolWorkspace");
  let content = "";
  let run = () => {};

  const set = (title,body,fn) => {
    content = `
      <div class="tool-panel">
        <p class="eyebrow">ISHAN DAILY TOOL</p>
        <h3>${title}</h3>
        ${body}
      </div>`;
    run = fn;
  };

  // Calculator
  if (id === "calculator" || id === "scientific") {
    set(
      id === "calculator" ? "Calculator" : "Scientific calculator",
      field("Enter expression","expr","text","(25 + 15) * 2") +
      action("Calculate"),
      () => {
        try {
          let s = $("#expr").value;

          if (!/^[0-9+\-*/().% \s]+$/.test(s))
            throw 0;

          $("#toolResult").textContent =
            "Result: " +
            Function('"use strict";return (' +
              s.replace(/%/g,"/100") + ")")();

        } catch {
          $("#toolResult").textContent =
            "Please enter a valid arithmetic expression.";
        }
      }
    );
  }

  // Unit converter
  if (id === "unit") {
    set(
      "Unit converter",
      `<label>Convert</label>
       <select id="unitType">
         <option value="km">Kilometres to miles</option>
         <option value="mi">Miles to kilometres</option>
         <option value="kg">Kilograms to pounds</option>
         <option value="lb">Pounds to kilograms</option>
         <option value="cm">Centimetres to inches</option>
         <option value="in">Inches to centimetres</option>
         <option value="c">Celsius to Fahrenheit</option>
         <option value="f">Fahrenheit to Celsius</option>
       </select>` +
       field("Value","unitVal") +
       action(),
      () => {
        let v = +$("#unitVal").value;
        let k = $("#unitType").value;

        let m = {
          km:v*.621371,
          mi:v/.621371,
          kg:v*2.20462,
          lb:v/2.20462,
          cm:v/2.54,
          in:v*2.54,
          c:v*9/5+32,
          f:(v-32)*5/9
        };

        $("#toolResult").textContent =
          "Result: " +
          (Number.isFinite(m[k]) ? m[k].toFixed(3) : "Enter a value");
      }
    );
  }

  // Currency converter (demo rates)
  if (id === "currency") {
    set(
      "Currency converter",
      `<p class="fine-print">Demo rates only. Not live financial exchange rates.</p>` +
      field("Amount in INR","currAmt") +
      `<label>Convert INR to</label>
       <select id="currType">
         <option value=".0117">USD</option>
         <option value=".0108">EUR</option>
         <option value=".0093">GBP</option>
         <option value="1.75">JPY</option>
       </select>` +
       action(),
      () => {
        $("#toolResult").textContent =
          "Approximate result: " +
          (Number($("#currAmt").value) *
          Number($("#currType").value)).toFixed(2);
      }
    );
  }

  // Age calculator
  if (id === "age") {
    set(
      "Age calculator",
      field("Date of birth","birth","date") + action(),
      () => {
        let d = new Date($("#birth").value);
        if (isNaN(d)) return;

        let n = new Date();
        let a = n.getFullYear() - d.getFullYear();

        if (n < new Date(n.getFullYear(),d.getMonth(),d.getDate()))
          a--;

        $("#toolResult").textContent =
          a >= 0 ? "Age: " + a + " years" : "Please choose a valid date";
      }
    );
  }

  // Date calculator
  if (id === "date") {
    set(
      "Date difference",
      field("Start date","dateA","date") +
      field("End date","dateB","date") +
      action(),
      () => {
        let a = new Date($("#dateA").value);
        let b = new Date($("#dateB").value);

        $("#toolResult").textContent =
          isNaN(a) || isNaN(b)
          ? "Choose both dates"
          : "Difference: " +
            Math.abs(Math.round((b-a)/86400000)) + " days";
      }
    );
  }

  // Stopwatch and timer
  if (id === "stopwatch" || id === "timer") {
    set(
      id === "stopwatch" ? "Stopwatch" : "Timer",
      id === "stopwatch"
      ? `<h2 id="clock">00:00.0</h2>
         <button id="startClock">Start</button>
         <button id="stopClock">Stop</button>
         <button id="resetClock">Reset</button>`
      : field("Seconds","seconds","number","60") +
        `<button id="startTimer">Start timer</button>
         <div class="tool-result" id="toolResult">Ready</div>`,
      () => {}
    );
  }

  // Word counter
  if (id === "words") {
    set(
      "Word counter",
      `<label>Your text</label>
       <textarea id="wordText" rows="7"
       placeholder="Paste or type your text here..."
       style="width:100%;padding:12px;border:1px solid var(--line)"></textarea>
       <div class="tool-result" id="wordResult">0 words · 0 characters</div>`,
      () => {}
    );
  }

  // Notes
  if (id === "notes") {
    set(
      "Quick notes",
      `<textarea id="noteText" rows="8" placeholder="Write a note..."></textarea>
       <button id="saveNote">Save on this device</button>
       <div class="tool-result" id="toolResult">Notes stay in this page session in this demo.</div>`,
      () => {}
    );
  }

  // To-do
  if (id === "todo") {
    set(
      "To-do list",
      field("Add a task","task","text") +
      `<button id="addTask">Add task</button>
       <div id="taskList" class="tool-result"></div>`,
      () => {}
    );
  }

  // Password generator
  if (id === "password") {
    set(
      "Password generator",
      field("Length (8–32)","passLen","number","16") +
      `<button id="makePass">Generate password</button>
       <div class="tool-result" id="toolResult">Use a unique password for each account.</div>`,
      () => {}
    );
  }

  // QR generator
  if (id === "qr") {
    set(
      "QR code generator",
      field("Text or URL","qrText","text","https://example.com") +
      `<button id="makeQR">Generate QR</button>
       <div id="qrResult" class="tool-result">Enter text or a URL. Internet is required for this demo QR service.</div>`,
      () => {}
    );
  }

  // Percentage calculator
  if (id === "percent") {
    set(
      "Percentage calculator",
      field("What is the percentage?","pct","number","15") +
      field("Of what number?","pctOf","number","200") +
      action(),
      () => {
        $("#toolResult").textContent =
          "Result: " +
          (Number($("#pct").value) *
          Number($("#pctOf").value) / 100);
      }
    );
  }

  // BMI calculator
  if (id === "bmi") {
    set(
      "BMI calculator",
      field("Weight (kg)","weight") +
      field("Height (cm)","height") +
      action(),
      () => {
        let w = +$("#weight").value;
        let h = +$("#height").value / 100;

        if (w > 0 && h > 0) {
          $("#toolResult").textContent =
            "BMI: " + (w/(h*h)).toFixed(1) +
            " · BMI is a limited screening measure and is not a diagnosis.";
        }
      }
    );
  }

  w.innerHTML = content;

  const btn = $("#toolAction");
  if (btn) btn.onclick = run;

  if (id === "words") {
    $("#wordText").oninput = () => {
      let s = $("#wordText").value;
      $("#wordResult").textContent =
        s.trim().split(/\s+/).filter(Boolean).length +
        " words · " + s.length + " characters";
    };
  }

  if (id === "notes") {
    $("#noteText").value = toolState.note || "";

    $("#saveNote").onclick = () => {
      toolState.note = $("#noteText").value;
      $("#toolResult").textContent = "Saved for this session.";
    };
  }

  if (id === "todo") {
    $("#addTask").onclick = () => {
      let v = $("#task").value.trim();

      if (v) {
        let el = document.createElement("div");
        el.textContent = "□ " + v;
        $("#taskList").append(el);
        $("#task").value = "";
      }
    };
  }

  if (id === "password") {
    $("#makePass").onclick = () => {
      let n = Math.max(8,Math.min(32,+$("#passLen").value || 16));
      let chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
      let a = new Uint32Array(n);

      crypto.getRandomValues(a);

      $("#toolResult").textContent =
        Array.from(a,x => chars[x % chars.length]).join("");
    };
  }

  if (id === "qr") {
    $("#makeQR").onclick = () => {
      let v = $("#qrText").value;

      $("#qrResult").innerHTML = v
        ? `<img alt="Generated QR code" width="160" height="160"
           src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(v)}">`
        : "Enter text first";
    };
  }

  if (id === "stopwatch") {
    let start = 0;
    let elapsed = 0;
    let timer = null;

    const fmt = x => {
      let s = x / 1000;
      return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}.${Math.floor(s%1*10)}`;
    };

    $("#startClock").onclick = () => {
      if (timer) return;

      start = Date.now() - elapsed;

      timer = setInterval(() => {
        $("#clock").textContent = fmt(Date.now()-start);
      },100);
    };

    $("#stopClock").onclick = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
        elapsed = Date.now() - start;
      }
    };

    $("#resetClock").onclick = () => {
      clearInterval(timer);
      timer = null;
      elapsed = 0;
      $("#clock").textContent = "00:00.0";
    };
  }

  if (id === "timer") {
    $("#startTimer").onclick = () => {
      let s = Math.max(1,+$("#seconds").value || 1);

      $("#toolResult").textContent = s + " seconds remaining";

      let iv = setInterval(() => {
        s--;

        $("#toolResult").textContent = s + " seconds remaining";

        if (s <= 0) {
          clearInterval(iv);
          $("#toolResult").textContent = "Time is up!";
        }
      },1000);
    };
  }
}

function $$ (s) {
  return [...document.querySelectorAll(s)];
}

showTool("calculator");
renderProducts();


// ===================================
// ISHAN CODING STUDIO
// ===================================

const samples = {
  html: `<main class="card">
  <p class="eyebrow">HELLO, CREATOR</p>
  <h1>Build something <em>beautiful.</em></h1>
  <p>Edit the HTML, CSS and JavaScript tabs, then run your preview.</p>
  <button onclick="sayHello()">Try me</button>
  <p id="message"></p>
</main>`,

  css: `body {
  font-family: Arial, sans-serif;
  background: #f2efe7;
  padding: 30px;
}
.card {
  max-width: 520px;
  margin: auto;
  padding: 35px;
  background: white;
  border-radius: 18px;
}
h1 {
  font-size: 34px;
}
em {
  color: #a48651;
}
button {
  padding: 12px 18px;
  background: #20231d;
  color: white;
  border: 0;
  border-radius: 5px;
}`,

  js: `function sayHello() {
  document.getElementById('message').textContent =
    'Your first preview works!';
}`
};

let code = {...samples};

function switchEditor(lang) {
  activeLang = lang;
  $("#codeEditor").value = code[lang];

  $$(".editor-tab").forEach(b =>
    b.classList.toggle("active",b.dataset.lang===lang)
  );
}

$$(".editor-tab").forEach(b => {
  b.onclick = () => {
    code[activeLang] = $("#codeEditor").value;
    switchEditor(b.dataset.lang);
  };
});

$("#codeEditor").value = code.html;

$("#codeEditor").addEventListener("input", () => {
  code[activeLang] = $("#codeEditor").value;
});

$("#runCode").onclick = () => {
  code[activeLang] = $("#codeEditor").value;

  const src = `
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>${code.css}</style>
    </head>
    <body>
      ${code.html}
      <script>
        ${code.js.replace(/<\/script/gi,"<\\/script")}
      <\/script>
    </body>
    </html>
  `;

  $("#codePreview").srcdoc = src;
  toast("Preview updated");
};

$("#runCode").click();