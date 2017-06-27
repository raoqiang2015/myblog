module.exports = {
  //parser: "babel-eslint",
  extends: "airbnb",
  rules: {
    "semi": ["error", "always"],
    "consistent-return": "off",
    "linebreak-style": "off",
    "no-var": "off",
    "no-param-reassign": 0,
    "no-underscore-dangle": 0
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
