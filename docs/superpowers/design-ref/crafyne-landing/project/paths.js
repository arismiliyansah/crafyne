/* Path resolution helpers — keep nav working from landing root OR /pages/ sub-pages */
(function () {
  const path = window.location.pathname;
  const inPages = path.includes('/pages/');
  // Landing file. Use encoded space so href stays valid.
  const LANDING = inPages ? '../Crafyne%20Landing.html' : 'Crafyne%20Landing.html';

  window.CRAFYNE_PATHS = {
    inPages,
    home: LANDING,
    landing(anchor) {
      if (!inPages && (path.endsWith('Crafyne Landing.html') || path === '/' || path.endsWith('/'))) {
        return anchor ? '#' + anchor : '#top';
      }
      return anchor ? LANDING + '#' + anchor : LANDING;
    },
    page(name) {
      // name like 'work', 'about', 'contact', 'careers', 'journal', 'case-halcyon'
      return inPages ? name + '.html' : 'pages/' + name + '.html';
    },
  };
})();
