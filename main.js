function search() {
  const app = document.getElementById('app');

  const searchWrapper = createElement('div');

  const input = createElement('input' ,'search__input');
  searchWrapper.append(input);
  const sugBox = createElement('ul' ,'search__autocomplete');
  searchWrapper.append(sugBox);
  const list = createElement('ul' ,'list');

  app.append(searchWrapper);
  app.append(list);

  function createElement(el, elClass) {
    const element = document.createElement(el);
    if (elClass) {
      element.classList.add(elClass);
    }
    return element;
  }

  function debounce(fn, debounceTime) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), debounceTime);
    }
  };

  async function searchRepo() {
    if (input.value) {
      sugBox.innerHTML = '';
      let url = `https://api.github.com/search/repositories?q=${input.value}&sort=stars&per_page=5&order=desc&page=1`;
      return await fetch(url).then(res => {
        if (res.ok) {
          res.json().then(result => {
            result.items.forEach(item => {
              let suggestion = createElement('li', 'search__suggestion');
              suggestion.textContent = item.name;
              sugBox.append(suggestion);
              suggestion.addEventListener('click', (e) => {
                let repo = createElement('li', 'list__item');
                repo.innerHTML = `<div>
                                    <p>Name: ${item.name}</p>
                                    <p>Owner: ${item.owner.login}</p>
                                    <p>Stars: ${item.stargazers_count}</p>
                                  </div>
                                  <button class="button" title="close"></button>`
                list.append(repo);
                sugBox.innerHTML = '';
                const btn = repo.querySelector('.button');
                btn.addEventListener('click', () => list.removeChild(repo));
              })
            })
          })
        } 
      })
    } else {
      sugBox.innerHTML = '';
    }
  }

  input.addEventListener('keyup', debounce(searchRepo, 1000));
}


search();