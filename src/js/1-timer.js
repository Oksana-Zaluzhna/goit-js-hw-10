import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const day = document.querySelector('span[data-days]');
const hour = document.querySelector('span[data-hours]');
const min = document.querySelector('span[data-minutes]');
const sec = document.querySelector('span[data-seconds]');

let userSelectedDate = null;
let intervalId = null;
startBtn.disabled = true;

init();

startBtn.addEventListener('click', start);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = Date.now();
    if (currentDate >= selectedDates[0]) {
      startBtn.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      startBtn.disabled = false;
      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function start() {
  intervalId = setInterval(() => {
    const currentDate = Date.now();
    const deltaTime = userSelectedDate - currentDate;
    updateTimer(convertMs(deltaTime));
    startBtn.disabled = true;
    input.disabled = true;

    if (deltaTime <= 0) {
      stop();
    }
  }, 1000);
}

function stop() {
  clearInterval(intervalId);
  input.disabled = false;
  startBtn.disabled = true;
  updateTimer(convertMs(0));
}

function updateTimer({ days, hours, minutes, seconds }) {
  day.textContent = `${days}`;
  hour.textContent = `${hours}`;
  min.textContent = `${minutes}`;
  sec.textContent = `${seconds}`;
}

function init() {
  updateTimer(convertMs(0));
}
