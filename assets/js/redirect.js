/* Compatibility routes preserve record IDs and anchors without interpreting user input. */
(() => {
  'use strict';
  const target=document.body.dataset.redirect;
  if(!/^admin\/[a-z-]+\.html$/.test(target||''))return;
  const destination=new URL(target,location.href);
  destination.search=location.search;
  destination.hash=location.hash;
  const link=document.querySelector('a');
  if(link)link.href=destination.href;
  location.replace(destination.href);
})();
