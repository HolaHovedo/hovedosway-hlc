// Hovedo's Way HLC - shared site behaviour.
(function () {
  // Footer year.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle.
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });

    // Close the menu after tapping a link.
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  // ---------------------------------------------------------------- inquiry
  var form = document.getElementById("inquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');
  // Shown to visitors if the form cannot send - matches the address on the page.
  // Submissions themselves go to admin@ via the Web3Forms access key.
  var CONTACT = "vinson@hovedosway.com";
  var PLACEHOLDER_KEY = "WEB3FORMS_ACCESS_KEY_GOES_HERE";

  function say(text, kind) {
    status.textContent = text;
    status.className = "form-status" + (kind ? " is-" + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var key = form.elements.access_key.value;
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      say("Please fill in your name, email, and a short message.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say("That email address does not look right - please check it.", "error");
      return;
    }

    // Never fail silently: if the key is not set yet, send people to email.
    if (key === PLACEHOLDER_KEY || !key) {
      say("The form is not connected yet - please email " + CONTACT + " directly.", "error");
      return;
    }

    var data = Object.fromEntries(new FormData(form));
    data.replyto = email; // replies go to the person who wrote in

    button.disabled = true;
    var original = button.textContent;
    button.textContent = "Sending...";
    say("Sending your inquiry...");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        if (!result.ok) throw new Error(result.body && result.body.message);
        form.reset();
        say("Thank you - your inquiry is on its way. I will be in touch shortly.", "success");
      })
      .catch(function () {
        say("Something went wrong sending that. Please email " + CONTACT + " instead.", "error");
      })
      .then(function () {
        button.disabled = false;
        button.textContent = original;
      });
  });
})();
