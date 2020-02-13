(function () {
    
    rootFooter = document.querySelector('#footer');

  function render(data) {
    const json = JSON.parse(data);
    root.innerHTML = `<h1>${json.title}</h1><p>${json.content}</p>`;
  }

  function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
      el.appendChild(div.children[0]);
    }
  }

  function renderHtml(html, area) {
    const rootArea = document.querySelector(area);
    appendHtml(rootArea, html);
  }

  function get(url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', url);
      req.send();

      req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) resolve(req.response);
          else reject(req.statusText);
        }
      };
    });
  }

  const renderWidth = () => {

    const wrap = document.querySelector('#content_wrap');
    const item = document.querySelectorAll('.content_zone');

    wrap.style.setProperty('width', _winWid * 2 + 'px');
    wrap.classList.add('on');
    item.forEach(function(el){

        el.style.setProperty('width', _winWid + 'px');

    });

  };

  const renderAnimate = () => {

    const wrap = document.querySelector('#content_wrap');
    const item = document.querySelectorAll('.content_zone');

    wrap.style.setProperty('transition', 'all 1s ease');
    wrap.style.setProperty('transform', 'translate3d(' + -(_winWid) + 'px, 0, 0)');

    setTimeout(function(){
        wrap.classList.remove('on');
        wrap.style.removeProperty('transition', 'all 0.5s ease');
        wrap.style.removeProperty('width');
        wrap.style.setProperty('transform', 'translate3d(0, 0, 0)');
        item[0].remove();
    }, 500);
};

  const removeWidth = () => {

    const wrap = document.querySelector('#content_wrap');

    setTimeout(()=>{

      wrap.style.removeProperty('width');

    },500);
   
  };
  
  const routes = {
    '' : (hash) => {

      get('../html/header.html')
          .then(res => renderHtml(res, '#header'))
          .then(GNB());
      get('../html/main.html')
          .then(res => renderHtml(res, '#content_wrap'))
          .then(setTimeout(function(){
            MAINVISUAL();
          }, 100));
      
          
  },
  getHtml : (hash, arrSort) => {

      const joinArr = [arrSort, hash].join('/');
      get('../html/header.html')
          .then(res => renderHtml(res, '#header'))
          .then(GNB());
      get('../html/' + joinArr + '.html')
          .then(res => renderHtml(res, '#content_wrap'))
          .then(setTimeout(function(){
            MAINVISUAL();
          }, 100))
          .then(renderWidth())
          .then(renderAnimate());
      get('../html/footer.html')
          .then(res => renderHtml(res, '#footer'));

  },
    otherwise() {
      root.innerHTML = `${location.hash} Not Found`;
    }
  };

  const router = () => {

    const hash = location.hash.replace('#', '');
    const arrSort = hash.split('_');

    if(hash == '') (routes[hash] || routes.otherwise)();
    else routes.getHtml(hash, arrSort[1]);

  };

  window.addEventListener('hashchange', router);

  window.addEventListener('DOMContentLoaded', router);
}());