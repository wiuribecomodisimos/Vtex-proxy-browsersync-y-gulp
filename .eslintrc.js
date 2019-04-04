module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jquery": true
    },
    // "extends": "eslint:recommended",
    "extends": [
        "airbnb-base",
        "prettier",
        "eslint:recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "plugins": [
        "jquery",
        "prettier"
    ],
    "rules": {
        // disallow the use of console
        "no-console": 0,
        // ---------- Prettier ----------
        "prettier/prettier": [
            "error",
            {
                "trailingComma": "es5", // commas at the end ES5 (objects, arrays, etc.)
                "singleQuote": true, // Use single quotes instead of double quotes.
                "printWidth": 120, // Width of the column before breaking it
                "jsxBracketSameLine": true // place the > symbol at the end of the last line instead of a new line
            }
        ],  
    }
};

    