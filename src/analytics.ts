const goatCounterCode = process.env.REACT_APP_GOATCOUNTER_CODE;

export const loadAnalytics = () => {
  if (!goatCounterCode || process.env.NODE_ENV !== 'production') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${goatCounterCode}.goatcounter.com/count`;
  document.head.appendChild(script);
};