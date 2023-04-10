const entrance = document.getElementById('entrance');
entrance.click();

const builders = [
  'Staging...',
  'Building...',
  'Deploying...',
  'Testing...',
  'Cooking...',
  'Serving...',
  'Frying...',
  'Baking...',
];

function collectorLoad(e: Event) {
  (
    e.target as HTMLElement
  ).innerHTML = `<i class="fa fa-spinner fa-spin collectorload"></i> Loading...`;

  spice();
}
document
  .querySelector('#collectorload')
  .addEventListener('click', collectorLoad, false);

function spice() {
  window.setInterval(() => {
    document.querySelector(
      '#collectorload'
    ).innerHTML = `<i class="fa fa-spinner fa-spin collectorload"></i> ${
      builders[Math.floor(Math.random() * builders.length)]
    }`;
  }, 2000);
}

//alerting the user on fail
// halfmoon.initStickyAlert({
// content: 'Failed! Please try again',
// alertType: 'alert-danger',
// fillType: 'filled-lm',
// });
