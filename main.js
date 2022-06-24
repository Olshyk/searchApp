function search() {
  const app = document.getElementById('app');

  const searchWrapper = createElement('div');

  const input = createElement('input' ,'search__input');
  searchWrapper.append(input);
  const suggestionBox = createElement('ul' ,'search__autocomplete');
  searchWrapper.append(suggestionBox);
  const list = createElement('ul' ,'list');

  app.append(searchWrapper);
  app.append(list);

  function createElement(tag, elementClass) {
    const element = document.createElement(tag);
    if (elementClass) {
      element.classList.add(elementClass);
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

  async function searchRepository() {
    if (input.value) {
      suggestionBox.innerHTML = '';
      let url = `https://api.github.com/search/repositories?q=${input.value}&sort=stars&per_page=5&order=desc&page=1`;
      return await fetch(url).then(response => {
        if (response.ok) {
          response.json().then(result => {
            result.items.forEach(item => {
              let suggestion = createElement('li', 'search__suggestion');
              suggestion.textContent = item.name;
              suggestionBox.append(suggestion);

              function addRepository () {
                let repository = createElement('li', 'list__item');
                repository.innerHTML = `<div>
                                    <p>Name: ${item.name}</p>
                                    <p>Owner: ${item.owner.login}</p>
                                    <p>Stars: ${item.stargazers_count}</p>
                                  </div>
                                  <button class="button" title="close"></button>`
                list.append(repository);
                suggestionBox.innerHTML = '';
                const button = repository.querySelector('.button');

                function clearList() {
                  list.removeChild(repository);
                  this.removeEventListener('click', clearList);
                }

                button.addEventListener('click', clearList);
                this.removeEventListener('click', addRepository);
              } 

              suggestion.addEventListener('click', addRepository);
            })
          })
        } 
      })
    } else {
      suggestionBox.innerHTML = '';
    }
  }

  input.addEventListener('input', debounce(searchRepository, 1000));
}


search();