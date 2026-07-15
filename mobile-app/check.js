require('@babel/register')({ presets: ['@babel/preset-env', '@babel/preset-react'] });
try {
  require('./src/screens/vendor/manpowerAgent/ManpowerDashboard.js');
  console.log("No syntax errors in ManpowerDashboard");
} catch (e) {
  console.error("Error:", e);
}
