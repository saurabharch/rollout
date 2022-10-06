
module.exports = {
    plugins: [
      require('postcss-import'),
      require('tailwindcss/nesting')(require('postcss-nesting')),
      require('tailwindcss'),
      require('autoprefixer'),
      require('postcss-preset-env')({
      features: { 'nesting-rules': false,
      'logical-properties-and-values': false, 
        'prefers-color-scheme-query': false, 
        'gap-properties': false,
        'custom-properties': false,
        'is-pseudo-class': false,
        'focus-within-pseudo-class': false,
        'focus-visible-pseudo-class': false,
        'color-functional-notation': false,
        'cascade-layers': false,
        'double-position-gradients': false,
        'has-pseudo-class': false,
     }
    }),
    ]
  };