function injectLightDateWidgetStyles() {
  if (document.getElementById('light-date-widget-styles')) return;

  const style = document.createElement('style');
  style.id = 'light-date-widget-styles';
  style.textContent = `
    .custom-date-widget {
      display: flex;
      gap: 8px;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .custom-date-widget select,
    .custom-date-widget input {
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      background-color: #fff;
      color: #333;
    }
    /* Remove native number scroll buttons */
    .custom-date-widget input[type="number"]::-webkit-outer-spin-button,
    .custom-date-widget input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .custom-date-widget input[type="number"] {
      -moz-appearance: textfield; /* Firefox */
      width: 80px;
    }
  `;
  document.head.appendChild(style);
}

// 2. The Core Class
class LightDateWidget {
  constructor(element) {
    this.container = element;
    
    this.startDate = this.parseDateAttr(element.getAttribute('startdate'));
    this.endDate = this.parseDateAttr(element.getAttribute('enddate'));
    this.initialValue = this.parseDateAttr(element.getAttribute('value'));
    
    this.isRequired = element.hasAttribute('required');
    this.isDisabled = element.hasAttribute('disabled');
    this.isReadonly = element.hasAttribute('readonly');
    this.inputName = element.getAttribute('name') || 'custom-date';

    this.initDOM();
    this.attachEvents();
    
    this.populateInitialValue();
    this.applyStates();
  }

  parseDateAttr(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10), date: parseInt(parts[2], 10) };
  }

  pad(num) {
    return num < 10 ? `0${num}` : num.toString();
  }

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  initDOM() {
    this.container.classList.add('custom-date-widget');
    this.container.innerHTML = '';

    this.yearInput = document.createElement('input');
    this.yearInput.type = 'number';
    this.yearInput.placeholder = 'YYYY';
    this.yearInput.min = '1';
    if (this.isRequired && !this.isDisabled && !this.isReadonly) this.yearInput.required = true;

    this.monthSelect = document.createElement('select');
    this.monthSelect.innerHTML = `<option value="">MM</option>`;
    this.monthSelect.disabled = true; 
    if (this.isRequired && !this.isDisabled && !this.isReadonly) this.monthSelect.required = true;

    this.dateSelect = document.createElement('select');
    this.dateSelect.innerHTML = `<option value="">DD</option>`;
    this.dateSelect.disabled = true;
    if (this.isRequired && !this.isDisabled && !this.isReadonly) this.dateSelect.required = true;

    this.hiddenInput = document.createElement('input');
    this.hiddenInput.type = 'hidden';
    this.hiddenInput.name = this.inputName;

    this.container.appendChild(this.yearInput);
    this.container.appendChild(this.monthSelect);
    this.container.appendChild(this.dateSelect);
    this.container.appendChild(this.hiddenInput);
  }

  populateInitialValue() {
    if (!this.initialValue) return;

    this.yearInput.value = this.initialValue.year;
    this.handleYearChange();
    this.monthSelect.value = this.initialValue.month;
    this.handleMonthChange();
    this.dateSelect.value = this.initialValue.date;
    this.updateHiddenValue();
  }

  applyStates() {
    if (this.isDisabled) {
      this.yearInput.disabled = true;
      this.monthSelect.disabled = true;
      this.dateSelect.disabled = true;
      this.hiddenInput.disabled = true; 
      this.container.style.opacity = '0.6';
    } else if (this.isReadonly) {
      this.yearInput.readOnly = true;
      this.monthSelect.style.pointerEvents = 'none';
      this.monthSelect.tabIndex = -1;
      this.dateSelect.style.pointerEvents = 'none';
      this.dateSelect.tabIndex = -1;
      this.container.style.backgroundColor = '#f9f9f9'; 
    }
  }

  attachEvents() {
    this.yearInput.addEventListener('wheel', (e) => e.preventDefault());
    this.yearInput.addEventListener('keydown', (e) => {
      if (this.isReadonly) { e.preventDefault(); return; }
      if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
    });

    this.yearInput.addEventListener('input', () => this.handleYearChange());
    this.monthSelect.addEventListener('change', () => this.handleMonthChange());
    this.dateSelect.addEventListener('change', () => this.updateHiddenValue());
  }

  handleYearChange() {
    const yearVal = parseInt(this.yearInput.value, 10);
    this.monthSelect.innerHTML = `<option value="">MM</option>`;
    this.dateSelect.innerHTML = `<option value="">DD</option>`;
    this.dateSelect.disabled = true;
    this.hiddenInput.value = '';

    if (isNaN(yearVal) || yearVal <= 0) {
      this.monthSelect.disabled = true;
      return;
    }

    if (this.startDate && yearVal < this.startDate.year) {
      this.yearInput.value = this.startDate.year;
      return this.handleYearChange();
    }
    if (this.endDate && yearVal > this.endDate.year) {
      this.yearInput.value = this.endDate.year;
      return this.handleYearChange();
    }

    this.monthSelect.disabled = false;
    let minMonth = (this.startDate && yearVal === this.startDate.year) ? this.startDate.month : 1;
    let maxMonth = (this.endDate && yearVal === this.endDate.year) ? this.endDate.month : 12;

    for (let m = 1; m <= 12; m++) {
      const option = document.createElement('option');
      option.value = m;
      option.textContent = this.pad(m);
      if (m < minMonth || m > maxMonth) option.disabled = true;
      this.monthSelect.appendChild(option);
    }
  }

  handleMonthChange() {
    const yearVal = parseInt(this.yearInput.value, 10);
    const monthVal = parseInt(this.monthSelect.value, 10);

    this.dateSelect.innerHTML = `<option value="">DD</option>`;
    this.hiddenInput.value = '';

    if (isNaN(monthVal)) {
      this.dateSelect.disabled = true;
      return;
    }

    this.dateSelect.disabled = false;
    const daysInMonth = this.getDaysInMonth(yearVal, monthVal);

    let minDate = 1;
    let maxDate = daysInMonth;

    if (this.startDate && yearVal === this.startDate.year && monthVal === this.startDate.month) {
      minDate = this.startDate.date;
    }
    if (this.endDate && yearVal === this.endDate.year && monthVal === this.endDate.month) {
      maxDate = Math.min(daysInMonth, this.endDate.date);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const option = document.createElement('option');
      option.value = d;
      option.textContent = this.pad(d);
      if (d < minDate || d > maxDate) option.disabled = true;
      this.dateSelect.appendChild(option);
    }
  }

  updateHiddenValue() {
    const y = this.yearInput.value;
    const m = this.pad(parseInt(this.monthSelect.value, 10));
    const d = this.pad(parseInt(this.dateSelect.value, 10));
    
    if (y && m !== "NaN" && d !== "NaN") {
      this.hiddenInput.value = `${y}-${m}-${d}`;
    } else {
      this.hiddenInput.value = '';
    }
  }
}

// 3. Auto-Initialization
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    injectLightDateWidgetStyles(); // Inject CSS once
    const dateElements = document.querySelectorAll('div[type="date"]');
    dateElements.forEach(el => new LightDateWidget(el));
  });
}
