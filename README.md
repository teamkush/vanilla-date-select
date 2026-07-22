# Vanilla Date Select

A lightweight, zero-dependency vanilla JavaScript date widget. It replaces standard calendar popups with a clean, linear 3-input design (Year → Month → Date) that prevents scrolling errors and dynamically validates date logic.

## ✨ Features

* **Zero Dependencies:** Pure vanilla JavaScript.
* **Single File Integration:** No separate CSS file required; styles are dynamically injected.
* **Strict Date Logic:** Date dropdown automatically adjusts based on the selected month and leap years.
* **Range Validation:** Restrict selection using `startdate` and `enddate` attributes.
* **Native Form Integration:** Seamlessly supports `<form>` submission, `name`, and native HTML5 `required` validation.
* **Smart UI States:** Fully supports `disabled`, `readonly`, and initial `value` attributes.

---

## 🚀 Installation

Add the single JavaScript file to your HTML via the jsDelivr CDN. It automatically handles CSS injection and initializes any date components on the page.

```html
<!-- Add this before your closing </body> tag -->
<script src="https://cdn.jsdelivr.net/gh/teamkush/vanilla-date-select@1.0.0/light-date-widget.min.js"></script>
```
*(Note: Replace `teamkush` with your actual GitHub handle)*

---

## 💻 Usage

To render the widget, simply create a `<div>` with the attribute `type="date"`. The script will automatically find it and mount the component.

### Basic Usage
The simplest implementation gives you an unrestricted date picker.

```html
<div type="date"></div>
```

### Advanced Usage (Form Integration)
This example demonstrates a fully restricted date picker ready for backend submission. It requires a selection, sets a default value, restricts the allowed date range, and assigns a name for the form payload.

```html
<form action="/submit" method="POST">
  <label>Date of Birth:</label>
  
  <div 
    type="date" 
    name="dob" 
    startdate="1950-01-01" 
    enddate="2026-12-31" 
    value="1995-08-24" 
    required>
  </div>
  
  <button type="submit">Save Date</button>
</form>
```

---

## ⚙️ Supported Attributes

You can control the widget's behavior by applying the following attributes directly to the `<div type="date">` wrapper:

| Attribute | Example | Description |
| :--- | :--- | :--- |
| `name` | `name="start_date"` | The key used when submitting a form. The component creates a hidden input to send the final `YYYY-MM-DD` payload under this name. |
| `value` | `value="2023-10-15"` | Pre-populates the widget with an initial date. |
| `startdate` | `startdate="2020-01-01"` | The earliest allowed date. Users cannot type a year or select months/dates before this specified date. |
| `enddate` | `enddate="2025-12-31"` | The latest allowed date. Users cannot bypass this limit. |
| `required` | `required` | Triggers native browser form validation if left incomplete (acts exactly like a standard required input). |
| `readonly` | `readonly` | Locks the UI from changes, but the value **will** still submit with the form. |
| `disabled` | `disabled` | Greys out the UI completely. The value **will not** submit with the form. |

---

## 🛠 How Form Submission Works

Because this widget uses a custom multi-input UI (a number input and two dropdowns), standard form submission wouldn't normally know how to read it as a single value. 

To solve this, the script automatically generates an invisible `<input type="hidden">` element under the hood. As the user selects a valid Year, Month, and Date, this hidden input updates with a strictly formatted `YYYY-MM-DD` string. 

If the user only partially fills out the date, the hidden input remains blank. This ensures your backend receives perfectly structured, valid data every time without needing extra frontend parsing logic.

---

## 📄 License

MIT License
