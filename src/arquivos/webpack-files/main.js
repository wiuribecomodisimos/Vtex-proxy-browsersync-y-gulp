function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  element.innerHTML = 2;

  console.log('test_source_map');

  return element;
}

document.body.appendChild(component());
