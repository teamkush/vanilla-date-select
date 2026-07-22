# Vanilla Date Select

A lightweight, zero-dependency vanilla JavaScript date widget. It replaces standard calendar popups with a clean, linear 3-input design (Year → Month → Date) that prevents scrolling errors and dynamically validates date logic.

## ✨ Features

* **Zero Dependencies:** Pure vanilla JavaScript.
* **Single File Integration:** No separate CSS file required; styles are dynamically injected.
* **Strict Date Logic:** Date dropdown automatically adjusts based on the selected month and leap years.
* **Range Validation:** Restrict selection using `startdate` and `enddate` attributes.
* **Native Form Integration:** Seamlessly supports `<form>` submission, `name`, and native HTML5 `required` validation.
* **Smart UI States:** Fully supports `disabled`, `readonly`, and initial `value` attributes.

## 🚀 Installation

Add the single JavaScript file to your HTML via the jsDelivr CDN. It automatically handles CSS injection and initializes any date components on the page.

```html
<!-- Add this before your closing </body> tag -->
<script src="[https://cdn.jsdelivr.net/gh/teamkush/vanilla-date-select@1.0.0/light-date-widget.min.js](https://cdn.jsdelivr.net/gh/teamkush/vanilla-date-select@1.0.0/light-date-widget.min.js)"></script>

## Basic Usage
<div type="date"></div>

## Advanced Usage with Form Integration
<form action="/submit" method="POST">
  <label>Date of Birth:</label>
  
  <div 
    type="date" 
    name="dob" 
    startdate="1950-01-01" 
    enddate="2024-12-31" 
    value="1995-08-24" 
    required>
  </div>
  
  <button type="submit">Save</button>
</form>
