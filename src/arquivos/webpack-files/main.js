function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  element.innerHTML = 2;

  console.log('test_source_map');

  [1, 2, 3].map(n => {
    console.log(n);
    return n + 1;
  });

  return element;
}

document.body.appendChild(component());
