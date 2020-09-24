module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: true,
          node: "current",
          chrome: "58",
          ie: "11"
        }
      }
    ]
  ],
  dependencies: {
    "babel-core": "^6.26.3",
    "babel-jest": "^23.6.0",
    "babel-preset-env": "^1.7.0",
    jest: "^24.0.0"
  }
};
