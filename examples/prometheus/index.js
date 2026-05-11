'use strict';

const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const prometheusPort = 9464;
const prometheusEndpoint = '/metrics';

const exporter = new PrometheusExporter(
  {
    port: prometheusPort,
    endpoint: prometheusEndpoint,
    startServer: true,
  },
  () => {
    console.log(
      `prometheus scrape endpoint: http://localhost:${prometheusPort}${prometheusEndpoint}`,
    );
  },
);

const meter = new MeterProvider({
  readers: [exporter],
}).getMeter('example-prometheus');

const requestCounter = meter.createCounter('requests', {
  description: 'Example of a Counter',
});

const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
  description: 'Example of a UpDownCounter',
});

const labels = { pid: process.pid, environment: 'staging' };

setInterval(() => {
  requestCounter.add(1, labels);
  upDownCounter.add(Math.random() > 0.5 ? 1 : -1, labels);
}, 1000);
