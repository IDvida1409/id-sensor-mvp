(() => {
  const link=document.createElement('a');link.className='qr-demo-launcher';link.textContent='QR da demonstração';link.href='/consulta/demo.html';link.target='_blank';link.rel='noopener';
  function mount(){const host=document.querySelector('.topbar .controls')||document.querySelector('.topbar');if(host&&!link.isConnected)host.append(link);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
