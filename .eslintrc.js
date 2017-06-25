module.exports = {
  //parser: "babel-eslint",
  extends: "airbnb",
  rules: {
    "semi": ["error", "always"],
    "consistent-return": "off"
  },
  parserOptions: {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  env: {
    "browser": true,
    "node": true
  }
};
