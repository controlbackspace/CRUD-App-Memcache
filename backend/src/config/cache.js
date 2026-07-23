const Memcached = require('memcached');

const cache = new Memcached('127.0.0.1:11211', {
  retries: 2,
  retry: 1000,
  remove: true,
  poolSize: 10
});

// Test connection ping
cache.set('test_connection_key', 'ONLINE', 10, (err) => {
  if (err) {
    console.error('❌ Memcached Connection Failed:', err.message);
  } else {
    console.log('✔ Memcached Connection Established & Verified via RAM write.');
  }
});

module.exports = cache;